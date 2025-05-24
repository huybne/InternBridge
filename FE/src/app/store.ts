import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import businessReducer from '../features/auth/businessSlice';
import adminReducer from '../features/admin/adminSlice';
import notificationReducer from '../features/noti/notiSlice';
import requestSliceReducer from '../features/admin/requestSlice';

import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import { combineReducers } from 'redux';
import  cvSlice  from '../services/user/ManageCv/ManageCv';
import applyJobsReducer from '../features/applyjobs/applyJobsSlice';
import jobListReducer from '../features/admin/jobListSlice';
import interviewReducer from '../service/business/interviews/interviewSlice';
const persistConfig = {
  key: 'root',
  storage,
};

const appReducer = combineReducers({
  auth: authReducer,
  business: businessReducer,
  admin: adminReducer,
  noti: notificationReducer,
  request: requestSliceReducer,
  cv: cvSlice,
  applyJob: applyJobsReducer,
  job: jobListReducer,
  interview: interviewReducer
});
const rootReducer = (state: any, action: any) => {
  if (action.type === 'auth/resetStore') {
    state = undefined; // reset toàn bộ store
  }
  return appReducer(state, action);
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});



export const persistor = persistStore(store); 

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
