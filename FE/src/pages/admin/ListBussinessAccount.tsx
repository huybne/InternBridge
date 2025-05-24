import React, { useEffect, useState } from 'react'
import { BusinessProfilesDTO, ListBussinessAccountServcie } from '../../services/admin/ListBussinessAccountService';
import Swal from 'sweetalert2';

export default function ListBussinessAccount() {
    const [search, setsearch] = useState<string>("");
    const [isApproved, SetisApproved] = useState<number>(-1);
    const [pageIndex, SetpageIndex] = useState<number>(1);
    const [pageSize, SetpageSize] = useState<number>(10);
    const [selectedImages, setSelectedImages] = useState<{ url: string }[]>([]);
    const [businesslist, setbusinesslist] = useState<BusinessProfilesDTO[]>();
    const [selectedImage, setSelectedImage] = useState(String);
    const [totalPage, settotalPage] = useState<number>();


    const [selectedBusiness, setselectedBusiness] = useState<BusinessProfilesDTO | null>(null);
    useEffect(() => {
        const fetchBusinessProfile = async () => {
            const service = new ListBussinessAccountServcie();
            const response = await service.GetAllBusiness(search, isApproved, pageIndex, pageSize);
            setbusinesslist(response?.items);
            settotalPage(response?.totalPages);
            console.log("Student list" + response?.items?.length);
        }
        fetchBusinessProfile();
    }, [])


    const clickdetails = async (id: string) => {
        const service = new ListBussinessAccountServcie();
        const response = await service.GetBusinessProfile(id);
        console.log(response);
        setselectedBusiness(response);
        setSelectedImages(
            response?.imageBusiness?.map((item: string) => ({
                url: item
            })) || []
        );
        console.log(selectedImages);
    }

    const closePopup = () => {
        setselectedBusiness(null);
    }



    const handleSearch = async () => {
        const service = new ListBussinessAccountServcie();
        SetpageIndex(1);
        const response = await service.GetAllBusiness(search, isApproved, 1, pageSize);
        setbusinesslist(response?.items);
        settotalPage(response?.totalPages);
        console.log("Business list" + response?.items?.length);
    }

    const handleSearchpaging = async (pageIndex: number) => {
        const service = new ListBussinessAccountServcie();
        console.log(pageIndex);
        if (pageIndex < 1) {
            return;
        }
        SetpageIndex(pageIndex);
        const response = await service.GetAllBusiness(search, isApproved, pageIndex, pageSize);
        setbusinesslist(response?.items);
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
            const service = new ListBussinessAccountServcie();

            // Gọi API để ban/unban học sinh
            const success = await service.BanBusiness(studentId);

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

                        window.location.reload();
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
            <div className="white-shadow px-12 py-8" >

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
                        <h3 className="card-title">List Business Profile </h3>
                        <table className="simple-table">
                            <thead>
                                <tr>
                                    <th>Avatar</th>
                                    <th>Company Name</th>
                                    <th>Industry</th>
                                    <th>taxCode</th>
                                    <th>email</th>
                                    <th>Phone Number</th>
                                    <th>Addess</th>
                                    <th>Create At</th>
                                    <th>status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {businesslist?.map((business) => (
                                    <tr>
                                        <td onClick={() => clickdetails(business.profileId)} ><img src={business.image_Avatar_url} style={{width: '100px' ,height: "100px", borderRadius: '15px'}} alt="" /></td>
                                        {/* <td >{business.profileId}</td> */}
                                        <td>{business.companyName}</td>
                                        <td>{business.industry}</td>
                                        <td>{business.taxCode}</td>
                                        <td>{business.email}</td>
                                        <td>{business.phoneNumber}</td>
                                        <td>{business.address}</td>
                                        <td>{new Date(business.createdAt).toLocaleDateString()}</td>
                                        {business.status === 'active' ? (<td className="status-active">Active</td>) : (<td className="status-inactive">Inactive</td>)}
                                        {/* <td className="status-active">Active</td> */}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: 'auto', marginTop: '15px' }}>
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
                        </div>

                    </div>
                </div>
            </div>
            {/* Popup for student details */}
            {/* Popup for student details */}
            {selectedBusiness && (
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
                        <h2>Business Details</h2>
                        <table>
                            <tbody>
                                <tr key="profileId"><td>Profile Id</td><td>{selectedBusiness.profileId}</td></tr>
                                <tr key="avatar"><td>Avatar</td><td> <img style={{width: '100px', height: '100px'}} src={selectedBusiness.image_Avatar_url} alt="" /></td></tr>
                                <tr key="fullName"><td>Company Name</td><td>{selectedBusiness.companyName}</td></tr>
                                <tr key="major"><td>Industry</td><td>{selectedBusiness.industry}</td></tr>
                                <tr key="dob"><td>Company Info</td><td>{selectedBusiness.companyInfo}</td></tr>
                                <tr key="address"><td>websiteUrl</td><td>{selectedBusiness.websiteUrl}</td></tr>

                                <tr key="university"><td>taxCode</td><td>{selectedBusiness.taxCode}</td></tr>

                                <tr key="academicStart"><td>email</td><td>{selectedBusiness.email}</td></tr>
                                <tr key="academicEnd"><td>Phone Number</td><td>{selectedBusiness.phoneNumber}</td></tr>
                                <tr key="phone"><td>Address</td><td>{selectedBusiness.address}</td></tr>
                                <tr key="createdAt"><td>Created At</td><td>{new Date(selectedBusiness.createdAt).toLocaleDateString()}</td></tr>
                                <tr key="isApproved"><td>Is Approved</td><td>{selectedBusiness.isApproved}</td></tr>
                                <tr key="imageStudent"><td>Image Business</td></tr>
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
                            {selectedBusiness.status === "active" ? (<button
                                onClick={async () => {
                                    // Your async logic here
                                    await banUnban(selectedBusiness.profileId, 'ban');
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
                                    await banUnban(selectedBusiness.profileId, 'UnBan');
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
