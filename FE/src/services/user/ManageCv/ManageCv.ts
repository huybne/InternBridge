import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosPrivate from "../../../api/axiosPrivate";
import { ApiResponse } from "../../../features/auth/authType";

export class CvDTOForCreate {
    title: string;
    cvDetail: string;

    constructor(title: string, cvDetail: string) {
        this.title = title;
        this.cvDetail = cvDetail;
    }
}

export class CvDTOForUpdate {
    cvId: string;
    title: string;
    cvDetail: string;

    constructor(cvId: string, title: string, cvDetail: string) {
        this.cvId = cvId;
        this.title = title;
        this.cvDetail = cvDetail;
    }
}

export class CvDTO {
    cvId: string;
    studentId: string;
    title: string;
    cvDetail: string;
    createdAt: Date;
    status: "draft" | "published";
    isDeleted: boolean;

    constructor(
        cvId: string,
        studentId: string,
        title: string,
        cvDetail: string,
        createdAt: Date,
        status: "draft" | "published",
        isDeleted: boolean
    ) {
        this.cvId = cvId;
        this.studentId = studentId;
        this.title = title;
        this.cvDetail = cvDetail;
        this.createdAt = createdAt;
        this.status = status;
        this.isDeleted = isDeleted;
    }

    getCvId(): string {
        return this.cvId;
    }

    setCvId(value: string): void {
        this.cvId = value;
    }

    getStudentId(): string {
        return this.studentId;
    }

    setStudentId(value: string): void {
        this.studentId = value;
    }

    getTitle(): string {
        return this.title;
    }

    setTitle(value: string): void {
        this.title = value;
    }

    getCvDetail(): string {
        return this.cvDetail;
    }

    setCvDetail(value: string): void {
        this.cvDetail = value;
    }

    getCreatedAt(): Date {
        return this.createdAt;
    }

    setCreatedAt(value: Date): void {
        this.createdAt = value;
    }

    getStatus(): "draft" | "published" {
        return this.status;
    }

    setStatus(value: "draft" | "published"): void {
        this.status = value;
    }

    getIsDeleted(): boolean {
        return this.isDeleted;
    }

    setIsDeleted(value: boolean): void {
        this.isDeleted = value;
    }
}



export class ManageCv {
    // async getCvByUserId(search?: string): Promise<CvDTO[]| null> {
    //     try {
    //         const response = await axiosPrivate.get<ApiResponse<CvDTO[]>>("/cv/getcvByid", {
    //             params: { search: search || "" },
    //         });
    //         return response.data.data;
    //     } catch (error) {
    //         console.error("❌ Failed to fetch CVs:", error);
    //         return null;
    //     }
    // }

    async createCv(dto: CvDTOForCreate): Promise<boolean> {
        try {
            const response = await axiosPrivate.post<ApiResponse<string>>("/cv/create", dto);
            // API trả về: ApiResponse<String> nên lấy data.data
            response.data.data as string;
            return true
        } catch (error) {
            console.error("❌ Lỗi khi tạo CV:", error);
            return false;
        }
    }

    async deleteCv(cvid: string): Promise<string> {
        try {
            const response = await axiosPrivate.delete<ApiResponse<string>>(`/cv/delete/${cvid}`);
            return response.data.data; // trả về message hoặc ID tùy backend
        } catch (error) {
            console.error("❌ Lỗi khi xoá CV:", error);
            throw error;
        }
    }

    async updateCv(dto: CvDTOForUpdate): Promise<string> {
        try {
            const response = await axiosPrivate.put<ApiResponse<string>>("/cv/update", dto);
            return response.data.data; // Trả về message hoặc ID tuỳ backend
        } catch (error) {
            console.error("❌ Lỗi khi cập nhật CV:", error);
            throw error;
        }
    }

    async uploadCvFile(file: File): Promise<string> {
        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await axiosPrivate.post<{
                fileId: string;
                url: string;
                [key: string]: any;
            }>("/cv/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });


            const fileUrl = response.data.url; // ✅ Không cần parse
            return fileUrl;

        } catch (error) {
            console.error("❌ Upload CV file thất bại:", error);
            throw error;
        }
    }
}


interface CvState {
  cvs: CvDTO[];
  loading: boolean;
  error: string | null;
}

const initialState: CvState = {
  cvs: [],
  loading: false,
  error: null,
};
export const fetchCvByUserId = createAsyncThunk<CvDTO[], string | undefined>(
  "cv/fetchByUserId",
  async (search, { rejectWithValue }) => {
    try {
      const response = await axiosPrivate.get<ApiResponse<any[]>>(
        "/cv/getcvByid",
        {
          params: { search: search || "" },
        }
      );

      const rawData = response.data.data;
      const mappedData: CvDTO[] = rawData.map((item) => ({
        cvId: item.cvId,
        studentId: item.studentId,
        title: item.title,
        cvDetail: item.cvDetail,
        createdAt: item.createdAt,
        status: item.status,
        isDeleted: item.deleted,
      }));

      return mappedData;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to load CVs");
    }
  }
);

const cvSlice = createSlice({
  name: "cv",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCvByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCvByUserId.fulfilled, (state, action) => {
        state.loading = false;
        state.cvs = action.payload;
      })
      .addCase(fetchCvByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default cvSlice.reducer;

