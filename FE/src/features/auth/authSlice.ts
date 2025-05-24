// src/features/auth/authSlice.ts

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosPublic from "../../api/axiosPublic";
import axiosPrivate from "../../api/axiosPrivate";

import {
  ApiResponse,
  AuthState,
  ChangePasswordPayload,
  ChangePasswordResponse,
  LoginPayload,
  LoginResponse,
  ResetPasswordRequest,
  User,
} from "./authType";

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

// Async thunks
export const googleAuthenticate = createAsyncThunk<
  {
    accessToken: string;
    user: User;
  },
  string, // auth code
  { rejectValue: string }
>("auth/googleAuthenticate", async (code, { rejectWithValue }) => {
  try {
    const res = await fetch(
      `http://localhost:8088/api/v1/auth/outbound/authentication?code=${code}`,
      { method: "POST", credentials: "include" }
    );

    if (!res.ok) {
      throw new Error("Google authentication failed");
    }

    const json = await res.json();
    const data = json.data;

    if (!data || !data.accessToken) {
      throw new Error("Missing access token in response");
    }

    const user: User = {
      id: data.id,
      email: data.email,
      username: data.name,
      picture: data.picture || null,
      roleNames: data.roleNames || [],
    };

    localStorage.setItem("accessToken", data.accessToken);

    return {
      accessToken: data.accessToken,
      user,
    };
  } catch (err: any) {
    return rejectWithValue(err.message || "Google OAuth failed");
  }
});

export const changePassword = createAsyncThunk<
  ChangePasswordResponse,
  ChangePasswordPayload,
  { rejectValue: string }
>("auth/changePassword", async (payload, { rejectWithValue }) => {
  try {
    const response = await axiosPrivate.put<
      ApiResponse<ChangePasswordResponse>
    >("/auth/change-pass", payload, {
      withCredentials: true,
    });

    const { newAccessToken } = response.data.data;
    localStorage.setItem("accessToken", newAccessToken);

    return response.data.data;
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      axiosError.response?.data?.message || "Đổi mật khẩu thất bại"
    );
  }
});

export const getProfile = createAsyncThunk<
  { code: number; message: string; data: User },
  void,
  { rejectValue: string }
>("auth/getProfile", async (_, thunkAPI) => {
  try {
    const res = await axiosPrivate.get<{
      code: number;
      message: string;
      data: User;
    }>("/users/my-info");
    return res.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Cannot Login"
    );
  }
});

export const resetPassword = createAsyncThunk<
  string,
  ResetPasswordRequest,
  { rejectValue: string }
>("auth/reset", async (payload, { rejectWithValue }) => {
  try {
    const response = await axiosPublic.put<ApiResponse<null>>(
      "/auth/reset",
      payload
    );
    return response.data.message; // Chỉ lấy message thôi
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Reset password failed"
    );
  }
});

export const forgotPassword = createAsyncThunk<
  { message: string },
  { email: string },
  { rejectValue: string }
>("auth/forgotPassword", async (payload, { rejectWithValue }) => {
  try {
    const response = await axiosPublic.post<ApiResponse<null>>(
      "/auth/forgot-password",
      payload
    );
    return { message: response.data.message };
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Reset password failed"
    );
  }
});

export const login = createAsyncThunk<
  LoginResponse,
  LoginPayload,
  { rejectValue: string }
>("auth/login", async (payload, { rejectWithValue }) => {
  try {
    const response = await axiosPublic.post<ApiResponse<LoginResponse>>(
      "/auth/login",

      payload,
      { withCredentials: true }
    );

    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Login failed");
  }
});
export const register = createAsyncThunk<
  { code: number; message: string; data?: string },
  { username: string; email: string; password: string },
  { rejectValue: string }
>("auth/register", async ({ username, email, password }, thunkAPI) => {
  try {
    const response = await axiosPublic.post("/auth/register", {
      username,
      email,
      password,
    });
    const data = response.data as {
      code: number;
      message: string;
      data?: string;
    };

    if (data.code !== 1000) {
      return thunkAPI.rejectWithValue(data.message);
    }

    return data;
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: { message?: string } } };
    return thunkAPI.rejectWithValue(
      axiosError.response?.data?.message || "Đăng ký thất bại"
    );
  }
});

export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  const { dispatch } = thunkAPI;

  try {
    await axiosPrivate.post("/auth/logout", null, {
      withCredentials: true,
    });

    localStorage.removeItem("accessToken");

    // ✅ Reset toàn bộ Redux state
    dispatch({ type: "auth/resetStore" });

    // ✅ Clear redux-persist localStorage
    import("../../app/store").then(({ persistor }) => {
      persistor.purge();
    });

    return;
  } catch (error: any) {
    const status = error?.response?.status;

    if (status === 401) {
      try {
        const refreshRes = await axiosPublic.post(
          "/auth/refresh",
          {},
          {
            withCredentials: true,
          }
        );
        const newAccessToken = refreshRes.data.data.token;
        localStorage.setItem("accessToken", newAccessToken);

        await axiosPrivate.post("/auth/logout", null, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${newAccessToken}`,
          },
        });

        localStorage.removeItem("accessToken");

        dispatch({ type: "auth/resetStore" });
        import("../../app/store").then(({ persistor }) => {
          persistor.purge();
        });

        return;
      } catch (refreshErr) {
        return thunkAPI.rejectWithValue("Token hết hạn. Không thể đăng xuất.");
      }
    }

    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Đăng xuất thất bại"
    );
  }
});

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: { payload: User }) {
      state.user = action.payload;
      state.loading = false;
    },
    clearAuth(state) {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
      localStorage.removeItem("accessToken");
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;

        localStorage.setItem("accessToken", action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get Profile
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        const userData = action.payload.data;

        state.user = {
          id: userData.id,
          email: userData.email,
          username: userData.username,
          roleNames: userData.roleNames,
          picture: userData.picture ?? undefined,
        };
      })

      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        Object.assign(state, initialState);
      })

      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      //change password
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.newAccessToken;

        localStorage.setItem("accessToken", action.payload.newAccessToken);
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Đổi mật khẩu thất bại";
      });
  },
});

export const { setUser, clearAuth } = authSlice.actions;
export default authSlice.reducer;
