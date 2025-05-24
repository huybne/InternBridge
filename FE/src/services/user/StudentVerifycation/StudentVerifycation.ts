export class StudentVerifycation{
    fullName: string;
    major: string;
    dateOfBirth: string;
    address: string;
    university: string;
    academicYearStart: string;
    academicYearEnd: string;
    phoneNumber: string;
    
    constructor(
        fullName: string,
        major: string,
        dateOfBirth: string,
        address: string,
        university: string,
        academicYearStart: string,
        academicYearEnd: string,
        phoneNumber: string,
    ) {
        this.fullName = fullName;
        this.major = major;
        this.dateOfBirth = dateOfBirth;
        this.address = address;
        this.university = university;
        this.academicYearStart = academicYearStart;
        this.academicYearEnd = academicYearEnd;
        this.phoneNumber = phoneNumber;
    }
}