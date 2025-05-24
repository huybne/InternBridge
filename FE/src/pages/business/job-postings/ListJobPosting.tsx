import React, { useEffect, useState } from 'react';
import {
  getListJobCreated,
  hideJob,
  sendDraftJob,
  unHideJob,
} from '../../../service/business/jobpostings/JobPostingsService';
import './ListJobPosting.css';
import Swal from 'sweetalert2';

const badgeStyle = (color) => ({
  padding: '8px 16px',
  borderRadius: '4px',
  backgroundColor: color,
  color: '#fff',
  fontWeight: 'bold',
  display: 'inline-block',
  minWidth: '120px',
  textAlign: 'center',
});

const sendDraftStyle = {
  backgroundColor: '#f8f9fa',
  color: '#000',
  border: '1px solid #ccc',
  padding: '10px 20px',
  borderRadius: '4px',
  minWidth: '120px',
  transition: 'background-color 0.3s ease, color 0.3s ease',
  cursor: 'pointer',
};

export default function ListJobPosting() {
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(10);
  const [limit] = useState(2);

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

  const handleToggleStatus = async (jobId: string, currentStatus: number) => {
    try {
      let confirmTitle = '';
      let confirmText = '';
      let successText = '';
      let apiAction: () => Promise<any>;

      if (currentStatus === 1) {
        confirmTitle = 'Hide job?';
        confirmText = 'Are you sure you want to hide this job?';
        successText = 'The job has been successfully hidden.';
        apiAction = () => hideJob(jobId);
      } else if (currentStatus === 3) {
        confirmTitle = 'Show job?';
        confirmText = 'Do you want to unhide this job?';
        successText = 'The job has been successfully unhide.';
        apiAction = () => unHideJob(jobId);
      } else {
        console.warn('Job status cannot be toggled.');
        return;
      }

      const result = await Swal.fire({
        title: confirmTitle,
        text: confirmText,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Agree',
        cancelButtonText: 'Cancel',
      });

      if (!result.isConfirmed) return;

      // Show loading Swal
      Swal.fire({
        title: 'Processing...',
        text: 'Please wait a moment',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      await apiAction();

      const timerDuration = 3000;
      let timerInterval: any;

      await Swal.fire({
        title: 'Success!',
        html: `Automatically reload after <b></b> seconds.`,
        icon: 'success',
        timer: timerDuration,
        showConfirmButton: false,
        didOpen: () => {
          const b = Swal.getHtmlContainer()?.querySelector('b');
          let remaining = Math.ceil(timerDuration / 1000);

          if (b) b.textContent = remaining.toString();

          timerInterval = setInterval(() => {
            remaining -= 1;
            if (b && remaining >= 0) {
              b.textContent = remaining.toString();
            }
          }, 1000);
        },
        willClose: () => {
          clearInterval(timerInterval);
        },
      });

      window.location.reload();
    } catch (error) {
      console.error('Error toggle job status:', error);
      Swal.fire({
        title: 'Error',
        text: 'An error occurred, please try again.',
        icon: 'error',
      });
    }
  };

  useEffect(() => {
    const offset = (page - 1) * limit;
    fetchListJobCreated(offset);
  }, [page]);

  const fetchListJobCreated = async (offset: number) => {
    try {
      const response = await getListJobCreated(offset, limit);

      if (response.code === 1000) {
        setJobs(response.data.data);
        setTotalPage(response.data.totalPages);
      } else {
        console.error('Failed to fetch job postings');
      }
    } catch (error) {
      console.error('Error fetching list job created:', error);
      throw new Error(error.response?.data?.message || 'Something went wrong');
    }
  };

  console.log(jobs, 'jobs');
  console.log(totalPage, 'totalPage');

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
            <h1>List Jobs</h1>
          </div>
        </section>
        <div className="clearfix" />

        <section className="brows-job-category">
          <div className="container">
            {/* Company Searrch Filter Start */}
            <div className="row extra-mrg">
              <div className="wrap-search-filter">
                <form>
                  <div className="col-md-4 col-sm-4">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Keyword: Name, Tag"
                    />
                  </div>
                  <div className="col-md-3 col-sm-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Location: City, State, Zip"
                    />
                  </div>
                  <div className="col-md-3 col-sm-3">
                    <select
                      className="selectpicker form-control"
                      multiple=""
                      title="All Categories"
                    >
                      <option>Information Technology</option>
                      <option>Mechanical</option>
                      <option>Hardware</option>
                    </select>
                  </div>
                  <div className="col-md-2 col-sm-2">
                    <button type="submit" className="btn btn-primary">
                      Filter
                    </button>
                  </div>
                </form>
              </div>
            </div>
            {/* Company Searrch Filter End */}

            <div className="item-click">
              <article>
                {jobs.map((job) => (
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
                              marginLeft: '15px',
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
                    <div className="col-md-2 col-sm-2">
                      <div className="brows-job-link">
                        {job.status === 0 ? (
                          <span style={badgeStyle('#ffc107')}>Pending</span>
                        ) : job.status === 2 ? (
                          <span style={badgeStyle('#dc3545')}>Rejected</span>
                        ) : job.status === -1 ? (
                          <button
                            className="btn"
                            style={sendDraftStyle}
                            onMouseOver={(e) => {
                              e.target.style.backgroundColor = '#07b107';
                              e.target.style.color = '#fff';
                            }}
                            onMouseOut={(e) => {
                              e.target.style.backgroundColor = '#f8f9fa';
                              e.target.style.color = '#000';
                            }}
                            onClick={() => handlePreSendDraft(job.jobId)}
                          >
                            Send Draft
                          </button>
                        ) : (
                          <div
                            onClick={() =>
                              handleToggleStatus(job.jobId, job.status)
                            }
                            title="Click to toggle visibility"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              cursor: 'pointer',
                              gap: '10px',
                            }}
                          >
                            <div
                              style={{
                                width: '50px',
                                height: '24px',
                                borderRadius: '12px',
                                backgroundColor:
                                  job.status === 1 ? '#07b107' : '#6c757d',
                                position: 'relative',
                                transition: 'background-color 0.3s ease',
                              }}
                            >
                              <div
                                style={{
                                  width: '20px',
                                  height: '20px',
                                  borderRadius: '50%',
                                  backgroundColor: '#fff',
                                  position: 'absolute',
                                  top: '2px',
                                  left: job.status === 1 ? '26px' : '2px',
                                  transition: 'left 0.3s ease',
                                }}
                              />
                            </div>
                            <span
                              style={{
                                fontWeight: 'bold',
                                color: job.status === 1 ? '#07b107' : '#6c757d',
                              }}
                            >
                              {job.status === 1 ? 'Accepted' : 'Hidden'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </article>
            </div>

            {/*/.row*/}
            <ul className="pagination">
              <li>
                <a
                  href="#"
                  onClick={() => page > 1 && setPage(page - 1)}
                  className={page === 1 ? 'disabled' : ''}
                >
                  «
                </a>
              </li>

              {[...Array(totalPage)].map((_, index) => {
                const current = index + 1;
                return (
                  <li
                    key={current}
                    className={page === current ? 'active' : ''}
                  >
                    <a href="#" onClick={() => setPage(current)}>
                      {current}
                    </a>
                  </li>
                );
              })}

              <li>
                <a
                  href="#"
                  onClick={() => page < totalPage && setPage(page + 1)}
                  className={page === totalPage ? 'disabled' : ''}
                >
                  »
                </a>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </>
  );
}
