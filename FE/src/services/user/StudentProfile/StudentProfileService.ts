import axiosPrivate from "../../../api/axiosPrivate";
import { ApiResponse } from "../../../features/auth/authType";
import { StudentCard } from "./StudentCard";
import { StudentProfile } from "./StudentProfile";


export class RequestStudents {
  requestId: string;
  studentId: string;
  reason: string;
  sendTime: Date;
  status: 'pending' | 'approve' | 'reject';
  isDeleted: boolean;

  constructor(
    requestId: string,
    studentId: string,
    reason: string,
    sendTime: Date,
    status: 'pending' | 'approve' | 'reject',
    isDeleted: boolean
  ) {
    this.requestId = requestId;
    this.studentId = studentId;
    this.reason = reason;
    this.sendTime = sendTime;
    this.status = status;
    this.isDeleted = isDeleted;
  }
  getRequestId(): string {
    return this.requestId;
  }
  setRequestId(requestId: string): void {
    this.requestId = requestId;
  }

  getStudentId(): string {
    return this.studentId;
  }
  setStudentId(studentId: string): void {
    this.studentId = studentId;
  }

  getReason(): string {
    return this.reason;
  }
  setReason(reason: string): void {
    this.reason = reason;
  }

  getSendTime(): Date {
    return this.sendTime;
  }
  setSendTime(sendTime: Date): void {
    this.sendTime = sendTime;
  }

  getStatus(): 'pending' | 'approve' | 'reject' {
    return this.status;
  }
  setStatus(status: 'pending' | 'approve' | 'reject'): void {
    this.status = status;
  }

  getIsDeleted(): boolean {
    return this.isDeleted;
  }
  setIsDeleted(isDeleted: boolean): void {
    this.isDeleted = isDeleted;
  }
}

export class StudentProfileService {
  private token: string;
  private requestStudentUrl: string = 'http://localhost:8088/api/requeststudent/getrequest';
  constructor() {
    this.token = localStorage.getItem('accessToken') ?? '';
  }

  // Hàm này sẽ gọi API và trả về dữ liệu kiểu StudentProfile
  async getStudentProfile(): Promise<StudentProfile | null> {
    try {
      const response = await axiosPrivate.get<ApiResponse<StudentProfile>>('/student_profiles/viewprofile');
      const apiResponse = response.data;
      console.log("response.status" + response.status);
      console.log("apiResponse.code" + apiResponse.code);
      if (response.status === 200 && apiResponse.code === 200) {
        const data = apiResponse.data;

        const studentProfile = new StudentProfile(
          data.profileId,
          data.fullName,
          data.major,
          data.dateOfBirth,
          data.address,
          data.university,
          data.avatarUrl,
          data.academicYearStart,
          data.academicYearEnd,
          data.phoneNumber,
          data.isApproved,
          data.status,
          new Date(data.createdAt).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          }),
          new Date(data.updatedAt).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          }),
          data.studentCardDTOS.map(
            (card) => new StudentCard(card.cardId, card.studentCardUrl, card.isDeleted)
          ),
          data.approved
        );


        console.log('✅ Student profile loaded:', studentProfile);
        return studentProfile;
      } else {
        console.error(`❌ API error: ${apiResponse.message || 'Unknown error'}`);
        return null;
      }
    } catch (error) {
      console.error('❌ Error fetching student profile:', error);
      return null;
    }
  }


  async getRequestStudent(): Promise<RequestStudents> {
    try {
      const response = await axiosPrivate.get<ApiResponse<RequestStudents>>('/requeststudent/getrequest');

      const apiResponse = response.data;

      if (response.status === 200 && apiResponse.code === 200) {
        const data = apiResponse.data;

        const requestStudent = new RequestStudents(
          data.requestId,
          data.studentId,
          data.reason,
          new Date(data.sendTime),
          data.status,
          data.isDeleted
        );

        console.log('✅ Request student loaded:', requestStudent);
        return requestStudent;
      } else {
        console.error(`❌ API error: ${apiResponse.message || 'Unknown error'}`);
        throw new Error(apiResponse.message || 'Unexpected API error');
      }
    } catch (error) {
      console.error('❌ Error fetching request student:', error);
      throw error;
    }
  }
}
