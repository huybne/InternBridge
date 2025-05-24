import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { viewListApplyJob } from '../../../service/business/apply-jobs/ApplyJobsService';

const statusColors: Record<string, string> = {
  pending: '#FFC107', // Vàng
  viewed: '#17A2B8', // Xanh dương nhạt
  accepted: '#4CAF50', // Xanh lá
  rejected: '#F44336', // Đỏ
};

export default function ListApplyJobs() {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const [applyJobs, setApplyJobs] = useState<any[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);

  useEffect(() => {
    fetchJobs();
  }, [jobId]);

  const fetchJobs = async () => {
    try {
      const res = await viewListApplyJob(jobId, cursor);
      console.log(res, 'res');

      setApplyJobs((prev) => [...prev, ...res.listApplyJob]);
      setCursor(res.nextCursor);
      setHasMore(res.nextCursor !== null);
    } catch (err) {
      console.error('Failed to fetch jobs', err);
    }
  };

  return (
    <>
      <>
        <div className="clearfix" />
        {/* Title Header Start */}
        <section
          className="inner-header-title"
          style={{ backgroundImage: 'url(/assets/img/banner-10.jpg)' }}
        >
          <div className="container">
            <h1>Manage Apply Of Student</h1>
          </div>
        </section>
        <div className="clearfix" />

        <section className="member-card gray">
          <div className="container">
            {/* search filter */}
            <div className="row">
              <div className="col-md-12 col-sm-12">
                <div className="search-filter">
                  <div className="col-md-4 col-sm-5"></div>
                  <div className="col-md-8 col-sm-7">
                    <div className="short-by pull-right">
                      Short By
                      <div className="dropdown">
                        <a
                          href="#"
                          className="dropdown-toggle"
                          data-toggle="dropdown"
                        >
                          Dropdown{' '}
                          <i className="fa fa-angle-down" aria-hidden="true" />
                        </a>
                        <ul className="dropdown-menu">
                          <li>
                            <a href="#">Short By Date</a>
                          </li>
                          <li>
                            <a href="#">Short By Views</a>
                          </li>
                          <li>
                            <a href="#">Short By Popular</a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* search filter End */}
            <div className="row">
              {/* <div className="col-md-4 col-sm-4">
                <div className="manage-cndt">
                  <div className="cndt-status pending">Pending</div>
                  <div className="cndt-caption">
                    <div className="cndt-pic">
                      <img
                        src="/assets/img/client-1.jpg"
                        className="img-responsive"
                        alt=""
                      />
                    </div>
                    <h4>Charles Hopman</h4>
                    <span>Web designer</span>
                    <p>
                      Our analysis team at Megriosft use end to end innovation
                      proces
                    </p>
                  </div>
                  <a href="#" title="" className="cndt-profile-btn">
                    View Detail Apply
                  </a>
                </div>
              </div>
              <div className="col-md-4 col-sm-4">
                <div className="manage-cndt">
                  <div className="cndt-status available">Accepted</div>
                  <div className="cndt-caption">
                    <div className="cndt-pic">
                      <img
                        src="/assets/img/client-2.jpg"
                        className="img-responsive"
                        alt=""
                      />
                    </div>
                    <h4>Ethan Marion</h4>
                    <span>IOS designer</span>
                    <p>
                      Our analysis team at Megriosft use end to end innovation
                      proces
                    </p>
                  </div>
                  <a href="#" title="" className="cndt-profile-btn">
                    View Detail Apply
                  </a>
                </div>
              </div>
              <div className="col-md-4 col-sm-4">
                <div className="manage-cndt">
                  <div
                    className="cndt-status pending"
                    style={{ backgroundColor: 'red', color: 'white' }}
                  >
                    Rejected
                  </div>
                  <div className="cndt-caption">
                    <div className="cndt-pic">
                      <img
                        src="/assets/img/client-3.jpg"
                        className="img-responsive"
                        alt=""
                      />
                    </div>
                    <h4>Zara Clow</h4>
                    <span>UI/UX designer</span>
                    <p>
                      Our analysis team at Megriosft use end to end innovation
                      proces
                    </p>
                  </div>
                  <a href="#" title="" className="cndt-profile-btn">
                    View Detail Apply
                  </a>
                </div>
              </div> */}

              {applyJobs.length === 0 ? (
                <div
                  className="no-data-message"
                  style={{
                    textAlign: 'center',
                    padding: '40px 20px',
                    backgroundColor: '#f8fff8',
                    border: '2px dashed #4CAF50',
                    borderRadius: '12px',
                    color: '#4CAF50',
                    fontSize: '18px',
                    fontWeight: '500',
                  }}
                >
                  <i
                    className="fas fa-leaf"
                    style={{ fontSize: '24px', marginBottom: '10px' }}
                  ></i>
                  <p>There is no application data.</p>
                </div>
              ) : (
                applyJobs.map((job, idx) => {
                  const backgroundColor = statusColors[job.status] || '#9E9E9E';

                  return (
                    <div key={job.applyId || idx} className="col-md-4 col-sm-4">
                      <div className="manage-cndt">
                        <div
                          className="cndt-status"
                          style={{
                            backgroundColor,
                            color: '#fff',
                            padding: '6px 12px',
                            display: 'inline-block',
                            fontWeight: 'bold',
                            fontSize: '14px',
                            marginBottom: '10px',
                          }}
                        >
                          {job.status.charAt(0).toUpperCase() +
                            job.status.slice(1)}
                        </div>

                        <div className="cndt-caption">
                          <div className="cndt-pic">
                            <img
                              src={
                                job.studentAvatarUrl ||
                                '/assets/img/client-1.jpg'
                              }
                              className="img-responsive"
                              alt={job.studentName}
                            />
                          </div>
                          <h4>{job.studentName}</h4>
                          <span>{job.studentUniversity}</span>
                          <p>
                            Applied At:{' '}
                            {(() => {
                              const d = new Date(job.appliedAt);
                              const day = String(d.getDate()).padStart(2, '0');
                              const month = String(d.getMonth() + 1).padStart(
                                2,
                                '0',
                              );
                              const year = d.getFullYear();
                              return `${day}-${month}-${year}`;
                            })()}
                          </p>
                        </div>

                        <a
                          onClick={() =>
                            navigate(
                              `/business/detail-apply-job/${job.applyId}`,
                            )
                          }
                          title=""
                          className="cndt-profile-btn"
                        >
                          View Detail Apply
                        </a>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            {hasMore && (
              <div className="row mt-3">
                <div className="col-12 text-center">
                  <button className="btn btn-primary" onClick={fetchJobs}>
                    Load More
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </>
    </>
  );
}
