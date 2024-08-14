import { User,Business,ApiCall } from '@app/common';
import { Injectable, UnprocessableEntityException, Logger } from '@nestjs/common';;
import { randomBytes } from 'crypto';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository, LessThan, MoreThan} from "typeorm";
import { BadRequestException} from '@nestjs/common';
import moment from 'moment'; 




@Injectable()
export class InternalTeamService {
 
  constructor(
    @InjectRepository(User)
    private readonly user: Repository<User> ,

    @InjectRepository(ApiCall)
    private readonly apiCall: Repository<ApiCall> ,

    @InjectRepository(Business)
    private readonly business: Repository<Business> ,

  ) {}

  async getAllUsers(data: any){
    try {
      const users = await this.user.find({
        relations: ['business', 'business.api_calls'],
    });
    
    const response = [] 
    for (var i = 0; i < users.length; i++) {
        var user = users[i];
        var totalApiCalls = 0
        var totalRevenue = 0
        user.business.forEach(business => {
            const ApiCalls = business.api_calls.length
            totalApiCalls += ApiCalls
            const revenue = business.api_calls.map((apiCall) => apiCall.charge).reduce((a, b) => a + b);
            totalRevenue += revenue
        });

        const userData = {
            user,
            "totalApiCalls": totalApiCalls,
            "Revenue generated": totalRevenue
        }
        
        response.push(userData)

    }
    return response
  }
  catch(error){
    throw new BadRequestException(error);
  };
}

async getAllCustomer(data: any){
  try {

    const d = new Date()
    d.setMonth(d.getMonth() - 1);

    const activeUsers = await this.user.find({
      where: { updated_at:  LessThan(d)},
    });

    d.setMonth(d.getMonth() - 2);
    const churnedUsers = await this.user.find({
      where: { updated_at:  MoreThan(d) },
    });



    const apiCallsLastMonth = await this.apiCall.find({
      where: { createdAt:  LessThan(d) },
    });

    var monthlyRevenue = 0;
    for (var i = 0; i < apiCallsLastMonth.length; i++) {
      var apiCall = apiCallsLastMonth[i];
      monthlyRevenue += apiCall.charge
    }

    const allApiCalls = await this.apiCall.find();
    d.setMonth(d.getMonth() - 1);
    
    
  const response = {
    "activeUsers":activeUsers,
    "churnedUsers":churnedUsers,
    "monthlyRevenue":monthlyRevenue,
    "totalApiCalls":allApiCalls.length,
  } 

  return response
}
catch(error){
  throw new BadRequestException(error);
};
}

}