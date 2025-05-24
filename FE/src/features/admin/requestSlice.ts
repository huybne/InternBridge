// features/request/requestSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosPrivate from "../../api/axiosPrivate";

export interface RequestStudents {
  requestId: string;
  studentId: string;
  reason: string | null;
  sendTime: string;
  status: string;
  deleted: boolean;
}

export interface StudentRequestItem {
  requestStudents: RequestStudents;
  studentName: string;
  uni: string;
  avatar: string;
}

export interface RequestBusinesses {
  requestId: string;
  businessId: string;
  reason: string | null;
  sendTime: string;
  status: string;
  deleted: boolean;
}

export interface BusinessRequestItem {
  request: RequestBusinesses;
  companyName: string;
  industry: string;
  logoUrl: string | null; // Updated to handle "null" string
}

export interface PaginatedRequestResponse<T> {
  items: T[];
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasMore: boolean;
}

interface RequestState {
  studentRequests: PaginatedRequestResponse<StudentRequestItem> | null;
  businessRequests: PaginatedRequestResponse<BusinessRequestItem> | null;
  studentError: string | null;
  businessError: string | null;
  loading: boolean;
  studentRequestDetail: RequestStudentDetailResponse | null;
  businessRequestDetail: RequestBusinessDetailResponse | null;
  selectedStudentRequest: RequestStudentDetailResponse | null;
  selectedBusinessRequest: RequestBusinessDetailResponse | null;
}

const initialState: RequestState = {
  studentRequests: null,
  businessRequests: null,
  studentError: null,
  businessError: null,
  loading: false,
  studentRequestDetail: null,
  businessRequestDetail: null,
  selectedStudentRequest: null,
  selectedBusinessRequest: null,
};
export interface RequestStudentDetailResponse {
  request: RequestStudents;
  studentName: string;
  uni: string | null;
  avatar: string | null;
}

export interface BusinessProfile {
  profileId: string;
  companyName: string;
  industry: string;
  companyInfo: string;
  websiteUrl: string;
  taxCode: string;
  email: string;
  phoneNumber: string;
  address: string;
  status: string;
  createdAt: string;
  updatedAt: string | null;
  approved: boolean;
  deleted: boolean;
}

export interface RequestBusinessDetailResponse {
  request: RequestBusinesses;
  businessProfile: BusinessProfile;
}

export const fetchStudentRequestsByStatus = createAsyncThunk<
  PaginatedRequestResponse<StudentRequestItem>,
  { status?: string; page: number; limit: number; keyword?: string },
  { rejectValue: string }
>(
  "request/fetchStudentRequestsByStatus",
  async ({ status, page, limit, keyword }, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (status) queryParams.append("status", status);
      if (keyword) queryParams.append("keyword", keyword);
      queryParams.append("page", page.toString());
      queryParams.append("limit", limit.toString());

      const url = `/v1/staff-admin/request/students/offset?${queryParams.toString()}`;
      const response = await axiosPrivate.get<{
        data: PaginatedRequestResponse<StudentRequestItem>;
      }>(url);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch student requests by status"
      );
    }
  }
);


export const fetchBusinessRequestsByStatus = createAsyncThunk<
  PaginatedRequestResponse<BusinessRequestItem>,
  { status?: string; page: number; limit: number; keyword?: string },
  { rejectValue: string }
>(
  "request/fetchBusinessRequestsByStatus",
  async ({ status, page, limit, keyword }, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (status) queryParams.append("status", status);
      if (keyword) queryParams.append("keyword", keyword);
      queryParams.append("page", page.toString());
      queryParams.append("limit", limit.toString());

      const url = `/v1/staff-admin/request/business/offset?${queryParams.toString()}`;
      const response = await axiosPrivate.get<{
        data: PaginatedRequestResponse<BusinessRequestItem>;
      }>(url);

      const data = response.data.data;
      data.items = data.items.map((item) => ({
        ...item,
        logoUrl: item.logoUrl === "null" ? null : item.logoUrl,
      }));

      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch business requests by status"
      );
    }
  }
);


export const fetchStudentRequestById = createAsyncThunk<
  RequestStudentDetailResponse,
  string,
  { rejectValue: string }
>("request/fetchStudentRequestById", async (id, { rejectWithValue }) => {
  try {
    const response = await axiosPrivate.get<{
      data: RequestStudentDetailResponse;
    }>(`/v1/staff-admin/request/students/${id}`);
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch student request detail"
    );
  }
});

// Lấy chi tiết business request theo ID
export const fetchBusinessRequestById = createAsyncThunk<
  RequestBusinessDetailResponse,
  string,
  { rejectValue: string }
>("request/fetchBusinessRequestById", async (id, { rejectWithValue }) => {
  try {
    const response = await axiosPrivate.get<{
      data: RequestBusinessDetailResponse;
    }>(`/v1/staff-admin/request/business/${id}`);
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch business request detail"
    );
  }
});
export const updateBusinessRequestStatus = createAsyncThunk<
  void,
  { id: string; status: "approve" | "reject"; reason?: string },
  { rejectValue: string }
>(
  "request/updateBusinessRequestStatus",
  async ({ id, status, reason }, { rejectWithValue }) => {
    try {
      await axiosPrivate.put(
        "/v1/staff-admin/request/business/status",
        {
          id,
          status,
          reason: reason || "",
        }
      );
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to update business request status"
      );
    }
  }
);
export const updateStudentRequestStatus = createAsyncThunk<
  void,
  { id: string; status: "approve" | "reject"; reason?: string },
  { rejectValue: string }
>(
  "request/updateStudentRequestStatus",
  async ({ id, status, reason }, { rejectWithValue }) => {
    try {
      await axiosPrivate.put(
        "/v1/staff-admin/request/students/status",
        {
          id,
          status,
          reason: reason || "",
        }
      );
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to update student request status"
      );
    }
  }
);

const requestSlice = createSlice({
  name: "request",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentRequestsByStatus.pending, (state) => {
        state.loading = true;
        state.studentError = null;
      })
      .addCase(fetchStudentRequestsByStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.studentRequests = action.payload;
      })
      .addCase(fetchStudentRequestsByStatus.rejected, (state, action) => {
        state.loading = false;
        state.studentError =
          action.payload || "Failed to fetch student requests";
      })
      .addCase(fetchBusinessRequestsByStatus.pending, (state) => {
        state.loading = true;
        state.businessError = null;
      })
      .addCase(fetchBusinessRequestsByStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.businessRequests = action.payload;
      })
      .addCase(fetchBusinessRequestsByStatus.rejected, (state, action) => {
        state.loading = false;
        state.businessError =
          action.payload || "Failed to fetch business requests";
      });
    builder
      .addCase(fetchStudentRequestById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStudentRequestById.fulfilled, (state, action) => {
        state.loading = false;
        state.studentRequestDetail = action.payload;
        state.selectedStudentRequest = action.payload;
      })

      .addCase(fetchStudentRequestById.rejected, (state, action) => {
        state.loading = false;
        state.studentError =
          action.payload || "Failed to fetch student request detail";
      });

    builder
      .addCase(fetchBusinessRequestById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBusinessRequestById.fulfilled, (state, action) => {
        state.loading = false;
        state.businessRequestDetail = action.payload;
        state.selectedBusinessRequest = action.payload;
      })

      .addCase(fetchBusinessRequestById.rejected, (state, action) => {
        state.loading = false;
        state.businessError =
          action.payload || "Failed to fetch business request detail";
      });
    builder
      .addCase(updateBusinessRequestStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateBusinessRequestStatus.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateBusinessRequestStatus.rejected, (state, action) => {
        state.loading = false;
        state.businessError =
          action.payload || "Failed to update business request status";
      });

    builder
      .addCase(updateStudentRequestStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateStudentRequestStatus.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateStudentRequestStatus.rejected, (state, action) => {
        state.loading = false;
        state.studentError =
          action.payload || "Failed to update student request status";
      });
  },
});

export default requestSlice.reducer;
