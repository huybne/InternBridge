import { AxiosResponse } from 'axios';
import axiosPrivate from '../../../api/axiosPrivate';

export const viewListApplyJob = async (
  jobId: string,
  cursor: string | null = null,
  limit: number = 10,
): Promise<{
  listApplyJob: any[];
  nextCursor: string | null;
}> => {
  try {
    const response: AxiosResponse<any> = await axiosPrivate.get(
      `apply-jobs/view-list-apply-job/${jobId}`,
      {
        params: {
          ...(cursor && { cursor }),
          //   cursor: cursor ?? '',
          limit,
        },
      },
    );

    const data = response.data.data;

    return {
      listApplyJob: data.listApplyJob,
      nextCursor: data.nextCursor,
    };
  } catch (error: any) {
    console.error('Error fetching apply jobs:', error);
    throw new Error(error.response?.data?.message || 'Something went wrong');
  }
};

export const acceptApplyJob = async (applyId: string): Promise<void> => {
  try {
    const response: AxiosResponse<any> = await axiosPrivate.put(
      `apply-jobs/${applyId}/accepted`,
    );
    const data = response.data.data;
    return data;
  } catch (error: any) {
    console.error('Error accepting apply job:', error);
    throw new Error(error.response?.data?.message || 'Something went wrong');
  }
};

export const rejectApplyJob = async (applyId: string): Promise<void> => {
  try {
    const response: AxiosResponse<any> = await axiosPrivate.put(
      `apply-jobs/${applyId}/rejected`,
    );
    const data = response.data.data;
    return data;
  } catch (error: any) {
    console.error('Error rejecting apply job:', error);
    throw new Error(error.response?.data?.message || 'Something went wrong');
  }
};

export const viewDetailApplyJob = async (applyId: string) => {
  try {
    const response: AxiosResponse<any> = await axiosPrivate.get(
      `apply-jobs/view-detail-apply-job/${applyId}`,
    );
    const data = response.data.data;
    console.log('Detail Apply Job:', data);

    return data;
  } catch (error: any) {
    console.error('Error fetching apply job details:', error);
    throw new Error(error.response?.data?.message || 'Something went wrong');
  }
};

export const getCvByCvIdAndStudentId = async (
  cvId: string,
  studentId: string,
): Promise<any> => {
  try {
    const response: AxiosResponse<any> = await axiosPrivate.get(
      `cv/get-cv/${cvId}/${studentId}`,
    );
    const data = response.data.data;
    return data;
  } catch (error: any) {
    console.error('Error fetching CV:', error);
    throw new Error(error.response?.data?.message || 'Something went wrong');
  }
};

export const updateCvId = async (
  applyId: string,
  cvId: string,
): Promise<void> => {
  try {
    const response: AxiosResponse<any> = await axiosPrivate.put(
      `apply-jobs/${applyId}/update-cv/${cvId}`,
    );
    const data = response.data.data;
    return data;
  } catch (error: any) {
    console.error('Error updating CV ID:', error);
    throw new Error(error.response?.data?.message || 'Something went wrong');
  }
};
