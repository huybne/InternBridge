import axiosPrivate from "../../../api/axiosPrivate";

export interface ApplyJobDTO {
  applyId: string;
  jobId: string;
  cvId: string;
  applyStatus:string; 
  applyDate: string; 
  jobTitle: string;
  companyName: string;
  location: string;
  salary: number;
  jobStatus: string; 
}
export interface ApplyJobsResponse {
  myApplyJobs: ApplyJobDTO[];
  nextCursor: string | null;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export const getMyApplyJobs = async (
  status?: 'pending' | 'accepted',
  cursor?: string,
  limit: number = 10
): Promise<ApiResponse<ApplyJobsResponse>> => {
  const params: any = { limit };
  if (status) params.status = status;
  if (cursor) params.cursor = cursor;

  const response = await axiosPrivate.get<ApiResponse<ApplyJobsResponse>>(
    '/apply-jobs/my-apply-jobs',
    {
      params,
      withCredentials: true,
    }
  );

  return response.data;
};
