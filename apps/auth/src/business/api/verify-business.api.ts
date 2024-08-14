import { BadRequestException } from '@nestjs/common';
import axios from 'axios';

export async function verifyBusiness(rc_number: string, business_name: string) {
  try {
    const { data } = await axios.post(
      'https://searchapp.cac.gov.ng/searchapp/api/public-search/company-business-name-it',
      { searchTerm: rc_number },
    );

    if (!data.data) {
      throw new BadRequestException('please pass in a valid rcNumber');
    }

    if (data?.data > 1) {
      throw new BadRequestException('please pass in a valid rcNumber');
    }

    const rcData = data?.data[0];
    if (rcData?.approvedName !== business_name || rcData?.rcNumber !== rc_number) {
      throw new BadRequestException('Either your rcNumber or businessName is incorrect');
    }
    return rcData;
  } catch (error) {
    throw error;
  }
}
