import React, { useEffect, useState } from 'react';
import './JobInterviewList.css';
import { getInterviewScheduleList } from '../../../service/business/interviews/InterviewService';
import { useNavigate, useParams } from 'react-router-dom';
import { getCvByCvIdAndStudentId } from '../../../service/business/apply-jobs/ApplyJobsService';

const getStatusStyle = (status) => {
  switch (status) {
    case 'scheduled':
      return { color: '#007bff' };
    case 'completed':
      return { color: '#28a745' };
    case 'cancelled':
      return { color: '#dc3545' };
    default:
      return { color: '#6c757d' };
  }
};

export default function JobInterviewList() {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const [interviewList, setInterviewList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [limit] = useState(10);
  const [cvData, setCvData] = useState(null);

  useEffect(() => {
    const offset = (page - 1) * limit;

    fetchInterviewSchedules(offset, jobId);
  }, [page]);

  const fetchInterviewSchedules = async (offset: number, jobId: string) => {
    try {
      const response = await getInterviewScheduleList(offset, limit, jobId);
      console.log('Interview schedules:', response);
      setInterviewList(response.data);
      setTotalPage(response.totalPages);
    } catch (error) {
      console.error('Error fetching interview schedules:', error);
    }
  };

  const viewCV = async (cvId: string, studentId: string) => {
    try {
      const response = await getCvByCvIdAndStudentId(cvId, studentId);
      console.log('CV data:', response);
      setCvData(response.data);
    } catch (error) {
      console.error('Error fetching CV data:', error);
    }
  };

  console.log('interviewList', interviewList);
  console.log('page', totalPage);
  console.log('cvData', cvData);

  return (
    <>
      {/* Title Header Start */}
      <section
        className="inner-header-title"
        style={{ backgroundImage: 'url(/assets/img/banner-10.jpg)' }}
      >
        <div className="container">
          <h1>Browse Resume</h1>
        </div>
      </section>
      <div className="clearfix" />
      {/* Title Header End */}

      {/* Browse Resume List Start */}
      <section className="manage-company">
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
                  <button type="submit" className="btn btn-success full-width">
                    Filter
                  </button>
                </div>
              </form>
            </div>
          </div>
          {/* Company Searrch Filter End */}

          {interviewList.map((interview) => (
            <a key={interview.interviewId} className="item-click">
              <article>
                <div
                  className="brows-resume"
                  onClick={() =>
                    navigate(`/business/detail-apply-job/${interview.applyId}`)
                  }
                >
                  <div className="row no-mrg align-items-center">
                    <div className="col-md-2 col-sm-2">
                      <div className="brows-resume-pic">
                        <img
                          src={
                            interview.studentAvatarUrl ||
                            '/assets/img/default-avatar.png'
                          }
                          className="img-responsive"
                          alt={interview.studentName}
                        />
                      </div>
                    </div>
                    <div className="col-md-3 col-sm-4">
                      <div className="brows-resume-name">
                        <h4>{interview.studentName}</h4>
                        <span className="brows-resume-designation">
                          {interview.studentUniversity}
                        </span>
                      </div>
                    </div>
                    <div className="col-md-3 col-sm-4">
                      <div className="brows-resume-location">
                        <p>
                          <i className="fa fa-briefcase"></i>{' '}
                          {interview.jobTitle}
                        </p>
                      </div>
                    </div>
                    <div className="col-md-2 col-sm-4">
                      <div className="brows-resume-location">
                        <p>
                          <i className="fa-solid fa-calendar" />{' '}
                          {new Date(interview.scheduledAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="col-md-2 col-sm-4">
                      <div className="browse-resume-rate">
                        <span style={getStatusStyle(interview.interviewStatus)}>
                          <i className="fa fa-money" />{' '}
                          {interview.interviewStatus}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="row extra-mrg row-skill">
                    <div className="browse-resume-skills">
                      <div className="col-md-3 col-sm-4">
                        <div className="browse-resume-exp">
                          <button
                            className="resume-exp"
                            onClick={() =>
                              viewCV(interview.cvId, interview.studentId)
                            }
                          >
                            View CV
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </a>
          ))}

          <div className="row">
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
        </div>
      </section>
      {/* Browse Resume List End */}
    </>
  );
}
