import React, { useEffect, useState } from 'react';
import JobApplicationForm from '../apply-jobs/JobApplicationForm';
import { useNavigate, useParams } from 'react-router-dom';
import {
  acceptJob,
  bannedJob,
  checkStudentProfileApproval,
  getDetailJob,
  rejectJob,
  sendDraftJob,
} from '../../../service/business/jobpostings/JobPostingsService';
import { getBusinessById } from '../../../service/business/MyBusinessService';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { getJobRecommendations } from '../../../service/business/job-categories/JobCategoriesService';
import { favouritejob } from '../../../service/business/favouritejob';

import { RootState } from '../../../app/store';
import Loading from '../../../common/Loading';

const renderStatus = (status: number) => {
  switch (status) {
    case 0:
      return 'Pending';
    case 1:
      return 'Accepted';
    case 2:
      return 'Rejected';
    case 3:
      return 'Hidden';
    case -1:
      return 'Draft';
    default:
      return 'Unknown';
  }
};

const isExpired = (expirationDate: any) => {
  const now = new Date();
  const expiration = new Date(expirationDate);
  return expiration < now;
};

export default function JobDetail() {
  const navigate = useNavigate();
  const { jobId } = useParams();

  const [showModal, setShowModal] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);
  const [nameRole, setNameRole] = useState<string>('');

  const [jobRecommendation, setJobRecommendation] = useState([]);

  useEffect(() => {
    if (!user) {
      setNameRole('-');
      return;
    }

    const role = user?.roleNames?.join(', ') || '-';
    const trimmedRole = role.trim();

    if (trimmedRole.includes('STUDENT')) {
      setNameRole('STUDENT');
    } else if (trimmedRole.includes('BUSINESS')) {
      setNameRole('BUSINESS');
    } else if (trimmedRole.includes('STAFF_ADMIN')) {
      setNameRole('STAFF_ADMIN');
    } else {
      setNameRole('-');
    }
  }, [user]);

  const [salary, setSalary] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [numberOfPositions, setNumberOfPositions] = useState(0);
  const [status, setStatus] = useState(null);
  const [isDeleted, setIsDeleted] = useState(false);
  const [expirationDate, setExpirationDate] = useState('');
  const [categoryNames, setCategoryNames] = useState<string[]>([]);
  const [Locationjob, setLocation] = useState<string>('');
  const [businessId, setbusinessId] = useState<string>('');
  const [statusBusiness, setStatusBusiness] = useState<string>('');

  const [businessInfo, setBusinessInfo] = useState({
    companyName: '',
    industry: '',
    companyInfo: '',
    websiteUrl: '',
    phoneNumber: '',
    email: '',
    address: '',
  });

  // useEffect 1 - gọi API public
  const [reason, setreason] = useState('');
  useEffect(() => {
    const fetchJobDetail = async () => {
      try {
        const informationJobResponse = await getDetailJob(jobId);
        const data = informationJobResponse?.data;
        console.log(informationJobResponse, 'data');

        setSalary(data.salary);
        setAvatarUrl(data.avatarUrl);
        setJobTitle(data.title);
        setJobDescription(data.description);
        setNumberOfPositions(data.numberEmployees);
        setStatus(data.status);
        setIsDeleted(data.deleted);
        setExpirationDate(data.expirationDate);
        setCategoryNames(data.categoryNames);
        setLocation(data.location);
        setbusinessId(data.businessId);
        setStatusBusiness(data.businessStatus);
        setreason(data.reasonRejection);

        const jobRecommendationResponse = await getJobRecommendations(jobId);
        setJobRecommendation(jobRecommendationResponse.data);
      } catch (error) {
        console.error('Error fetching job detail:', error);
      }
    };

    fetchJobDetail();
  }, [jobId]);

  useEffect(() => {
    const fetchPrivateData = async () => {
      try {
        if (!user || !businessId) return;

        const businessInfoResponse = await getBusinessById(businessId);
        const businessData = businessInfoResponse?.data;

        setBusinessInfo({
          companyName: businessData.companyName,
          industry: businessData.industry,
          companyInfo: businessData.companyInfo,
          websiteUrl: businessData.websiteUrl,
          phoneNumber: businessData.phoneNumber,
          email: businessData.email,
          address: businessData.address,
        });
      } catch (error) {
        console.error('Error fetching private job data:', error);
      }
    };

    fetchPrivateData();
  }, [user, businessId, jobId]);

  const handlePreAccept = async (jobId: string) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to accept this job posting',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#07b107',
      cancelButtonColor: '#e74c3c',
      confirmButtonText: 'Agree',
      cancelButtonText: 'Cancel',
      background: '#ffffff',
      color: '#333333',
    }).then((result) => {
      if (result.isConfirmed) {
        handleAccept(jobId);
      }
    });
  };

  const handleAccept = async (jobId: string) => {
    try {
      const response = await acceptJob(jobId);
      console.log(response.data, 'response.data');

      Swal.fire({
        title: 'Job accepted successfully!',
        text: 'Your job has been accepted successfully.',
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
    } catch (error) {
      console.error('Error accepting job:', error);
      throw new Error(error?.response?.data?.message || 'Something went wrong');
    }
  };

  const handlePreReject = async (jobId: string) => {
    // Bước 1: Nhập lý do
    const { value: reason } = await Swal.fire({
      title: 'Enter reason to reject this job',
      input: 'textarea',
      inputLabel: 'Reason',
      inputPlaceholder: 'Type your reason here...',
      inputAttributes: {
        'aria-label': 'Type your reason here',
      },
      showCancelButton: true,
      confirmButtonText: 'Next',
      cancelButtonText: 'Cancel',
      background: '#ffffff',
      color: '#333333',
      inputValidator: (value) => {
        if (!value) {
          return 'Reason is required!';
        }
        return null;
      },
    });

    // Nếu người dùng không nhập hoặc cancel thì dừng lại
    if (!reason) return;

    // Bước 2: Xác nhận lại
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to reject this job.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Reject Job',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#e74c3c',
      background: '#ffffff',
      color: '#333333',
    });

    if (confirm.isConfirmed) {
      handleReject(jobId, reason);
    }
  };

  const handleReject = async (jobId: string, reason: string) => {
    try {
      const response = await rejectJob(jobId, reason);
      console.log(response.data, 'response.data');

      Swal.fire({
        title: 'Job rejected successfully!',
        text: 'Your job has been rejected successfully.',
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
    } catch (error: any) {
      console.error('Error rejecting job:', error);
      Swal.fire({
        title: 'Error',
        text: error?.message || 'Something went wrong',
        icon: 'error',
      });
    }
  };

  const handlePreBanned = async (jobId: string) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to ban this job posting',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e74c3c',
      cancelButtonColor: '#07b107',
      confirmButtonText: 'Agree',
      cancelButtonText: 'Cancel',
      background: '#ffffff',
      color: '#333333',
    }).then((result) => {
      if (result.isConfirmed) {
        handleBanned(jobId);
      }
    });
  };

  const handleBanned = async (jobId: string) => {
    try {
      const response = await bannedJob(jobId);
      console.log(response.data, 'response.data');

      Swal.fire({
        title: 'Job banned successfully!',
        text: 'Your job has been banned successfully.',
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
    } catch (error) {
      console.error('Error banning job:', error);
      throw new Error(error?.response?.data?.message || 'Something went wrong');
    }
  };

  const handlePreSendDraft = (jobId: string) => {
    Swal.fire({
      title: 'Confirm send draft?',
      text: 'Are you sure you want to submit this job draft request?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#07b107',
      cancelButtonColor: '#e74c3c',
      confirmButtonText: 'Agree',
      cancelButtonText: 'Cancel',
      background: '#ffffff',
      color: '#333333',
    }).then((result) => {
      if (result.isConfirmed) {
        handleSendDraft(jobId);
      }
    });
  };

  const handleSendDraft = async (jobId: string) => {
    try {
      const response = await sendDraftJob(jobId);
      console.log(response.data, 'response.data');

      Swal.fire({
        title: 'Draft sent successfully!',
        text: 'Your job draft has been sent successfully.',
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
    } catch (error) {
      console.error('Error sending draft:', error);
      throw new Error(error.response?.data?.message || 'Something went wrong');
    }
  };

  const handleAddFavourite = async (jobId: string) => {
    if (jobId === '') {
      return;
    }

    const result = await Swal.fire({
      title: 'Are you sure you want to add to favorites?',
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
        const response = await service.createFavoriteJob(jobId);
        console.log(response, 'response.data');
        if (response) {
          Swal.fire({
            title: 'Add favorites successfully!',
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
            title: 'Error Add favorites !',
            icon: 'error',
            confirmButtonColor: '#d33',
          });
        }
      } catch (error) {
        console.error('Error Add favorites:', error);
        Swal.fire({
          title: 'Error Add favorites !',
          icon: 'error',
          confirmButtonColor: '#d33',
        });
      }
    }
  };

  const handleClickFavorite = (jobId: string) => {
    if (!user) {
      navigate('/login');
      return;
    } else {
      handleAddFavourite(jobId ?? '');
    }
  };

  useEffect(() => {
    if (jobRecommendation && statusBusiness === 'inactive') {
      Swal.fire({
        icon: 'warning',
        title: 'Business has been banned',
        text: 'Please return to the previous page!',
        confirmButtonText: 'OK',
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then((result) => {
        if (result.isConfirmed) {
          navigate(-1); // quay lại trang trước
        }
      });
    }
  }, [jobRecommendation, statusBusiness, navigate]);

  if (!jobRecommendation || jobRecommendation.length === 0) {
    return <Loading />;
  }

  console.log(expirationDate, 'expirationDate');
  console.log(statusBusiness, 'statusBusiness');

  return (
    <>
      <div className="clearfix" />
      {/* Title Header Start */}
      <section
        className="inner-header-title"
        style={{ backgroundImage: 'url(/assets/img/banner-10.jpg)' }}
      >
        <div className="container">
          {/* <h4>Job Detail</h4> */}
          <h2>{jobTitle}</h2>
        </div>
      </section>
      <div className="clearfix" />

      <section className="detail-desc">
        <div className="container white-shadow">
          <div className="row">
            <div className="detail-pic">
              <img src={avatarUrl} className="img" alt="image" />
            </div>
            <div className="detail-status">
              {isDeleted ? (
                <span style={{ backgroundColor: 'red', color: '#fff' }}>
                  Banned
                </span>
              ) : (
                <span>{renderStatus(status)}</span>
              )}
            </div>
          </div>
          <div className="row bottom-mrg">
            <div className="col-md-6 col-sm-6">
              <div className="detail-desc-caption">
                <h3>{jobTitle}</h3>
                <h3>
                  Company:{' '}
                  <a
                    href={'http://localhost:5173/BusinessDetail/' + businessId}
                  >
                    {businessInfo.companyName}
                  </a>
                </h3>
                <div className="category-tags" style={{ marginTop: '8px' }}>
                  {categoryNames.map((name, index) => (
                    <span
                      key={index}
                      style={{
                        display: 'inline-block',
                        backgroundColor: '#f0f0f0',
                        color: '#333',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '1.3rem',
                        marginRight: '6px',
                        marginBottom: '6px',
                      }}
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-md-6 col-sm-6">
              <div className="get-touch">
                <h4>Job Description</h4>
                <ul>
                  <li>Address: {Locationjob}</li>
                  <li>
                    Salary: <span>{salary}</span>
                  </li>
                  <li>
                    Number of positions:{' '}
                    <span>{numberOfPositions} Positions</span>
                  </li>
                  <li>
                    Expiration Date:{' '}
                    <span>
                      {new Date(expirationDate).toLocaleDateString('en-GB', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                      })}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            {nameRole === 'BUSINESS' && status === 2 ? (
              <div className="col-md-12 col-sm-12">
                <h5 style={{ marginLeft: '5px', color: 'red' }}>
                  Reason: {reason}
                </h5>
              </div>
            ) : (
              ''
            )}
          </div>
          <div className="row no-padd">
            <div className="detail pannel-footer">
              <div className="">
                <div
                  className="detail-pannel-footer-btn"
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '15px',
                  }}
                >
                  {(nameRole === 'STUDENT' || !user) && (
                    <>
                      {new Date(expirationDate) > new Date() ? (
                        <>
                          <a
                            href="#"
                            className="footer-btn grn-btn"
                            onClick={async (e) => {
                              e.preventDefault();
                              if (!user) {
                                navigate('/login');
                              } else {
                                const condition =
                                  await checkStudentProfileApproval();
                                if (condition) {
                                  setShowModal(true);
                                } else {
                                  Swal.fire({
                                    title: 'Notification',
                                    text: 'You have not been accepted for the student profile',
                                    icon: 'warning',
                                    confirmButtonText: 'OK',
                                  });
                                }
                              }
                            }}
                          >
                            Quick Apply
                          </a>
                          <a
                            href="#"
                            className="footer-btn blu-btn"
                            onClick={(e) => {
                              e.preventDefault();
                              if (!user) {
                                navigate('/login');
                              } else {
                                handleAddFavourite(jobId ?? '');
                              }
                            }}
                          >
                            Add favorite
                          </a>
                        </>
                      ) : (
                        <p>This job has expired.</p>
                      )}
                    </>
                  )}

                  {nameRole === 'BUSINESS' && (
                    <>
                      {(status === -1 || status === 2) && (
                        <>
                          <div
                            onClick={() =>
                              navigate(`/business/update-job/${jobId}`)
                            }
                            className="footer-btn blu-btn"
                          >
                            Update
                          </div>

                          {status === -1 && (
                            <div
                              onClick={() => handlePreSendDraft(jobId)}
                              className="footer-btn blu-btn"
                            >
                              Send Draft
                            </div>
                          )}
                        </>
                      )}
                    </>
                  )}

                  {nameRole === 'STAFF_ADMIN' && (
                    <>
                      {status === 0 && (
                        <>
                          <button
                            className="footer-btn grn-btn"
                            onClick={() => handlePreAccept(jobId)}
                          >
                            Accept
                          </button>
                          <button
                            className="footer-btn"
                            style={{ backgroundColor: 'red', color: '#fff' }}
                            onClick={() => handlePreReject(jobId)}
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {status === 1 && isDeleted !== true && (
                        <>
                          <button
                            href="#"
                            style={{
                              fontWeight: 'bold',
                              width: '126px',
                              height: '48px',
                              backgroundColor: 'red',
                              textAlign: 'center',
                              padding: '10px 0',
                              alignItems: 'center',
                              color: '#fff',
                            }}
                            className="footer-btn red-btn"
                            onClick={() => handlePreBanned(jobId)}
                          >
                            Ban
                          </button>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="full-detail-description full-detail">
        <div className="container">
          <div className="row row-bottom">
            <h2 className="detail-title">Job Description</h2>
            <ul className="detail-list">
              <li>{jobDescription}</li>
            </ul>
          </div>
          <div className="row row-bottom">
            <h2 className="detail-title">Job Recommendation</h2>
            <div className="item-click">
              <article>
                {jobRecommendation.map((job) => (
                  <div
                    className="brows-job-list row"
                    key={job.jobId}
                    style={{
                      padding: '15px 0',
                      borderBottom: '1px solid #eee',
                      marginLeft: '1px',
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
                          {job.urgentRecruitment && (
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
                            {new Date(job.expirationDate).toLocaleDateString(
                              'vi-VN',
                            )}
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

                    {/* Nút View */}

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
                              onClick={handleClickFavorite.bind(
                                null,
                                job.jobId,
                              )}
                            >
                              <i className="fa fa-heart" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </article>
            </div>
          </div>
        </div>
      </section>
      {showModal && (
        <JobApplicationForm onClose={() => setShowModal(false)} jobId={jobId} />
      )}
    </>
  );
}
