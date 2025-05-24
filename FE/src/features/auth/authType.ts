
export interface User {
    id: string;
    email: string;
    username: string;
    roleNames: string[];
    picture?: string;
  }
  
  export interface LoginPayload {
    email: string;
    password: string;
  }
  

  
export interface AuthState {
  user: User | null;
  token: string | null; 
  loading: boolean;
  error: string | null;
}
export interface RefreshResponse {
  code: number;
  message: string;
  data: {
    token: string;
  };
}
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}
export interface LoginResponse {
  authenticated: boolean;
  token: string;
  refreshToken: string | null;
}


export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  newAccessToken: string;
}

export interface ResetPasswordRequest{
  token: string;
  newPassword: string;
}