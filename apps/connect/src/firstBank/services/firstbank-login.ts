import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import { CheckForDuplicateAccountService } from '../../account/services/duplicate-account-check';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerAccount, Encrypt, getDateRange, RmqService } from '@app/common';
import { Repository } from 'typeorm';
import { generateHexValue } from '@app/common/utils/banks';
import { GenerateFirstBankStatement } from './firstbank-generate-statement';
import { FirstBankLoginDto, FirstBankQueryDto } from '../dto/firstbank.dto';
import { getCredentialsWithAccount } from '../functions';
import { sharedNewDeviceFunction } from '../functions/new-device';
import FirstBankHeaders from '../api/headers';
import { FirstBankAuthProcess } from './firstbank-auth';
import { FirstBankSendRequest } from '../api/firstbank-fetch';
import { RmqContext, RpcException } from '@nestjs/microservices';

@Injectable()
export class FirstBankLoginService {
  private readonly logger = new Logger(FirstBankLoginService.name);

  constructor(
    private readonly checkForDuplicateAccountService: CheckForDuplicateAccountService,
    @InjectRepository(CustomerAccount)
    private readonly accountRepo: Repository<CustomerAccount>,
    private readonly firstBankGenerateStatement: GenerateFirstBankStatement,
    private readonly firstBankAuthProcess: FirstBankAuthProcess,
    private readonly rmqService: RmqService,
  ) {}

  async execute(query: FirstBankQueryDto, data: FirstBankLoginDto, context: RmqContext) {
    try {
      const { account_no, resend, checkOtp, resendmPin } = query;
      if (account_no) {
        const { device_id } = query;

        const filePath = path.join(__dirname, `../../public/account/firstBank_${device_id}.json`);

        const readSavedFile = fs.readFileSync(filePath, 'utf8');
        const readableVersion = await JSON.parse(readSavedFile);

        const accountIndex = readableVersion.accounts.findIndex(
          (account: any) => account.accountNumber === account_no,
        );
        const accountsToSave = getCredentialsWithAccount(readableVersion, accountIndex);

        const check = await this.checkForDuplicateAccountService.execute({
          account_no: accountsToSave.account_no,
          business_id: readableVersion.business_id,
          public_key: readableVersion.public_key,
        });

        if (check) {
          throw new BadRequestException('Account has been linked');
        }

        if (check) return;

        // get the other userData save to a file
        const firstBankPath = path.join(
          __dirname,
          `../../public/firstBank/firstBank_${device_id}.json`,
        );
        const dataReaded = fs.readFileSync(firstBankPath, 'utf8');
        const newAccountToSave = await JSON.parse(dataReaded);
        fs.unlink(firstBankPath, (err) => {
          if (err)
            this.logger.error(
              `Error unlinking firstBank file after selecting multiple account. ${err}`,
            );
        });
        newAccountToSave.account_no = accountsToSave.account_no;
        newAccountToSave.account_type = accountsToSave.account_type;
        newAccountToSave.currency = accountsToSave.currency;
        newAccountToSave.account_status = accountsToSave.account_status;
        newAccountToSave.balance = accountsToSave.balance;
        const account: any = await this.accountRepo.save(newAccountToSave);

        /*   Account statement     */
        const today = new Date();
        const lastYear = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());

        const dateRange = getDateRange(lastYear, today);

        await this.firstBankGenerateStatement.execute(account, dateRange);

        fs.unlink(filePath, (err) => {
          if (err)
            this.logger.error(
              `Error removing the file we saved multiple accounts into Error:${err?.message}`,
            );
        });

        return {
          message: 'ok',
          account: {
            _id: account.id,
            institution: {
              name: account.bank_name,
              bankCode: account?.bank_code,
              type: account?.account_type,
            },
            name: account.full_name,
            accountNumber: account.account_no,
            balance: account?.balance,
            currency: account?.currency,
            userReference: account?.user_reference,
            bvn: account?.bvn?.substring(0, 4),
          },
        };
      }

      if (resend) {
        const { card_no, card_pin } = data;
        const cardDetails = fs.readFileSync(
          path.join(__dirname, `../../public/firstBank/${card_no}.json`),
          'utf-8',
        );

        const parsedDetails = JSON.parse(cardDetails);

        const readableNewDeviceResend = await sharedNewDeviceFunction(
          generateHexValue(),
          parsedDetails.cardNumber,
          parsedDetails.cardPin,
          parsedDetails.mPin,
          parsedDetails.publicKey,
          parsedDetails.orgId,
          parsedDetails.userReference,
        );

        if (!readableNewDeviceResend) return;
      }

      if (checkOtp) {
        const { card_no, otp, card_pin } = data;
        const cardDetails = fs.readFileSync(
          path.join(__dirname, `../../public/firstBank/${card_no}.json`),
          'utf-8',
        );
        const parsedCardDetails = JSON.parse(cardDetails);

        const otpMesage = JSON.stringify({
          deviceID: parsedCardDetails.deviceID,
          otp,
        });

        const encryptedOtpMessage = await Encrypt(otpMesage, parsedCardDetails.deviceID);

        const verifyOTPHeaders = FirstBankHeaders(parsedCardDetails.deviceID, null, 64);

        const readableverifyResponse = await FirstBankSendRequest(
          'https://mobapp.firstbanknigeria.com/FBN-Proxy/api/v2/user/deviceActivation/complete',
          encryptedOtpMessage,
          verifyOTPHeaders,
          parsedCardDetails.deviceID,
        );

        if (readableverifyResponse?.code !== 0) {
          throw new InternalServerErrorException({
            status: 'error',
            code: readableverifyResponse.code,
            message: readableverifyResponse.description,
          });
        }

        /** ****Starts The Auth Process******* */
        const device_id = parsedCardDetails.deviceID;
        const pin = parsedCardDetails.mPin;
        const { public_key, business_id, user_reference } = parsedCardDetails;
        await this.firstBankAuthProcess.execute(
          device_id,
          pin,
          public_key,
          business_id,
          card_no,
          user_reference,
        );
        console.log('done');
      }

      if (resendmPin) {
        const { card_no, mPin, card_pin, business_id, public_key } = data;
        const cardDetails = fs.readFileSync(
          path.join(__dirname, `../../public/firstBank/${card_no}.json`),
          'utf-8',
        );
        const parsedCardDetails = JSON.parse(cardDetails);

        /** ****Starts The Auth Process******* */
        const { device_id } = parsedCardDetails;
        const pin = mPin;
        const { user_reference } = parsedCardDetails;
        await this.firstBankAuthProcess.execute(
          device_id,
          pin,
          public_key,
          business_id,
          card_no,
          user_reference,
        );
      }

      const { card_no, card_pin, business_id, public_key, mPin } = data;
      const user_reference = query.user_reference || generateHexValue(32);
      const newDeviceId = generateHexValue();

      const readableNewDevice = await sharedNewDeviceFunction(
        newDeviceId,
        card_no,
        card_pin,
        mPin,
        public_key,
        business_id,
        user_reference,
      );

      return readableNewDevice;
    } catch (error) {
      this.logger.error(error);
      this.rmqService.ack(context);
      throw new RpcException(error);
    }
  }
}
