import axiosPrivate from "../../api/axiosPrivate";
import axiosPrivate from "../../api/axiosPrivate";
import {
  ApiResponse,
  CountResponse,
  PaginatedResponse,
  UserReportResponse,
  UserStaffAdmin,
  UserStatsResponse,
} from "./adminType";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface AdminState {
  users: UserStaffAdmin[];
  total: number;
  currentPage: number;
  pageSize: number;
  userStats: UserStatsResponse | null;
  pendingRequestCount: number | null;
  pendingStudentCount: number | null;
  pendingBusinessCount: number | null;

  userRegistrationReport: UserReportResponse | null;

  searchResult: UserStaffAdmin[] | null;

  draftJobCount: number | null;
  pendingJobCount: number | null;
  acceptedJobCount: number | null;
  rejectedJobCount: number | null;
  staffAdmins: UserStaffAdmin[]; // Added staffAdmins property
  loading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  users: [],
  userStats: null,
  loading: false,
  error: null,
  pendingRequestCount: null,
  pendingStudentCount: null,
  pendingBusinessCount: null,
  draftJobCount: null,
  pendingJobCount: null,
  acceptedJobCount: null,
  rejectedJobCount: null,
  staffAdmins: [], // Initialized staffAdmins
  searchResult: null,
  userRegistrationReport: null,
  total: 0,
  currentPage: 0,
  pageSize: 0
};

export const fetchUserStats = createAsyncThunk<
  UserStatsResponse,
  void,
  { rejectValue: string }
>("admin/fetchUserStats", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosPrivate.get<{ data: UserStatsResponse }>(
      "/users/stats/status"
    );
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch users"
    );
  }
});

export const countTotalPendingRequests = createAsyncThunk<
  number,
  void,
  { rejectValue: string }
>("admin/countTotalPendingRequests", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosPrivate.get<CountResponse>(
      "/v1/staff-admin/pending/total"
    );
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch pending requests"
    );
  }
});

export const countTotalPendingStudentRequests = createAsyncThunk<
  number,
  void,
  { rejectValue: string }
>("admin/countToltalPendingStudentRequests", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosPrivate.get<CountResponse>(
      "/v1/staff-admin/pending/students"
    );
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch pending requests"
    );
  }
});
export const countTotalPendingBusinessRequests = createAsyncThunk<
  number,
  void,
  { rejectValue: string }
>(
  "admin/countToltalPendingBusinessRequests",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosPrivate.get<CountResponse>(
        "/v1/staff-admin/pending/businesses"
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch pending requests"
      );
    }
  }
);

export const countTotalPendingJobsRequests = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>(
  "admin/countTotalPendingJobsRequests",
  async (status, { rejectWithValue }) => {
    try {
      const response = await axiosPrivate.get<CountResponse>(
        `/job-postings/count/status?status=${status}`
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch pending job requests"
      );
    }
  }
);
export const fetchAllStaffAdmin = createAsyncThunk<
  PaginatedResponse<UserStaffAdmin>,
  { page?: number; size?: number },
  { rejectValue: string }
>(
  "admin/fetchAllStaffAdmin",
  async ({ page = 0, size = 10 }, { rejectWithValue }) => {
    try {
      const response = await axiosPrivate.get<{
        data: PaginatedResponse<UserStaffAdmin>;
      }>(`/users/roles/staff_admin?page=${page}&size=${size}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch staff admins"
      );
    }
  }
);

export const assignStaffAdminRole = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>("admin/assignStaffAdminRole", async (userId, { rejectWithValue }) => {
  try {
    const response = await axiosPrivate.post<ApiResponse<void>>(
      `/users/${userId}/roles/staff-admin`,
      null
    );
    return;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to assign role"
    );
  }
});

export const searchUserByEmail = createAsyncThunk<
  UserStaffAdmin[],
  string,
  { rejectValue: string }
>("admin/searchUserByEmail", async (email, { rejectWithValue }) => {
  try {
    const response = await axiosPrivate.get<{ data: UserStaffAdmin[] }>(
      `/users/search?email=${email}`
    );
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to search user"
    );
  }
});

export const fetchUserRegistrationReport = createAsyncThunk<
  UserReportResponse,
  void,
  { rejectValue: string }
>("admin/fetchUserRegistrationReport", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosPrivate.get<{ data: UserReportResponse }>(
      "/users/report"
    );
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message ||
        "Failed to fetch user registration report"
    );
  }
});

export const removeUserRole = createAsyncThunk(
  "admin/removeUserRole",
  async (
    { userId, roleName }: { userId: string; roleName: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosPrivate.put("/users/roles/remove", {
        userId,
        roleName,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Stats
    builder
      .addCase(fetchUserStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserStats.fulfilled, (state, action) => {
        state.loading = false;
        state.userStats = action.payload;
      })
      .addCase(fetchUserStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch user stats";
      });

    // Total Pending
    builder
      .addCase(countTotalPendingRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(countTotalPendingRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingRequestCount = action.payload;
      })
      .addCase(countTotalPendingRequests.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed to fetch total pending requests";
      });

    // Student Pending
    builder
      .addCase(countTotalPendingStudentRequests.fulfilled, (state, action) => {
        state.pendingStudentCount = action.payload;
      })
      .addCase(countTotalPendingStudentRequests.rejected, (state, action) => {
        state.error =
          action.payload || "Failed to fetch pending student requests";
      });

    // Business Pending
    builder
      .addCase(countTotalPendingBusinessRequests.fulfilled, (state, action) => {
        state.pendingBusinessCount = action.payload;
      })
      .addCase(countTotalPendingBusinessRequests.rejected, (state, action) => {
        state.error =
          action.payload || "Failed to fetch pending business requests";
      })
      .addCase(countTotalPendingJobsRequests.fulfilled, (state, action) => {
        const status = action.meta.arg;

        switch (status) {
          case -1:
            state.draftJobCount = action.payload;
            break;
          case 0:
            state.pendingJobCount = action.payload;
            break;
          case 1:
            state.acceptedJobCount = action.payload;
            break;
          case 2:
            state.rejectedJobCount = action.payload;
            break;
          default:
            break;
        }
      })
      .addCase(countTotalPendingJobsRequests.rejected, (state, action) => {
        state.error = action.payload || "Failed to fetch job posting count";
      })

      .addCase(countTotalPendingJobsRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      });

    builder
      .addCase(assignStaffAdminRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignStaffAdminRole.fulfilled, (state) => {
        state.loading = false;
        // Có thể trigger fetchAllStaffAdmin hoặc hiển thị thông báo ở component
      })
      .addCase(assignStaffAdminRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to assign STAFF_ADMIN role";
      });
    builder
      .addCase(fetchAllStaffAdmin.fulfilled, (state, action) => {
        state.staffAdmins = action.payload.content;
        state.total = action.payload.total;
        state.loading = false;
      })

      .addCase(fetchAllStaffAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllStaffAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch staff admins";
      });
    builder
      .addCase(searchUserByEmail.fulfilled, (state, action) => {
        state.searchResult = action.payload;
        state.loading = false;
      })
      .addCase(searchUserByEmail.rejected, (state, action) => {
        state.error = action.payload || "Failed to search user";
        state.loading = false;
      })
      .addCase(searchUserByEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.searchResult = null;
      });
    builder
      .addCase(fetchUserRegistrationReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserRegistrationReport.fulfilled, (state, action) => {
        state.userRegistrationReport = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserRegistrationReport.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed to fetch user registration report";
      });
    builder
      .addCase(removeUserRole.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeUserRole.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(removeUserRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});
export default adminSlice.reducer;
