import React, { useEffect, useState } from 'react'
import "./admindashboard.css";
import { ListStudentAccountService } from '../../services/admin/ListStudentAccountService';
import { StudentProfile } from '../../services/user/StudentProfile/StudentProfile';
import { StudentCard } from '../../services/user/StudentProfile/StudentCard';
import Swal from 'sweetalert2';
export default function ListStudentAccount() {
    const [search, setsearch] = useState<string>("");
    const [isApproved, SetisApproved] = useState<number>(-1);
    const [pageIndex, SetpageIndex] = useState<number>(1);
    const [pageSize, SetpageSize] = useState<number>(10);
    const [selectedImages, setSelectedImages] = useState<{ url: string }[]>([]);
    const [studentlist, setstudentlist] = useState<StudentProfile[]>();
    const [selectedImage, setSelectedImage] = useState(String);
    const [totalPage, settotalPage] = useState<number>();


    const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);
    useEffect(() => {
        const fetchstudentProfile = async () => {
            const service = new ListStudentAccountService();
            const response = await service.GetAllProfileStudent(search, isApproved, pageIndex, pageSize);
            setstudentlist(response?.items);
            settotalPage(response?.totalPages);
            console.log("Student list" + response?.items?.length);
        }
        fetchstudentProfile();
    }, [])


    const clickdetails = async (id: string) => {
        const service = new ListStudentAccountService();
        const response = await service.GetProfileStudentById(id);
        console.log(response);
        setSelectedStudent(response);
        setSelectedImages(
            response?.studentCardDTOS?.map((item: StudentCard) => ({
                url: item.studentCardUrl
            })) || []
        );

        console.log(selectedImages);
    }

    const closePopup = () => {
        setSelectedStudent(null);
    }



    const handleSearch = async () => {
        const service = new ListStudentAccountService();
        SetpageIndex(1);
        const response = await service.GetAllProfileStudent(search, isApproved, 1, pageSize);
        setstudentlist(response?.items);
        settotalPage(response?.totalPages);
        console.log("Student list" + response?.items?.length);
    }

    const handleSearchpaging = async (pageIndex: number) => {
        const service = new ListStudentAccountService();
        console.log(pageIndex);
        if (pageIndex < 1) {
            return;
        }
        SetpageIndex(pageIndex);
        const response = await service.GetAllProfileStudent(search, isApproved, pageIndex, pageSize);
        setstudentlist(response?.items);
        settotalPage(response?.totalPages);
        console.log("Student list" + response?.items?.length);
    }

    const banUnban = async (studentId: string, status: string) => {
        // Hiển thị confirm dialog trước khi ban/unban
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "Do you want to ban/unban this student?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, ' + status + '!'
        });

        // Nếu người dùng nhấn "Yes"
        if (result.isConfirmed) {
            const service = new ListStudentAccountService();

            // Gọi API để ban/unban học sinh
            const success = await service.BanStudent(studentId);

            // Hiển thị thông báo thành công hoặc thất bại
            if (success) {
                Swal.fire(
                    'Success!',
                    'The student has been ' + status + ' successfully.',
                    'success'
                );
            } else {
                Swal.fire(
                    'Failed!',
                    'There was an error processing the request.',
                    'error'
                );
            }
        }
    };

    return (
        <div className="flex flex-col w-full">
            {/* Banner */}
            <div className="w-full bg-gray-100 flex justify-center py-6">
                <section
                    className="inner-header-title rounded-xl overflow-hidden shadow-lg w-full max-w-6xl bg-cover bg-center"
                    style={{
                        backgroundImage: "url(/assets/img/banner-10.jpg)",
                        height: "350px",
                    }}
                >
                    <div className="w-full h-full flex flex-col justify-center items-center backdrop-brightness-50 text-white px-6">
                        <h1 className="text-5xl font-extrabold">Admin Dashboard</h1>
                        <p className="mt-4 text-lg">
                            Welcome back, Admin. Here's an overview of the platform.
                        </p>
                    </div>
                </section>
            </div>

            {/* Nội dung chính trong khung trắng */}
            <div className="white-shadow px-12 py-8">

                <div className="search-container" style={{ padding: '20px', textAlign: 'center' }}>
                    <div className="search-box" style={{
                        display: 'flex',
                        width: '600px',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '5px',
                        backgroundColor: '#f7f7f7',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => { setsearch(e.target.value) }}
                            placeholder="Search..."
                            style={{
                                border: 'none',
                                outline: 'none',
                                width: '50%',
                                padding: '5px 10px',
                                fontSize: '16px'
                            }}
                        />
                        <select style={{
                            border: 'none',
                            outline: 'none',
                            width: '35%',
                            padding: '5px 10px',
                            fontSize: '16px',
                            backgroundColor: '#bbbcbf',
                        }}
                            value={isApproved}
                            onChange={(e) => { SetisApproved(parseInt(e.target.value)) }}
                        >
                            <option value={-1}>All</option>
                            <option value={0}>Pending</option>
                            <option value={1}>Approved</option>
                        </select>
                        <button
                            onClick={handleSearch}
                            style={{
                                padding: '5px 10px',
                                backgroundColor: '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer'
                            }}
                        >
                            Search
                        </button>
                    </div>
                </div>

                {/* === Recent Registrations & Staff Admin Overview === */}
                <div className="dashboard-row">
                    {/* Recent Registrations */}
                    <div className="dashboard-card">
                        <h3 className="card-title">List Student </h3>
                        <table className="simple-table">
                            <thead>
                                <tr>
                                    <th>Profile Id</th>
                                    <th>Avatar</th>
                                    <th>Full Name</th>
                                    <th>Major</th>
                                    <th>Date Of Birth</th>
                                    <th>Addess</th>
                                    <th>University</th>
                                    <th>Phone number</th>
                                    <th>Create</th>
                                </tr>
                            </thead>
                            <tbody>
                                {studentlist?.map((student) => (
                                    <tr>
                                        <td onClick={() => clickdetails(student.profileId)}>{student.profileId}</td>
                                        <td><img style={{ width: '50px', height: '50px' }} src={student.avatarUrl} /></td>
                                        <td>{student.fullName}</td>
                                        <td>{student.major}</td>
                                        <td>{student.dateOfBirth}</td>
                                        <td>{student.address}</td>
                                        <td>{student.university}</td>
                                        <td>{student.phoneNumber}</td>
                                        <td>{new Date(student.createdAt).toLocaleDateString()}</td>
                                        {student.status === 'active' ? (<td className="status-active">Active</td>) : (<td className="status-inactive">Inactive</td>)}
                                        {/* <td className="status-active">Active</td> */}
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {studentlist ? (<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: 'auto', marginTop: '15px' }}>
                            <span
                                style={{
                                    color: 'gray',
                                    cursor: 'pointer',
                                    fontSize: '20px',
                                    padding: '5px',
                                    borderRadius: '50%',
                                    border: '2px solid #ddd',
                                    marginRight: '10px',
                                    width: '37px',
                                    textAlign: 'center'
                                }}
                                onClick={async () => {
                                    // Your async logic here
                                    await handleSearchpaging(pageIndex - 1);
                                    // Other logic (if necessary)
                                }}
                            >
                                &lt;
                            </span>
                            <span
                                style={{
                                    fontSize: '16px',
                                    marginRight: '10px',
                                    color: 'gray'
                                }}
                            >
                                {pageIndex} / {totalPage} Pages
                            </span>
                            <span
                                style={{
                                    color: 'gray',
                                    cursor: 'pointer',
                                    fontSize: '20px',
                                    padding: '5px',
                                    borderRadius: '50%',
                                    border: '2px solid green',
                                    width: '37px',
                                    textAlign: 'center'
                                }}

                                onClick={async () => {
                                    // Your async logic here
                                    await handleSearchpaging(pageIndex + 1);
                                    // Other logic (if necessary)
                                }}
                            >
                                &gt;
                            </span>
                        </div>) : ("")}


                    </div>
                </div>
            </div>
            {/* Popup for student details */}
            {/* Popup for student details */}
            {selectedStudent && (
                <div
                    className="popup-overlay"
                    onClick={closePopup}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000
                    }}
                >
                    <div
                        className="popup-container"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            backgroundColor: 'white',
                            padding: '20px',
                            borderRadius: '8px',
                            width: '500px',
                            maxWidth: '90%',
                            maxHeight: '70vh', // Giới hạn chiều cao tối đa
                            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                            textAlign: 'left',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px',
                            overflowY: 'auto' // Cho phép cuộn dọc
                        }}
                    >
                        <h2>Student Details</h2>
                        <table>
                            <tbody>
                                <tr key="avatar"><td><img style={{ width: '100px', height: '100px' }} src={selectedStudent.avatarUrl} alt="Avatar" /></td></tr>
                                <tr key="profileId"><td>Profile Id</td><td>{selectedStudent.profileId}</td></tr>
                                <tr key="fullName"><td>Full Name</td><td>{selectedStudent.fullName}</td></tr>
                                <tr key="major"><td>Major</td><td>{selectedStudent.major}</td></tr>
                                <tr key="dob"><td>Date Of Birth</td><td>{selectedStudent.dateOfBirth}</td></tr>
                                <tr key="address"><td>Address</td><td>{selectedStudent.address}</td></tr>
                                <tr key="university"><td>University</td><td>{selectedStudent.university}</td></tr>
                                <tr key="academicStart"><td>Academic Year Start</td><td>{selectedStudent.academicYearStart}</td></tr>
                                <tr key="academicEnd"><td>Academic Year End</td><td>{selectedStudent.academicYearEnd}</td></tr>
                                <tr key="phone"><td>phoneNumber</td><td>{selectedStudent.phoneNumber}</td></tr>
                                <tr key="createdAt"><td>Created At</td><td>{new Date(selectedStudent.createdAt).toLocaleDateString()}</td></tr>
                                <tr key="isApproved"><td>Is Approved</td><td>{selectedStudent.isApproved}</td></tr>
                                <tr key="imageStudent"><td>Image Student</td></tr>
                            </tbody>
                        </table>

                        <div className="image-upload-container" style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '10px 0',
                            height: '100px'
                        }}>
                            {selectedImages.map((image, index) => (
                                <div key={index} className="image-preview" style={{
                                    position: 'relative',
                                    minWidth: '100px',
                                    height: '100px',
                                    flexShrink: 0
                                }}>
                                    <img
                                        src={image.url}
                                        alt={`Preview ${index}`}
                                        onClick={() => setSelectedImage(image.url)}
                                        style={{
                                            width: '100px',
                                            height: '100px',
                                            objectFit: 'cover',
                                            borderRadius: '4px'
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            {selectedStudent.status === "active" ? (<button
                                onClick={async () => {
                                    // Your async logic here
                                    await banUnban(selectedStudent.profileId, 'ban');
                                    // Other logic (if necessary)
                                }}
                                style={{
                                    backgroundColor: '#bf0814',
                                    color: 'white',
                                    border: 'none',
                                    padding: '10px 15px',
                                    cursor: 'pointer',
                                    borderRadius: '5px',
                                    transition: 'background-color 0.3s',
                                    width: '40%',
                                    marginRight: '10px'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
                            >
                                Ban
                            </button>) : (<button
                                onClick={async () => {
                                    // Your async logic here
                                    await banUnban(selectedStudent.profileId, 'UnBan');
                                    // Other logic (if necessary)
                                }}
                                style={{
                                    backgroundColor: '#bf0814',
                                    color: 'white',
                                    border: 'none',
                                    padding: '10px 15px',
                                    cursor: 'pointer',
                                    borderRadius: '5px',
                                    transition: 'background-color 0.3s',
                                    width: '40%',
                                    marginRight: '10px'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
                            >
                                UnBan
                            </button>)}

                            <button
                                onClick={closePopup}
                                style={{
                                    backgroundColor: '#007bff',
                                    color: 'white',
                                    border: 'none',
                                    padding: '10px 15px',
                                    cursor: 'pointer',
                                    borderRadius: '5px',
                                    transition: 'background-color 0.3s',
                                    width: '40%',
                                    marginLeft: '10px'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {selectedImage !== "" && (
                <div
                    onClick={() => setSelectedImage("")}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000,
                    }}
                >
                    <img
                        src={selectedImage}
                        alt="Full View"
                        style={{
                            maxHeight: '90%',
                            maxWidth: '90%',
                            objectFit: 'contain',
                            borderRadius: '0px',
                        }}
                    />
                </div>
            )}

        </div>
    )
}
