import React, { useEffect, useState } from 'react'
import { ApiResponse } from '../../../features/auth/authType'
import { JobPostingsResponseDTO } from '../../../service/business/BusinessDetailService'
import { favouritejob } from '../../../service/business/favouritejob';
import Swal from 'sweetalert2';

export default function ListJobfavorites() {

    const [jobFavorites, setJobFavorites] = useState<JobPostingsResponseDTO[]>([]);
    const [showModal, setShowModal] = useState(false);
    const getjobs = async () => {
        const response = await axiosPrivate.get<ApiResponse<JobPostingsResponseDTO[]>>("farvouritejob/getall")
        setJobFavorites(response.data.data);
    }
    useEffect(() => {

        getjobs();
    }, [])
    const isExpired = (expirationDate: any) => {
        const now = new Date();
        const expiration = new Date(expirationDate);
        return expiration < now;
    };



    const RemoveFavouriteJob = async (id: string) => {

        if (id === "") {
            return;
        }

        const result = await Swal.fire({
            title: 'Are you sure you want to delete to favorites?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'Cancel',
            background: '#ffffff',
            color: '#333333',
            confirmButtonColor: '#07b107',
            cancelButtonColor: '#d33',
        });

        if (result.isConfirmed) {
            try {
                const service = new favouritejob();
                const response = await service.removeFavoriteJob(id);
                console.log(response, 'response.data');
                if (response) {


                    Swal.fire({
                        title: 'delete favorites successfully!',
                        icon: 'success',
                        background: '#ffffff',
                        color: '#333333',
                        confirmButtonColor: '#07b107',
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                        willClose: () => {
                            window.location.reload();
                        },
                    });
                } else {
                    Swal.fire({
                        title: 'Error delete favorites !',
                        icon: 'error',
                        confirmButtonColor: '#d33',
                    });
                }
            } catch (error) {
                console.error('Error delete favorites:', error);
                Swal.fire({
                    title: 'Error Add favorites !',
                    icon: 'error',
                    confirmButtonColor: '#d33',
                });
            }
        }
    };


    return (
        <>
            <div>
                <div className="clearfix" />
                {/* Title Header Start */}
                <section
                    className="inner-header-title"
                    style={{ backgroundImage: 'url(/assets/img/banner-10.jpg)' }}
                >
                    <div className="container">
                        <h1>Favorites Jobs</h1>
                    </div>
                </section>
                <div className="clearfix" />

                <section className="brows-job-category">
                    <div className="container">


                        <div className="item-click">
                            {jobFavorites && jobFavorites.length > 0 ? (<article>
                                {jobFavorites.map((job) => (
                                    <div
                                        className="brows-job-list row"
                                        key={job.jobId}
                                        style={{
                                            padding: '15px 0',
                                            borderBottom: '1px solid #eee',
                                        }}
                                    >
                                        {/* Ảnh công ty */}
                                        <div className="col-md-1 col-sm-2 small-padding">
                                            <div className="brows-job-company-img">
                                                <a href={`/detail-job/${job.jobId}`}>
                                                    <img
                                                        src={
                                                            job.avatarUrl || '/assets/img/default-company.jpg'
                                                        }
                                                        className="img-responsive"
                                                        alt={job.companyName}
                                                    />
                                                </a>
                                            </div>
                                        </div>

                                        {/* Thông tin job */}
                                        <div className="col-md-6 col-sm-5">
                                            <div className="brows-job-position">
                                                <a href={`/detail-job/${job.jobId}`}>
                                                    <h3 className="job-title">{job.title}</h3>
                                                </a>

                                                <p>
                                                    <span style={{ fontWeight: 'bold' }}>
                                                        {job.companyName}
                                                    </span>
                                                    <span
                                                        className="brows-job-sallery"
                                                        style={{ marginLeft: '15px' }}
                                                    >
                                                        <i className="fa fa-money" /> {job.salary}
                                                    </span>
                                                    {job.isUrgentRecruitment && (
                                                        <span
                                                            className="job-type cl-danger bg-trans-danger"
                                                            style={{ marginLeft: '15px' }}
                                                        >
                                                            Urgent
                                                        </span>
                                                    )}
                                                    <span
                                                        style={{
                                                            marginLeft: '25px',
                                                            color: '#666',
                                                            fontStyle: 'italic',
                                                        }}
                                                    >
                                                        Expiration:{' '}
                                                        {job.expirationDate}
                                                    </span>
                                                </p>

                                                {/* Hiển thị các category */}
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        flexWrap: 'wrap',
                                                        gap: '8px',
                                                        marginTop: '8px',
                                                    }}
                                                >
                                                    {job.categoryNames?.map((cat, idx) => (
                                                        <span
                                                            key={idx}
                                                            style={{
                                                                backgroundColor: '#e9ecef',
                                                                color: '#333',
                                                                fontSize: '12px',
                                                                padding: '4px 8px',
                                                                borderRadius: '12px',
                                                            }}
                                                        >
                                                            {cat}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Địa điểm */}
                                        <div className="col-md-3 col-sm-3">
                                            <div className="brows-job-location">
                                                <p>
                                                    <i className="fa fa-map-marker" /> {job.location}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Nút Apply và Save */}

                                        <div className="col-md-2 col-sm-2">
                                            <div
                                                className="brows-job-link"
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    gap: '10px',
                                                }}
                                            >
                                                {isExpired(job.expirationDate) ? (
                                                    <span
                                                        style={{
                                                            padding: '10px 15px',
                                                            backgroundColor: '#dc3545',
                                                            color: '#fff',
                                                            borderRadius: '4px',
                                                            fontWeight: 'bold',
                                                            textAlign: 'center',
                                                            flex: 1,
                                                        }}
                                                    >
                                                        Expired
                                                    </span>
                                                ) : (
                                                    <>
                                                        <button
                                                            className="btn"
                                                            style={{
                                                                backgroundColor: '#f8f9fa',
                                                                color: '#000',
                                                                border: '1px solid #ccc',
                                                                padding: '10px 15px',
                                                                borderRadius: '4px',
                                                                transition:
                                                                    'background-color 0.3s ease, color 0.3s ease',
                                                                cursor: 'pointer',
                                                                flex: 1,
                                                            }}
                                                            onMouseOver={(e) => {
                                                                e.currentTarget.style.backgroundColor =
                                                                    '#07b107';
                                                                e.currentTarget.style.color = '#fff';
                                                            }}
                                                            onMouseOut={(e) => {
                                                                e.currentTarget.style.backgroundColor =
                                                                    '#f8f9fa';
                                                                e.currentTarget.style.color = '#000';
                                                            }}
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                setShowModal(true);
                                                            }}
                                                        >
                                                            Apply Now
                                                        </button>

                                                        <button
                                                            className="btn"
                                                            style={{
                                                                backgroundColor: '#fff',
                                                                color: '#dc3545',
                                                                border: '2px solid #dc3545',
                                                                padding: '10px',
                                                                borderRadius: '50%',
                                                                width: '42px',
                                                                height: '42px',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                transition: 'border-color 0.3s ease',
                                                                cursor: 'pointer',
                                                            }}
                                                            title="Save Job"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                RemoveFavouriteJob(job.jobId);
                                                            }}
                                                        >
                                                            <i className="fa fa-trash" />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </article>) : ("No favorites jobs")}

                        </div>

                    </div>
                </section>
            </div>
        </>
    )
}
