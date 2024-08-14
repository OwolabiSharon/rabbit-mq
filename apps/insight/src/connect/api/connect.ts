import { publicKey, zeeh_private_key } from '../../config/index';
import axios from 'axios';
import { GenerateAnalytics } from '../dto/generate-analysis';
import { BadRequestException} from '@nestjs/common';

export async function generateStatement() {
  try {
    const config = {
        method: 'get',
        url: 'https://webhook.site/token/53cef988-9a66-4942-9eba-7944a2af1ed0/requests?sorting=newest',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': 'Bearer null', 
          'Cookie': 'XSRF-TOKEN=eyJpdiI6InJ6WHpQTWFaNUhIWlBXRkJOeXlNMUE9PSIsInZhbHVlIjoiMmZFaXljcVNMbzlNSEhFcFJEKzhQSXdCd0U5UExmNlZ0c3oxOEtTakwxZDRZVDd6Q0lOZmpGbVMxbHFWazJ3QiIsIm1hYyI6IjY0NDkwZGM4YzYwZTc5MWQzY2UwZmI0YzIzMGZmZTYyOTFiYWMyNzNlZTA4MzMxNmI2ZWYzN2Y0ZTcxY2EzZjkifQ%3D%3D; webhooksite_session=09aAfQ00H3edaZxe3XetxVpvOk79hDMBdGJCQk75'
        }
      };
      
      const webHookRes = await axios(config)
      const content = JSON.parse(webHookRes.data.data[0].content)
      const options = {
        method: 'get',
        url: `https://api.zeeh.africa/api/v1/statement/live/statement/${content.payload.accountId}?period=12`,
        headers: {
          'zeeh-private-key': zeeh_private_key,
          'publicKey': publicKey
        }
      };      

      const res = await axios(options)
      return {"data":res.data, "accountId":content.payload.accountId}

  } catch (error) {
    throw new BadRequestException(error.response.data)
  }
}
