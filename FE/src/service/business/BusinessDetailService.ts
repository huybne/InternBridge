import axiosPrivate from "../../api/axiosPrivate";
import axiosPublic from "../../api/axiosPublic";
import { ApiResponse } from "../../features/auth/authType";
import { BusinessProfilesDTO } from "../../services/admin/ListBussinessAccountService";
export class JobPostingsResponseDTO {
    jobId: string;
    businessId: string;
    companyName: string;
    avatarUrl: string;
    title: string;
    description: string;
    location: string;
    numberEmployees: number | null;
    status: number;
    isUrgentRecruitment: boolean;
    expirationDate: string | null;
    isDeleted: boolean;
    updatedAt: string | null;
    salary: string;
    categoryNames: string[];

    constructor(data: {
        jobId: string;
        businessId: string;
        companyName: string;
        avatarUrl: string;
        title: string;
        description: string;
        location: string;
        numberEmployees?: number | null;
        status: number;
        isUrgentRecruitment: boolean;
        expirationDate?: string | null;
        isDeleted: boolean;
        updatedAt?: string | null;
        salary: string;
        categoryNames: string[];
    }) {
        this.jobId = data.jobId;
        this.businessId = data.businessId;
        this.companyName = data.companyName;
        this.avatarUrl = data.avatarUrl;
        this.title = data.title;
        this.description = data.description;
        this.location = data.location;
        this.numberEmployees = data.numberEmployees ?? null;
        this.status = data.status;
        this.isUrgentRecruitment = data.isUrgentRecruitment;
        this.expirationDate = data.expirationDate ?? null;
        this.isDeleted = data.isDeleted;
        this.updatedAt = data.updatedAt ?? null;
        this.salary = data.salary;
        this.categoryNames = data.categoryNames;
    }
}


export class PaginatedResponse<T> {
    data: T[];
    totalRecords: number;
    currentPage: number;
    pageSize: number;
    totalPages: number;

    constructor(params: {
        data: T[];
        totalRecords: number;
        currentPage: number;
        pageSize: number;
        totalPages: number;
    }) {
        this.data = params.data;
        this.totalRecords = params.totalRecords;
        this.currentPage = params.currentPage;
        this.pageSize = params.pageSize;
        this.totalPages = params.totalPages;
    }
}



export class BusinessDetailService {
    async GetBusinessDetail(id?: string): Promise<BusinessProfilesDTO | null> {
        if (!id) {
            return null;
        }

        try {

            // Gửi PUT request tới API
            const response = await axiosPrivate.get<ApiResponse<any>>('/v1/business/business-profile2/' + id);

            // Kiểm tra kết quả trả về
            if (response.data && response.data.code === 200) {
                console.log("Business successfully banned/unbanned.");
                return response.data.data;
            } else {
                console.error("Failed to ban/unban Business:", response.data.message);
                return null; // Trả về false nếu thất bại
            }
        } catch (error) {
            // Xử lý lỗi nếu có
            console.error("Error while banning/unbanning Business:", error);
            return null;; // Trả về false nếu gặp lỗi
        }
    }

    async GetListJob(id?: string, pageIndex?: number, pageSize?: number): Promise<PaginatedResponse<JobPostingsResponseDTO> | null> {
        if (!id) {
            return null;
        }
        try {

            // Gửi PUT request tới API
            const response = await axiosPublic.get<ApiResponse<PaginatedResponse<JobPostingsResponseDTO>>>('job-postings/getalljobbybusinessid/' + id+'?pageIndex='+pageIndex+'&pageSize='+pageSize);

            // Kiểm tra kết quả trả về
            if (response.data && response.data.code === 200) {
                console.log("Business successfully get list job.");
                return response.data.data;
            } else {
                console.error("Failed to ban/unban Business:", response.data.message);
                return null; // Trả về false nếu thất bại
            }
        } catch (error) {
            // Xử lý lỗi nếu có
            console.error("Error while banning/unbanning Business:", error);
            return null;; // Trả về false nếu gặp lỗi
        }
    }


}