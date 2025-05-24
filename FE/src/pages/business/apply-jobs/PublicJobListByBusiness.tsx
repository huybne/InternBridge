import React, { useEffect, useState } from 'react';
import '../job-postings/ListJobPosting.css';
import { getPublicJobListByBusinessId } from '../../../service/business/jobpostings/JobPostingsService';
import { useNavigate } from 'react-router-dom';

const viewStyle = {
  backgroundColor: '#f8f9fa',
  color: '#000',
  border: '1px solid #ccc',
  padding: '10px 15px',
  borderRadius: '4px',
  transition: 'background-color 0.3s ease, color 0.3s ease',
  cursor: 'pointer',
  flex: 1,
};

export default function PublicJobListByBusiness() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);

  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [limit] = useState(10);

  useEffect(() => {
    const offset = (page - 1) * limit;

    fetchPublicJob(offset);
  }, [page]);

  const fetchPublicJob = async (offset: number) => {
    try {
      const response = await getPublicJobListByBusinessId(offset, limit);
      console.log('Response:', response.data);
      setJobs(response.data.data);
      setTotalPage(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw new Error(
        (error as any).response?.data?.message || 'Something went wrong',
      );
    }
  };

  console.log('Jobs:', jobs);
  console.log('Total Page:', totalPage);

  return (
    <>
      <div className="clearfix" />
      {/* Title Header Start */}
      <section
        className="inner-header-title"
        style={{ backgroundImage: 'url(/assets/img/banner-10.jpg)' }}
      >
        <div className="container">
          <h1>All Public Jobs</h1>
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
                      <>
                        <button
                          className="btn"
                          style={viewStyle}
                          onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = '#07b107';
                            e.currentTarget.style.color = '#fff';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = '#f8f9fa';
                            e.currentTarget.style.color = '#000';
                          }}
                          onClick={() =>
                            navigate(`/business/list-apply-jobs/${job.jobId}`)
                          }
                        >
                          Apply List
                        </button>
                        <button
                          className="btn"
                          style={{
                            backgroundColor: '#2c2f33',
                            color: '#ffffff',
                            border: '2px solid #444',
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
                          onClick={() =>
                            navigate(`/business/job-interview-list`)
                          }
                        >
                          <i
                            className="fa-solid fa-calendar"
                            style={{ color: '#fff' }}
                          />
                        </button>
                      </>
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
                <li key={current} className={page === current ? 'active' : ''}>
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
    </>
  );
}
