import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getMyBusiness } from '../../service/business/MyBusinessService';

export const fetchBusinessInfo = createAsyncThunk('business/me', async () => {
  const response = await getMyBusiness();
  return response.data;
});

const businessSlice = createSlice({
  name: 'business',
  initialState: {
    isApproved: false,
    status: null as string | null,
    error: null as string | null,
    data: null as any | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBusinessInfo.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBusinessInfo.fulfilled, (state, action) => {
        state.status = action.payload.status;
        state.data = action.payload;
        state.isApproved = action.payload.approved ?? false;
      })
      .addCase(fetchBusinessInfo.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Lỗi không xác định';
      });
  },
});

export default businessSlice.reducer;
