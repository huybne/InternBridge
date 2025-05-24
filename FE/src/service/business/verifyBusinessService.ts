import axiosPrivate from '../../api/axiosPrivate';

interface VerifyBusinessResponse {
  success: boolean;
  message: string;
  data: any;
}

export const verifyBusiness = async (
  businessData: any,
): Promise<boolean> => {
  try {
    const response =
      await axiosPrivate.post('/business/verify', businessData);
    return true;
  } catch (error: any) {
    console.error('Error verifying business:', error);
    return false;
  }
};

export const sendRequest = async ()  => {
  try {
    const response =
      await axiosPrivate.post("/request-business/insert-request-business");
    return true;
  } catch (error: any) {
    console.error('Error verifying business:', error);
    return false;
  }
}
