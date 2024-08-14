import { client_id, client_secret } from '../../config/index';
import axios from 'axios';
import { BadRequestException} from '@nestjs/common';

export async function generateAnalytics(statementName, statement) {
  try {
    const data = JSON.stringify({
        "client_id": client_id,
        "client_secret": client_secret,
        "audience": "https://api.insights-periculum.com",
        "grant_type": "client_credentials"
      });
      
      var config = {
        method: 'post',
        url: 'https://periculum-technologies-inc.auth0.com/oauth/token',
        headers: { 
          'Content-Type': 'application/json', 
          //'Cookie': 'did=s%3Av0%3Af177ad80-6681-11ed-b2f5-1f33f89bb54b.HXA6ocXlMqpqQDAbKlkbpXPLJ80Y3f21WqbRikHGvBE; did_compat=s%3Av0%3Af177ad80-6681-11ed-b2f5-1f33f89bb54b.HXA6ocXlMqpqQDAbKlkbpXPLJ80Y3f21WqbRikHGvBE'
        },
        data : data
      };
      const authRes = await axios(config)
      
      const dojahData = ({
        "statementName": statementName,
        "meta":{
          "count":statement.meta.count
        },
        "data":statement.data
    })
    const config2 = {
        method: 'post',
        url: 'https://api.insights-periculum.com/statements/analytics?format=mono',
        headers: { 
          'Authorization': `Bearer ${authRes.data.access_token}`, 
          'Content-Type': 'application/json'
        },
        data : dojahData
      };
    const res = await axios(config2)
    console.log(res);
    
    return res.data;

  } catch (error) {
    console.log(error);
    
    throw new BadRequestException(error.response.data)
  }
}
