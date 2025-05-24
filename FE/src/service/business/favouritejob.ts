import axiosPrivate from "../../api/axiosPrivate";
import { ApiResponse } from "../../features/auth/authType";

interface JobAddFavorite {
    jobId: string;
}

export class favouritejob {
    async createFavoriteJob(idjob: string): Promise<boolean> {

        const jobAddFavorite: JobAddFavorite = { jobId: idjob };
        try {
            const response = await axiosPrivate.post<ApiResponse<any>>('farvouritejob/add', jobAddFavorite);

            if (response.data && response.data.code === 200) {
                return true;  // true hoặc false trả về từ backend
            } else {
                console.error('API returned error:', response.data.message);
                return false;
            }
        } catch (error) {
            console.error('Error calling createFavoriteJob API:', error);
            return false;
        }
    }


    async removeFavoriteJob(idjob: string): Promise<boolean> {

        const jobAddFavorite: JobAddFavorite = { jobId: idjob };
        try {
            const response = await axiosPrivate.put<ApiResponse<any>>('farvouritejob/remove', jobAddFavorite);

            if (response.data && response.data.code === 200) {
                return true;  // true hoặc false trả về từ backend
            } else {
                console.error('API returned error:', response.data.message);
                return false;
            }
        } catch (error) {
            console.error('Error calling createFavoriteJob API:', error);
            return false;
        }
    }



}