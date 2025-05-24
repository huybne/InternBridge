import axiosPrivate from '../../api/axiosPrivate'; // import axiosPrivate đã cấu hình
import { AxiosResponse } from 'axios';

export const getBusinessImages = async () => {
  try {
    const response: AxiosResponse<any[]> = await axiosPrivate.get(
      `business/images/all`,
    );
    return response.data;
  } catch (error: any) {
    console.error('Error fetching business images:', error);
    throw new Error(error.response?.data?.message || 'Something went wrong');
  }
};

export const getAvatarBusiness = async () => {
  try {
    const response: AxiosResponse<any[]> = await axiosPrivate.get(
      `business/images/avatar`,
    );
    return response.data;
  } catch (error: any) {
    console.error('Error fetching business images:', error);
    throw new Error(error.response?.data?.message || 'Something went wrong');
  }
};

export const deleteBusinessImage = async (imageId: string) => {
  try {
    const response: AxiosResponse<any> = await axiosPrivate.put(
      `/business/images/delete/${imageId}`,
    );
    return response.data;
  } catch (error: any) {
    console.error('Error deleting business image:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete image');
  }
};

export const uploadImagesBusiness2 = async (files: File[]) => {
  try {
    const formData = new FormData();

    // Thêm các file vào formData
    files.forEach((file) => {
      formData.append('files', file); // Đảm bảo tên trường là 'files' như API yêu cầu
    });

    // Gửi yêu cầu POST với axios
    const response = await axiosPrivate.post(
      'business/images/upload2',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data', // Đảm bảo Content-Type là 'multipart/form-data'
        },
      },
    );
    console.log(response.data); // Trả về dữ liệu phản hồi từ API)

    return true; // Trả về dữ liệu phản hồi từ API
  } catch (error: any) {
    console.error('Error uploading images:', error);
    return false;
  }
};
