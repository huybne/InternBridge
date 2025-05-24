import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosPrivate from "../../api/axiosPrivate";

export interface ApplyJobsDTO {
  applyId: string;
  jobId: string;
  studentId: string;
  cvId: string;
  studentName: string;
  studentDateOfBirth: string;
  studentUniversity: string;
  studentAvatarUrl: string;
  status: string;
  appliedAt: string;
  viewedAt: string | null;
  isDeleted: boolean;
  updatedAt: string;
}

export interface ApplyJobRequest {
  jobId: string;
  cvId: string;
}

export interface PaginatedApplyJobResponse {
  myApplyJobs: ApplyJobsDTO[];
  nextCursor: string | null;
}

interface ApplyJobsState {
  applyJobs: ApplyJobsDTO[];
  nextCursor: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: ApplyJobsState = {
  applyJobs: [],
  nextCursor: null,
  loading: false,
  error: null,
};

export const sendApplyJob = createAsyncThunk<
  ApplyJobsDTO,
  ApplyJobRequest,
  { rejectValue: string }
>("applyJobs/sendApplyJob", async (payload, { rejectWithValue }) => {
  try {
    const response = await axiosPrivate.post<{
      data: ApplyJobsDTO;
    }>("/apply-jobs/send-apply-job", payload);

    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to send apply job"
    );
  }
});

export const fetchMyApplyJobs = createAsyncThunk<
  PaginatedApplyJobResponse,
  { cursor?: string; limit?: number },
  { rejectValue: string }
>("applyJobs/fetchMyApplyJobs", async ({ cursor, limit = 10 }, { rejectWithValue }) => {
  try {
    const queryParams = new URLSearchParams();
    if (cursor) queryParams.append("cursor", cursor);
    queryParams.append("limit", limit.toString());

    const response = await axiosPrivate.get<{
      data: PaginatedApplyJobResponse;
    }>(`/apply-jobs/my-apply-jobs?${queryParams.toString()}`);

    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch applied jobs"
    );
  }
});

const applyJobsReducer = createSlice({
  name: "applyJobs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sendApplyJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendApplyJob.fulfilled, (state, action) => {
        state.loading = false;
        state.applyJobs.unshift(action.payload);
      })
      .addCase(sendApplyJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to send apply job";
      });

    builder
      .addCase(fetchMyApplyJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyApplyJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.applyJobs = action.payload.myApplyJobs;
        state.nextCursor = action.payload.nextCursor;
      })
      .addCase(fetchMyApplyJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch applied jobs";
      });
  },
});

export default applyJobsReducer.reducer;
