import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosPrivate from "../../api/axiosPrivate";

export interface JobPostingsResponseDTO {
  jobId: string;
  businessId: string;
  companyName: string;
  avatarUrl: string;
  title: string;
  description: string;
  location: string;
  numberEmployees: number;
  status: number;
  isUrgentRecruitment: boolean;
  expirationDate: string;
  isDeleted: boolean;
  updatedAt: string;
  salary: string;
  categoryNames: string[];
}

export interface PaginatedJobResponse {
  data: JobPostingsResponseDTO[];
  totalRecords: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
}

interface JobListState {
  jobsByStatus: JobPostingsResponseDTO[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalRecords: number;
    pageSize: number;
  };
  loading: boolean;
  error: string | null;
}

const initialState: JobListState = {
  jobsByStatus: [],
  pagination: {
    currentPage: 1,
    totalPages: 0,
    totalRecords: 0,
    pageSize: 10,
  },
  loading: false,
  error: null,
};
export const fetchJobPostingsByStatus = createAsyncThunk<
  PaginatedJobResponse,
  { status: number; offset: number; limit: number; keyword?: string },
  { rejectValue: string }
>(
  "jobList/fetchJobPostingsByStatus",
  async ({ status, offset, limit, keyword }, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams({
        status: status.toString(),
        offset: offset.toString(),
        limit: limit.toString(),
      });

      if (keyword && keyword.trim() !== "") {
        queryParams.append("keyword", keyword.trim());
      }

      const response = await axiosPrivate.get<{
        data: PaginatedJobResponse;
      }>(`/job-postings/status?${queryParams.toString()}`);

      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch jobs by status"
      );
    }
  }
);

export const acceptJobPosting = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>("jobList/acceptJobPosting", async (jobId, { rejectWithValue }) => {
  try {
    await axiosPrivate.put(`/job-postings/${jobId}/accept`);
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to accept job posting"
    );
  }
});

export const rejectJobPosting = createAsyncThunk<
  void,
  { jobId: string; reasonReject: string },
  { rejectValue: string }
>(
  "jobList/rejectJobPosting",
  async ({ jobId, reasonReject }, { rejectWithValue }) => {
    try {
      await axiosPrivate.put(`/job-postings/${jobId}/reject`, {
        reasonReject,
      });
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to reject job posting"
      );
    }
  }
);

const jobList = createSlice({
  name: "jobList",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobPostingsByStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobPostingsByStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.jobsByStatus = action.payload.data;
        state.pagination = {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          totalRecords: action.payload.totalRecords,
          pageSize: action.payload.pageSize,
        };
      })
      .addCase(fetchJobPostingsByStatus.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed to fetch job postings by status";
      });
    builder
      .addCase(acceptJobPosting.pending, (state) => {
        state.loading = true;
      })
      .addCase(acceptJobPosting.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(acceptJobPosting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to accept job posting";
      })

      .addCase(rejectJobPosting.pending, (state) => {
        state.loading = true;
      })
      .addCase(rejectJobPosting.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(rejectJobPosting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to reject job posting";
      });
  },
});

export default jobList.reducer;
