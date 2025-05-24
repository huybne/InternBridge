
import { AxiosResponse } from 'axios';
import qs from 'qs';
import axiosPrivate from '../../../api/axiosPrivate';
import axiosPublic from '../../../api/axiosPublic';
export const sendRequestCreateJob = async (jobPostingsRequestDTO: any) => {
  try {
    const response: AxiosResponse<any> = await axiosPrivate.post(
      `job-postings/send-request-job-posting`,
      jobPostingsRequestDTO,
    );

    return response.data;
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    throw new Error(error.response?.data?.message || 'Something went wrong');
  }
};

export const updateJobPosting = async (jobPostingsRequestDTO: any) => {
  try {
    const response: AxiosResponse<any> = await axiosPrivate.put(
      `job-postings/update-job-posting`,
      jobPostingsRequestDTO,
    );

    return response.data;
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    throw new Error(error.response?.data?.message || 'Something went wrong');
  }
};

export const saveDraftJob = async (jobPostingsRequestDTO: any) => {
  try {
    const response: AxiosResponse<any> = await axiosPrivate.post(
      `job-postings/save-draft-job-posting`,
      jobPostingsRequestDTO,
    );

    return response.data;
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    throw new Error(error.response?.data?.message || 'Something went wrong');
  }
};

export const sendDraftJob = async (jobId: string): Promise<any> => {
  try {
    const response: AxiosResponse<any> = await axiosPrivate.put(
      `job-postings/send-draft/${jobId}`,
    );

    return response.data;
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    throw new Error(error.response?.data?.message || 'Something went wrong');
  }
};

export const getListJobCreated = async (offset: number, limit: number) => {
  try {
    const response: AxiosResponse<any> = await axiosPrivate.get(
      `job-postings/view-list-job-created`,
      {
        params: {
          offset,
          limit,
        },
      },
    );

    return response.data;
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    throw new Error(error.response?.data?.message || 'Something went wrong');
  }
};

export const checkStudentProfileApproval = async () => {
  try {
    const response: AxiosResponse<boolean> =
      await axiosPrivateProfileServcie.get<AxiosResponse<boolean>>(
        '/student_profiles/checkprofileApprove',
      );
    return response.data.data;
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    return false;
  }
};

export const getDetailJob = async (jobId: string) => {
  try {
    const response: AxiosResponse<any> = await axiosPrivatePublic.get(
      `job-postings/detail-job/${jobId}`,
    );

    return response.data;
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    throw new Error(error.response?.data?.message || 'Something went wrong');
  }
};

export const acceptJob = async (jobId: string): Promise<any> => {
  try {
    const response: AxiosResponse<any> = await axiosPrivate.put(
      `job-postings/${jobId}/accept`,
    );

    return response.data;
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    throw new Error(error.response?.data?.message || 'Something went wrong');
  }
};

export const rejectJob = async (
  jobId: string,
  reasonReject: string,
): Promise<any> => {
  try {
    const response: AxiosResponse<any> = await axiosPrivate.put(
      `job-postings/${jobId}/reject`,
      { reasonReject },
    );

    return response.data;
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    throw new Error(error.response?.data?.message || 'Something went wrong');
  }
};

export const bannedJob = async (jobId: string): Promise<any> => {
  try {
    const response: AxiosResponse<any> = await axiosPrivate.put(
      `job-postings/${jobId}/banned`,
    );

    return response.data;
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    throw new Error(error.response?.data?.message || 'Something went wrong');
  }
};

export const getListPublicJob = async (
  offset: number,
  limit: number,
  searchKeyword: string,
  location: string,
  companyName: string,
  isUrgent: number,
  sortByExpirationDate: boolean,
  categoryIds: any[],
) => {
  const categoryid = categoryIds.map((e) => {
    return e.value;
  });
  try {
    const response: AxiosResponse<any> = await axiosPublic.get(
      `job-postings/view-all-public-job`,
      {
        params: {
          offset,
          limit,
          searchkeyword: searchKeyword,
          location: location,
          company_name: companyName,
          isurgen: isUrgent,
          sortByexpirationDate: sortByExpirationDate,
          categoryid,
        },
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: 'repeat' }); // Removes [] and repeats the key
        },
      },
    );

    return response.data;
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    throw new Error(error.response?.data?.message || 'Something went wrong');
  }
};

export const hideJob = async (jobId: string): Promise<any> => {
  try {
    const response: AxiosResponse<any> = await axiosPublic.put(
      `job-postings/hide-job-posting/${jobId}`,
    );

    return response.data;
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    throw new Error(error.response?.data?.message || 'Something went wrong');
  }
};

export const unHideJob = async (jobId: string): Promise<any> => {
  try {
    const response: AxiosResponse<any> = await axiosPublic.put(
      `job-postings/unhide-job-posting/${jobId}`,
    );

    return response.data;
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    throw new Error(error.response?.data?.message || 'Something went wrong');
  }
};

export const getPublicJobListByBusinessId = async (
  offset: number,
  limit: number,
) => {
  try {
    const response: AxiosResponse<any> = await axiosPublic.get(
      `job-postings/view-list-job-public`,
      {
        params: {
          offset,
          limit,
        },
      },
    );

    return response.data;
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    throw new Error(error.response?.data?.message || 'Something went wrong');
  }
};

export const getRandomJob = async () => {
  try {
    const response: AxiosResponse<any> = await axiosPublic.get(
      `job-postings/get-random-jobs`,
    );

    return response.data;
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    throw new Error(error.response?.data?.message || 'Something went wrong');
  }
};
