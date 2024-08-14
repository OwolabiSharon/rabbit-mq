import Express from 'express';
import { IAccount } from './account-interface';

export interface IDriverLicense {
  uuid: string;
  licenseNo: string;
  firstName: string;
  lastName: string;
  middleName: string;
  gender: string;
  issuedDate: string;
  expiryDate: string;
  stateOfIssue: string;
  birthDate: string;
  photo: string;
}

export interface IPassport {
  firstName: string;
  lastName: string;
  middleName: string;
  dob: string;
  mobile: string;
  photo: string;
  signature: string;
  gender: string;
  issuedAt: string;
  issuedDate: string;
  expiryDate: string;
  referenceId: string;
  passportNumber: string;
}

export interface IUser {
  firstName: string;
  lastName: string;
  businessName: string;
  email: string;
  password: string;
  companyName: string;
  rcNumber: string;
  companyAddress: string;
  industry: [{ label: string; value: string }];
  website: string;
  phoneNumber: string;
  isTermsAgreement: boolean;
  balance: number;
  isBalanceFunded: boolean;
  isBlocked: boolean;
  country: string;
  state: string;
  banks: [{ bankName: string; accountNumber: string; accountName: string }];
  address: string;
  supportPhone: string;
  supportEmail: string;
  isVerified: boolean;
  isBusinessVerified: boolean;
  businessVerifiedDate: boolean;
  verifiedDate: Date;
  // These will be used by the invited person
  // By default we have to add the owner of account to this list
  businesses: [
    {
      business: string;
      role: string;
      status: string;
      email: string;
      orgId: string;
      inviteExpirationDate: Date | null;
    },
  ];

  // This will be used by the invitee
  linkedBusinessnes: [
    {
      business: string;
      role: string;
      email: string;
      orgId: string;
    },
  ];
  verificationToken: string | null;
  verificationTokenExpiration: Date | null;
  passwordToken: string | null;
  passwordTokenExpirationDate: Date | null;
  pic: string;
  role: string;
  lastLogin: Date;
  orgId: string;
}

export interface IApi {
  privateKey: string;
  endpoint: string;
  status: string;
  amount: number;
  orgId: string;
  source: string;
}

export interface IRole {
  name: string;
  permissions: string[];
  orgId: string;
}

export interface TypeRequestBody<T> extends Express.Request {
  body: Partial<T>;
  params: any;
}

export interface IApp {
  logo: string;
  appName: string;
  displayName: string;
  productServices: [{ label: string; value: string }];
  accountType: [{ label: string; value: string }];
  industry: [{ label: string; value: string }];
  publicKey: string;
  sandBoxKey: string;
  privateKey: string;
  pageLink: string;
  sendNotificationTo: string;
  orgId: string;
}

export interface ITransaction {
  payStackReference: string;
  amount: number;
  currency: string;
  email: string;
  orgId: string;
  status: string; // determine if the transaction is free or paid
}

export interface IToken {
  refreshToken: string;
  ip: string;
  userAgent: string;
  isValid: boolean;
  user: string;
}

export interface IStatementPage {
  pageName: string;
  pageDescription: string;
  period: string;
  noOfAccount: number;
  dateCreated: Date;
  app: string;
  orgId: string;
}

export interface INin {
  nin: string;
  firstname: string;
  middlename: string;
  surname: string;
  telephoneno: string;
  profession: string;
  title: string;
  email: string;
  birthdate: string;
  birthstate: string;
  birthcountry: string;
  centralID: string;
  educationallevel: string;
  employmentstatus: string;
  nok_firstname: string;
  nok_middlename: string;
  nok_address1: string;
  nok_address2: string;
  nok_lga: string;
  nok_state: string;
  nok_town: string;
  nok_postalcode: string;
  pfirstname: string;
  photo: string;
  pmiddlename: string;
  psurname: string;
  spoken_language: string;
  ospokenlang: string;
  religion: string;
  residence_town: string;
  residence_lga: string;
  residence_state: string;
  residencestatus: string;
  residence_address: string;
  self_origin_lga: string;
  self_origin_place: string;
  self_origin_state: string;
  signature: string;
  gender: string;
  trackingId: string;
  nok_surname: string;
  maritalstatus: string;
  birthlga: string;
  heigth: string;
}

export interface BankStatementProps {
  type: string;
  date: Date;
  narration: string;
  amount: number | string;
  closingBalance: number;
  tranId: string;
}

export interface IBalance {
  balance: number;
  orgId: string;
}

export interface informationFromMiddleware {
  accounts: IAccount | IAccount[];
  privateKey: string;
  charges: number;
}

export interface IVin {
  vin: string;
  fullName: string;
  first_name: string;
  last_name: string;
  gender: string;
  occupation: string;
  timeOfRegistration: Date;
  state: string;
  lga: string;
  registrationAreaWard: string;
  pollingUnit: string;
  date_of_birth: Date;
  reference: string;
}

export interface ITin {
  tin: string;
  taxpayerName: string;
  cacRegNumber: string;
  firstTin: string;
  jitTin: string;
  taxOffice: string;
  email: string;
  phoneNumber: string;
}

export interface IPhoneNumber {
  nin: string;
  firstName: string;
  middleName: string;
  surname: string;
  maidenName: string;
  phoneNumber: string;
  telephoneNo: string;
  state: string;
  place: string;
  title: string;
  height: string;
  email: string;
  birthDate: Date;
  birthState: string;
  birthCountry: string;
  centralID: string;
  documentNo: string;
  educationalLevel: string;
  employmentStatus: string;
  maritalStatus: string;
  nokFirstName: string;
  nokMiddleName: string;
  nokAddress1: string;
  nokAddress2: string;
  nokLga: string;
  nokState: string;
  nokTown: string;
  nokPostalCode: string;
  otherName: string;
  pFirstName: string;
  photo: string;
  pMiddleName: string;
  pSurname: string;
  profession: string;
  nSpokenLang: string;
  oSpokenLang: string;
  religion: string;
  residenceTown: string;
  residenceLga: string;
  residenceState: string;
  residenceStatus: string;
  residenceAddressLine1: string;
  residenceAddressLine2: string;
  selfOriginLga: string;
  selfOriginPlace: string;
  selfOriginState: string;
  signature: string;
  nationality: string;
  gender: string;
  trackingId: string;
}

export interface INuban {
  nuban: string;
  accountName: string;
  identityNumber: string;
  identityType: string;
  bank: string;
  accountCurrency: string;
  firstName: string;
  lastName: string;
  otherNames: string;
  gender: string;
  dob: string;
  phone: string;
  postalCode: string;
  stateCode: string;
  countryCode: string;
  countryOfBirth: string;
  nationality: string;
  expiryDate: string;
  address1: string;
  address2: string;
  bankCode: string;
}
