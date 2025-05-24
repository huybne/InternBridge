import axiosPrivate from '../../api/axiosPrivate'; // import axiosPrivate đã cấu hình
import { AxiosResponse } from 'axios';

interface MyBusinessResponse {
  success: boolean;
  message: string;
  data: any;
}

export interface BusinessProfilesForUpdate {
  companyName: string;
  industry: string;
  companyInfo: string;
  websiteUrl: string;
  taxCode: string;
  email: string;
  phoneNumber: string;
  address: string;
  Image_Avatar_url: string;
  imagesOldImg: string[];
}

export const getMyBusiness = async () => {
  try {
    const response: AxiosResponse<MyBusinessResponse> = await axiosPrivate.get(
      'business/me',
    );
    return response.data;
  } catch (error: any) {
    console.error('Error fetching business info:', error);
    throw new Error(error.response?.data?.message || 'Something went wrong');
  }
};

export const getBusinessById = async (businessId: string) => {
  try {
    const response: AxiosResponse<MyBusinessResponse> = await axiosPrivate.get(
      `business/business-profile/${businessId}`,
    );
    return response.data;
  } catch (error: any) {
    console.error('Error fetching business info:', error);
    throw new Error(error.response?.data?.message || 'Something went wrong');
  }
};

export const updateBusiness = async (
  data: BusinessProfilesForUpdate,
): Promise<MyBusinessResponse> => {
  try {
    const response: AxiosResponse<MyBusinessResponse> = await axiosPrivate.put(
      'business/update',
      data,
    );
    return response.data;
  } catch (error: any) {
    console.error('Error updating business info:', error);
    // Trả lại thông điệp lỗi từ API nếu có, nếu không có thì thông báo lỗi chung
    throw new Error(error.response?.data?.message || 'Something went wrong');
  }
};
