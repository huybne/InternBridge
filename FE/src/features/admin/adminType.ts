export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface adminUser {
    id: string;
    email: string;
    username: string;
    roleNames: string[];
    status: string;

}



export interface UserStatsResponse {
    total: number;
    active: number;
    inactive: number;   
    pending: number;
}

export interface CountResponse {
  data: number;
}
export interface Role {
  roleId: number;
  roleName: string;
  permissions: string;
  createdAt: string; 
}
export interface UserStaffAdmin{
    userId: string;
    username: string;
    email: string;
    roles: Role[];
    createdAt: string;
    status: string;
    provider: string;
    deleted: boolean;
}

export interface SearchUserParams {
  keyword: string;
  roleName?: string;
  status?: string;
}
export interface PaginatedResponse<T> {
  content: T[];
  total: number;
}

export interface RegistrationCount {
  date: string;
  total: number;
}

export interface MonthlyCount {
  month: number;
  total: number;
}

export interface UserReportResponse {
  last7Days: RegistrationCount[];
  thisMonth: RegistrationCount[];
  thisYear: MonthlyCount[];
}
