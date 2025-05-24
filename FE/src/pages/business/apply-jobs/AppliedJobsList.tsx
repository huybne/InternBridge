import { useEffect, useState } from 'react';
import './AppliedJobsList.css';
import {
  ApplyJobDTO,
  getMyApplyJobs,
} from '../../../services/user/Job/JobService';
import { useNavigate } from 'react-router-dom';
import { getDetailJob } from '../../../service/business/jobpostings/JobPostingsService';
import JobApplicationForm from './JobApplicationForm';

const AppliedJobsList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState<ApplyJobDTO[]>([]);
  const [status, setStatus] = useState<string>('');
  const [cursor, setCursor] = useState<string | undefined>();
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [selectedJobForReapply, setSelectedJobForReapply] =
    useState<ApplyJobDTO | null>(null);

  const navigate = useNavigate();

  const handleViewJobDetail = async (jobId: string) => {
    try {
      const data = await getDetailJob(jobId);
      navigate(`/detail-job/${jobId}`);
    } catch (error) {
      console.error('Cannot view job details', error);
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await getMyApplyJobs(status, cursor, 10);
      const newJobs = response.data.myApplyJobs;
      setAppliedJobs((prev) => [...prev, ...newJobs]);
      setCursor(response.data.nextCursor || undefined);
      if (newJobs.length < 10) setHasMore(false);
    } catch (error) {
      console.error('Failed to fetch applied jobs', error);
    }
  };

  useEffect(() => {
    setAppliedJobs([]);
    setCursor(undefined);
    setHasMore(true);
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const handleApplyAgain = (e: React.MouseEvent, job: ApplyJobDTO) => {
    e.stopPropagation();
    setSelectedJobForReapply(job);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedJobForReapply(null);
  };

  const handleSuccessfulReapply = (jobId: string) => {
    // Update the status of the job in the list
    setAppliedJobs((prev) =>
      prev.map((item) =>
        item.jobId === jobId ? { ...item, applyStatus: 'pending' } : item,
      ),
    );
    setShowModal(false);
    setSelectedJobForReapply(null);
  };

  return (
    <>
      <section
        className="inner-header-title"
        style={{ backgroundImage: 'url(/assets/img/banner-10.jpg)' }}
      >
        <div className="container">
          <h1>Job Details</h1>
        </div>
      </section>

      <div className="applied-jobs-container">
        <div className="applied-jobs-content">
          <div className="applied-jobs-main">
            <div className="applied-jobs-header">
              <h1 className="title">Jobs applied for</h1>
              <div className="status-dropdown">
                <select
                  className="status-dropdown-select"
                  style={{
                    width: '130px',
                    height: '40px',
                    borderRadius: '5px',
                  }}
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="">All</option>
                  <option value="pending">Waiting for approval</option>
                  <option value="viewed">Viewed</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Reject</option>
                </select>
              </div>
            </div>

            <div className="jobs-list">
              {appliedJobs.map((job) => (
                <div
                  className="job-item"
                  key={job.applyId}
                  onClick={() => handleViewJobDetail(job.jobId)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="company-logo">
                    <img
                      src={job.studentAvatarUrl || '/assets/img/banner-10.jpg'}
                      alt={job.companyName}
                    />
                  </div>
                  <div className="job-details">
                    <div className="job-header">
                      <h2 className="job-title">{job.jobTitle}</h2>
                      <span className={`job-status ${job.applyStatus}`}>
                        {job.applyStatus}
                      </span>
                    </div>
                    <div className="company-name">{job.companyName}</div>
                    <div className="application-info">
                      <div className="timestamp">
                        Application period: {job.applyDate}
                      </div>
                      <div className="cv-info">
                        <span>Applied CV: </span>
                        <span>{job.cvId}</span>
                      </div>
                      {job.applyStatus === 'pending' && (
                        <button
                          style={{
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            textAlign: 'center',
                            textDecoration: 'none',
                            display: 'inline-block',
                            fontSize: '16px',
                            marginTop: '10px',
                            cursor: 'pointer',
                            width: '30%',
                            marginLeft: 'auto',
                          }}
                          onClick={(e) => handleApplyAgain(e, job)}
                        >
                          Apply Again
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {hasMore && (
              <div className="pagination">
                <button className="pagination-next" onClick={fetchJobs}>
                  <i className="fas fa-chevron-down"></i> Load more
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showModal && selectedJobForReapply && (
        <JobApplicationForm
          onClose={handleCloseModal}
          jobId={selectedJobForReapply.jobId}
          previousCvId={selectedJobForReapply.cvId}
          applyId={selectedJobForReapply.applyId}
          onSuccess={() => handleSuccessfulReapply(selectedJobForReapply.jobId)}
        />
      )}
    </>
  );
};

export default AppliedJobsList;
