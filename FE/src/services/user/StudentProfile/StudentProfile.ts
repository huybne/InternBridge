import { StudentCard } from "./StudentCard";

export class StudentProfile {
  profileId: string;
  fullName: string;
  major: string;
  dateOfBirth: string;
  address: string;
  university: string;
  avatarUrl: string;
  academicYearStart: string;
  academicYearEnd: string | null;
  phoneNumber: string;
  isApproved: boolean;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  studentCardDTOS: StudentCard[];
  approved: number;

  constructor(
    profileId: string,
    fullName: string,
    major: string,
    dateOfBirth: string,
    address: string,
    university: string,
    avatarUrl: string,
    academicYearStart: string,  // Sửa kiểu thành string vì bạn sẽ chuyển thành Date
    academicYearEnd: string | null, // Kiểu string hoặc null, bạn sẽ chuyển thành Date
    phoneNumber: string,
    isApproved: boolean,
    status: string,
    createdAt: string,  // Sửa kiểu thành string vì bạn sẽ chuyển thành Date
    updatedAt: string,  // Sửa kiểu thành string vì bạn sẽ chuyển thành Date
    studentCardDTOS: StudentCard[],
    approved: number
  ) {
    this.profileId = profileId;
    this.fullName = fullName;
    this.major = major;
    this.dateOfBirth = dateOfBirth;
    this.address = address;
    this.university = university;
    this.avatarUrl = avatarUrl;
    
    // Chuyển đổi các giá trị kiểu string thành đối tượng Date
    this.academicYearStart =academicYearStart;
    this.academicYearEnd = academicYearEnd;

    this.phoneNumber = phoneNumber;
    this.isApproved = isApproved;
    this.status = status;
    
    // Chuyển đổi chuỗi thành đối tượng Date
    this.createdAt = new Date(createdAt);
    this.updatedAt = new Date(updatedAt);

    // Khởi tạo mảng các đối tượng StudentCard
    this.studentCardDTOS = studentCardDTOS;
    this.approved = approved;
  }

  getProfileId(): string {
    return this.profileId;
  }
  setProfileId(profileId: string): void {
    this.profileId = profileId;
  }

  getFullName(): string {
    return this.fullName;
  }
  setFullName(fullName: string): void {
    this.fullName = fullName;
  }

  getMajor(): string {
    return this.major;
  }
  setMajor(major: string): void {
    this.major = major;
  }

  getDateOfBirth(): string {
    return this.dateOfBirth;
  }
  setDateOfBirth(dateOfBirth: string): void {
    this.dateOfBirth = dateOfBirth;
  }

  getAddress(): string {
    return this.address;
  }
  setAddress(address: string): void {
    this.address = address;
  }

  getUniversity(): string {
    return this.university;
  }
  setUniversity(university: string): void {
    this.university = university;
  }

  getAvatarUrl(): string {
    return this.avatarUrl;
  }
  setAvatarUrl(avatarUrl: string): void {
    this.avatarUrl = avatarUrl;
  }

  getAcademicYearStart(): string {
    return this.academicYearStart;
  }
  setAcademicYearStart(academicYearStart: string): void {
    this.academicYearStart = academicYearStart;
  }

  getAcademicYearEnd(): string | null {
    return this.academicYearEnd;
  }
  setAcademicYearEnd(academicYearEnd: string | null): void {
    this.academicYearEnd = academicYearEnd;
  }

  getPhoneNumber(): string {
    return this.phoneNumber;
  }
  setPhoneNumber(phoneNumber: string): void {
    this.phoneNumber = phoneNumber;
  }

  getIsApproved(): boolean {
    return this.isApproved;
  }
  setIsApproved(isApproved: boolean): void {
    this.isApproved = isApproved;
  }

  getStatus(): string {
    return this.status;
  }
  setStatus(status: string): void {
    this.status = status;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }
  setCreatedAt(createdAt: Date): void {
    this.createdAt = createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }
  setUpdatedAt(updatedAt: Date): void {
    this.updatedAt = updatedAt;
  }

  getStudentCardDTOS(): StudentCard[] {
    return this.studentCardDTOS;
  }
  setStudentCardDTOS(studentCardDTOS: StudentCard[]): void {
    this.studentCardDTOS = studentCardDTOS;
  }

  getApproved(): number {
    return this.approved;
  }
  setApproved(approved: number): void {
    this.approved = approved;
  }
}
