// features/interview/interviewSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosPrivate from "../../../api/axiosPrivate";

interface Interview {
  interviewId: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  location: string;
  interviewTime: string;
  status: string;
}

interface InterviewResponse {
  code: number;
  message: string;
  data: {
    data: Interview[];
    totalRecords: number;
    currentPage: number;
    pageSize: number;
    totalPages: number;
  };
}

interface InterviewState {
  interviews: Interview[];
  selectedDateInterviews: Interview[];
  loading: boolean;
  error: string | null;
}

const initialState: InterviewState = {
  interviews: [],
  selectedDateInterviews: [],
  loading: false,
  error: null,
};

export const fetchInterviews = createAsyncThunk<
  InterviewResponse,
  { page?: number; pageSize?: number },
  { rejectValue: string }
>("interview/fetchInterviews", async ({ page = 1, pageSize = 10 }, { rejectWithValue }) => {
  try {
    const offset = (page - 1) * pageSize;
    const limit = pageSize;

    const response = await axiosPrivate.get<InterviewResponse>(
      "/interviews/get-interviews-schedules/me",
      {
        params: { offset, limit },
      }
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch interviews");
  }
});

export const updateInterviewStatusThunk = createAsyncThunk<
  string, // interviewId
  { interviewId: string; status: "COMPLETED" | "CANCELLED" },
  { rejectValue: string }
>("interview/updateInterviewStatus", async ({ interviewId, status }, { dispatch, rejectWithValue }) => {
  try {
    await axiosPrivate.patch(`/interviews/update-interview-status/${interviewId}`, { status });

    // Refetch interviews
    await dispatch(fetchInterviews({ page: 1, pageSize: 10 }));

    return interviewId;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to update interview status");
  }
});

const interviewReducer = createSlice({
  name: "interview",
  initialState,
  reducers: {
    setSelectedDateInterviews: (state, action) => {
      state.selectedDateInterviews = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInterviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInterviews.fulfilled, (state, action) => {
        state.loading = false;
        state.interviews = action.payload.data.data;
      })
      .addCase(fetchInterviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch interviews";
      });
  },
});

export const { setSelectedDateInterviews } = interviewReducer.actions;
export default interviewReducer.reducer;
