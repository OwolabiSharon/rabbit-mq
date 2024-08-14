import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

type IMessage = {
  account: any;
  lastYear: any;
};

async function getFcmbStatements(message: IMessage) {
  const { account, lastYear } = message;
  try {
    const response = await axios.get('https://mobileappserver.fcmb.com/moneytor-service/api/v1/fcmb/transactions/filter', {
      params: {
        customerAccountId: account.customerAccountId,
        transactionType: '',
        startDate: lastYear,
        endDate: new Date(new Date()).getTime(),
        page: '1',
        pageSize: '1',
      },
      headers: {
        Host: 'mobileappserver.fcmb.com',
        Deviceid: account.deviceId,
        'Client-Id': '3MNT0001',
        Authorization: `bearer ${account.sessionId}`,
        'User-Agent': 'okhttp/4.9.3',
      },
    });

    const filePath = path.join(__dirname, `${account.customerAccountId}-statement.txt`);
    fs.writeFileSync(filePath, `${response.data.secretKey.replace(/\n/g, '')}\n${response.data.body}`);
    return 'done';
  } catch (error: any) {
    console.log(`Error getting fcmb statement ${error}`);
  }
}

process.on('message', (message) => {
  getFcmbStatements(message as IMessage)
    .then((data) => {
      if (typeof process.send === 'function') {
        process.send(data);
        setTimeout(() => {
          process.exit();
        }, 5000);
      }
    })
    .catch((err) => console.log('Error getting gtb statement', err));
});
