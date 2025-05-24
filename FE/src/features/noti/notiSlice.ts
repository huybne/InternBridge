import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosPublic from "../../api/axiosPublic";

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  redirectUrl: string;
  read: boolean;
  createdAt: string;
}

interface NotificationState {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
}

const initialState: NotificationState = {
  notifications: [],
  loading: false,
  error: null,
};

export const fetchNotifications = createAsyncThunk<
  Notification[],
  string, // userId
  { rejectValue: string }
>("notification/fetch", async (userId, { rejectWithValue }) => {
  try {
    const res = await axiosPublic.get<Notification[]>(`/noti/${userId}`);
    return res.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Load failed");
  }
});
export const markNotificationAsRead = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>("notification/markAsRead", async (id, { rejectWithValue }) => {
  try {
    await axiosPublic.put(`/noti/${id}/read`);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Update failed");
  }
});

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
    },
  },

  extraReducers: (builder) => {
    builder
      // FETCH notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        console.log("🔥 Notifications loaded:", action.payload);
        state.loading = false;
        state.notifications = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch notifications";
      })

      // MARK AS READ
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const id = action.meta.arg;
        const noti = state.notifications.find((n) => n.id === id);
        if (noti) noti.read = true;
      });
  },
});
export const { addNotification } = notificationSlice.actions;

export default notificationSlice.reducer;
