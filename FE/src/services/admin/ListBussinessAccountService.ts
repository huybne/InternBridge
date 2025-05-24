import axiosPrivate from "../../api/axiosPrivate";
import { ApiResponse } from "../../features/auth/authType";
import { PageResult } from "./ListStudentAccountService";

export class BusinessProfilesDTO {
    profileId: string;
    companyName: string;
    industry: string;
    companyInfo: string;
    websiteUrl: string;
    taxCode: string;
    email: string;
    phoneNumber: string;
    address: string;
    isApproved: boolean;
    status: string;
    isDeleted: boolean;
    createdAt: string;  // Can use string, or Date if you want to work with Date objects
    updatedAt: string;  // Can use string, or Date if you want to work with Date objects
    imageBusiness: string[];
    image_Avatar_url: string;

    constructor(
        profileId: string,
        companyName: string,
        industry: string,
        companyInfo: string,
        websiteUrl: string,
        taxCode: string,
        email: string,
        phoneNumber: string,
        address: string,
        isApproved: boolean,
        status: string,
        isDeleted: boolean,
        createdAt: string,  // or Date if using Date objects
        updatedAt: string,  // or Date if using Date objects
        imageBusiness: string[],
        image_Avatar_url: string,
    ) {
        this.profileId = profileId;
        this.companyName = companyName;
        this.industry = industry;
        this.companyInfo = companyInfo;
        this.websiteUrl = websiteUrl;
        this.taxCode = taxCode;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.address = address;
        this.isApproved = isApproved;
        this.status = status;
        this.isDeleted = isDeleted;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.imageBusiness = imageBusiness;
        this.image_Avatar_url = image_Avatar_url
    }

    // You can also add methods here if needed
}


export class ListBussinessAccountServcie {
    async GetAllBusiness(search?: string, isApproved?: number, pageIndex: number = 1, pageSize: number = 10): Promise<PageResult<BusinessProfilesDTO> | null> {
        try {
            const response = await axiosPrivate.get<ApiResponse<PageResult<BusinessProfilesDTO>>>('/v1/admin/business/list', {
                params: {
                    search: search || '',  // Nếu không có search, gửi giá trị rỗng
                    isApproved: isApproved !== undefined ? isApproved : -1,  // Nếu isApproved không được chỉ định, mặc định là -1 (tất cả)
                    pageIndex: pageIndex,  // Trang bắt đầu
                    pageSize: pageSize     // Số lượng mỗi trang
                }
            });

            // Kiểm tra xem API có trả về dữ liệu không
            if (response.data && response.data.data) {
                return response.data.data;  // Trả về dữ liệu trang BusinessProfilesDTO
            } else {
                return null;
            }
        } catch (error) {
            // Xử lý lỗi trong quá trình gọi API
            console.error("Error calling business list API:", error);
            return null;
        }
    }

    // Hàm lấy thông tin chi tiết business profile
    async GetBusinessProfile(id: string): Promise<BusinessProfilesDTO | null> {
        try {
            const response = await axiosPrivate.get<ApiResponse<BusinessProfilesDTO>>('/v1/admin/business/detail?id=' + id, {
            });

            if (response.data && response.data.data) {
                return response.data.data;
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error calling business profile API:", error);
            return null;
        }
    }

    async BanBusiness(profileId: string, reason?: string): Promise<boolean> {
        try {
            const requestBody = {
                profileId,
                reason: reason ? reason : undefined, // Chỉ gửi lý do nếu có
            };

            // Gửi PUT request tới API
            const response = await axiosPrivate.put<ApiResponse<any>>('/v1/admin/business/ban', requestBody);

            // Kiểm tra kết quả trả về
            if (response.data && response.data.code === 200) {
                console.log("Business successfully banned/unbanned.");
                return true; // Trả về true nếu thành công
            } else {
                console.error("Failed to ban/unban Business:", response.data.message);
                return false; // Trả về false nếu thất bại
            }
        } catch (error) {
            // Xử lý lỗi nếu có
            console.error("Error while banning/unbanning Business:", error);
            return false; // Trả về false nếu gặp lỗi
        }
    }
}