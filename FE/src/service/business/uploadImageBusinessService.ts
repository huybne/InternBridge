import axiosPrivate from '../../api/axiosPrivate';
import { ApiResponse } from '../../features/auth/authType';
//import { AxiosResponse } from 'axios';

interface UploadImageResponse {
  code: number;
  message: string;
  data: ImageBusiness[];
}

export interface ImageBusiness {
  imageId: string;
  businessId: string;
  ImageUrl: string;
  isDeleted: string;
  updatedAt: string;
}

export const uploadBusinessImages = async (
  files: File[],
): Promise<boolean> => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });

  try {
    const response =
      await axiosPrivate.post(
        '/business/images/upload',
        formData,
        //     , {
        //     headers: {
        //       'Content-Type': 'multipart/form-data',
        //     },
        //   }
      );

    console.log(response.data);
    return true;
  } catch (error: any) {
    console.error('Error uploading business images:', error);
    return false;
  }
};

export const uploadAvatar = async (file: File): Promise<string | null> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axiosPrivate.post<ApiResponse<any>>('business/uploadavatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log(response.data);
    // Giả sử response.data có kiểu ApiResponse<String> như backend trả về
    if (response.data && response.data.code === 200) {
      return response.data.data; // trả về URL ảnh
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error uploading avatar:', error);
    return null;
  }
};
