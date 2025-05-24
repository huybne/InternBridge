import axiosPrivate from "../../api/axiosPrivate";
import { ApiResponse } from "../../features/auth/authType";
import { StudentProfile } from "../user/StudentProfile/StudentProfile";


export class PageResult<T> {
    items: T[];
    offset: number;
    totalCount: number;
    totalPages: number;
    limit: number;

    constructor(
        items: T[],
        offset: number,
        totalCount: number,
        totalPages: number,
        limit: number
    ) {
        this.items = items;
        this.offset = offset;
        this.totalCount = totalCount;
        this.totalPages = totalPages;
        this.limit = limit;
    }

    // Phương thức giúp tính số trang hiện tại
    getCurrentPage(): number {
        return Math.floor(this.offset / this.limit) + 1;
    }

    // Phương thức kiểm tra nếu có trang kế tiếp
    hasNextPage(): boolean {
        return this.offset + this.limit < this.totalCount;
    }

    // Phương thức kiểm tra nếu có trang trước
    hasPrevPage(): boolean {
        return this.offset > 0;
    }
}

export class ListStudentAccountService {
    async GetAllProfileStudent(search: string, isApproved?: number, pageIndex?: number, pageSize?: number): Promise<PageResult<StudentProfile> | null> {
        try {
            // Gọi API để lấy danh sách sinh viên
            const response = await axiosPrivate.get<ApiResponse<PageResult<StudentProfile>>>('/v1/admin/student/list', {
                params: {
                    search: search || '',  // Nếu không có search, gửi giá trị rỗng
                    isApproved: isApproved !== undefined ? isApproved : -1,         // Giả sử bạn muốn lấy tất cả sinh viên chưa phê duyệt, nếu cần có thể thay đổi
                    pageIndex: pageIndex ? pageIndex : 1,          // Trang bắt đầu là 1
                    pageSize: pageSize           // Mỗi trang có tối đa 10 sinh viên
                }
            });

            // Kiểm tra xem API có trả về dữ liệu không
            if (response.data && response.data.data) {
                // Giả sử `response.data.data` chứa danh sách các sinh viên, bạn có thể xử lý hoặc map dữ liệu nếu cần
                return response.data.data as PageResult<StudentProfile>;  // Trả về mảng StudentProfile
            } else {
                // Nếu không có dữ liệu hoặc response không hợp lệ
                return null;
            }
        } catch (error) {
            // Xử lý lỗi trong quá trình gọi API
            console.error("Lỗi khi gọi API:", error);
            return null;
        }
    }


    async GetProfileStudentById(id: string): Promise<StudentProfile | null> {
        try {
            // Gọi API để lấy danh sách sinh viên
            const response = await axiosPrivate.get<ApiResponse<StudentProfile>>('/v1/admin/student/detail?id=' + id, {
            });

            // Kiểm tra xem API có trả về dữ liệu không
            if (response.data && response.data.data) {
                // Giả sử `response.data.data` chứa danh sách các sinh viên, bạn có thể xử lý hoặc map dữ liệu nếu cần
                return response.data.data as StudentProfile;  // Trả về mảng StudentProfile
            } else {
                // Nếu không có dữ liệu hoặc response không hợp lệ
                return null;
            }
        } catch (error) {
            // Xử lý lỗi trong quá trình gọi API
            console.error("Lỗi khi gọi API:", error);
            return null;
        }
    }


    async BanStudent(profileId: string, reason?: string): Promise<boolean> {
        try {
            const requestBody = {
                profileId,
                reason: reason ? reason : undefined, // Chỉ gửi lý do nếu có
            };

            // Gửi PUT request tới API
            const response = await axiosPrivate.put<ApiResponse<any>>('/v1/admin/student/ban', requestBody);

            // Kiểm tra kết quả trả về
            if (response.data && response.data.code === 200) {
                console.log("Student successfully banned/unbanned.");
                return true; // Trả về true nếu thành công
            } else {
                console.error("Failed to ban/unban student:", response.data.message);
                return false; // Trả về false nếu thất bại
            }
        } catch (error) {
            // Xử lý lỗi nếu có
            console.error("Error while banning/unbanning student:", error);
            return false; // Trả về false nếu gặp lỗi
        }
    }

}