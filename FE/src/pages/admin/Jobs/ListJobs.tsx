import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '../../../app/hook';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import {
  fetchJobPostingsByStatus,
  acceptJobPosting,
  rejectJobPosting,
  JobPostingsResponseDTO,
} from '../../../features/admin/jobListSlice';
import Modal from '../../Modal';
import './listjob.css';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

export default function ListJobs() {
  const dispatch = useAppDispatch();
  const { jobsByStatus, pagination, loading } = useSelector(
    (state: RootState) => state.job,
  );
  const MySwal = withReactContent(Swal);
  const [keyword, setKeyword] = useState('');

  const [status, setStatus] = useState<number>(0);
  const [page, setPage] = useState(0);
  const [selectedJob, setSelectedJob] = useState<JobPostingsResponseDTO | null>(
    null,
  );
  const pageSize = 10;
  const totalPages = pagination?.totalPages || 1;

  useEffect(() => {
    dispatch(
      fetchJobPostingsByStatus({
        status,
        offset: page * pageSize,
        limit: pageSize,
        keyword: keyword.trim() !== '' ? keyword.trim() : undefined,
      }),
    );
  }, [dispatch, status, page, keyword]);

  return (
    <div className="flex flex-col w-full">
      {/* Banner */}
      <div className="w-full bg-gray-100 flex justify-center py-6">
        <section
          className="inner-header-title rounded-xl overflow-hidden shadow-lg w-full max-w-6xl bg-cover bg-center"
          style={{
            backgroundImage: 'url(/assets/img/banner-10.jpg)',
            height: '350px',
          }}
        >
          <div className="w-full h-full flex flex-col justify-center items-center backdrop-brightness-50 text-white px-6">
            <h1 className="text-5xl font-extrabold">Manage Job Postings</h1>
          </div>
        </section>
      </div>

      {/* Main content */}
      <div className="white-shadow px-12 py-8">
        {/* Filter */}
        {/* Search + Filter */}
        <div className="search-container my-6 flex justify-center">
          <div className="search-box flex gap-3 w-full max-w-2xl p-4 rounded border border-gray-300 bg-gray-50 shadow">
            <input
              type="text"
              placeholder="Search by company name..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setPage(0);
                }
              }}
              className="flex-1 px-3 py-2 rounded border border-gray-300 focus:outline-none"
            />

            <select
              value={status}
              onChange={(e) => {
                setStatus(Number(e.target.value));
                setPage(0);
              }}
              className="px-3 py-2 rounded border border-gray-300 bg-white"
            >
              <option value={-1}>Draft</option>
              <option value={0}>Pending</option>
              <option value={1}>Approved</option>
              <option value={2}>Rejected</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto relative">
          {loading && (
            <div className="spinner-overlay">
              <div className="spinner" />
            </div>
          )}
          <table className="min-w-full border border-gray-200 text-left stylish-table">
            <thead className="table-header">
              <tr>
                <th className="border px-4 py-3">Avatar</th>
                <th className="border px-4 py-3">Title</th>
                <th className="border px-4 py-3">Company</th>
                <th className="border px-4 py-3">Location</th>
                <th className="border px-4 py-3">Status</th>
                <th className="border px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(jobsByStatus) && jobsByStatus.length > 0 ? (
                jobsByStatus.map((job) => (
                  <tr
                    key={job.jobId}
                    onClick={() => setSelectedJob(job)}
                    className="hover:bg-indigo-50 transition-colors duration-200 cursor-pointer"
                  >
                    <td className="px-4 py-3 text-center align-middle">
                      {' '}
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden',
                          borderRadius: '50%',
                          backgroundColor: '#f3f4f6',
                        }}
                      >
                        {job.avatarUrl ? (
                          <img
                            src={job.avatarUrl}
                            alt="avatar"
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                        ) : (
                          <i className="fas fa-building text-gray-400 text-md" />
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3 text-sm">{job.title}</td>
                    <td className="px-4 py-3 text-sm">{job.companyName}</td>
                    <td className="px-4 py-3 text-sm">{job.location}</td>
                    <td className="px-4 py-3 text-sm">{job.status}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-3">
                        <button
                          className="action-button approve-button"
                          title="Approve"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (job.jobId) {
                              dispatch(acceptJobPosting(job.jobId)).then(() => {
                                dispatch(
                                  fetchJobPostingsByStatus({
                                    status,
                                    offset: page * pageSize,
                                    limit: pageSize,
                                  }),
                                );
                              });
                            }
                          }}
                        >
                          <i className="fas fa-check" />
                        </button>

                        <button
                          className="action-button reject-button"
                          title="Reject"
                          onClick={(e) => {
                            e.stopPropagation();
                            MySwal.fire({
                              title: 'Reject Job Posting',
                              input: 'textarea',
                              inputLabel: 'Reason for rejection',
                              inputPlaceholder: 'Enter your reason here...',
                              inputAttributes: {
                                'aria-label': 'Reason',
                              },
                              customClass: {
                                input: 'swal-input-textarea',
                                popup: 'swal-wide-popup',
                              },
                              showCancelButton: true,
                              confirmButtonText: 'Reject',
                              confirmButtonColor: '#d33',
                            }).then((result) => {
                              if (result.isConfirmed && result.value?.trim()) {
                                dispatch(
                                  rejectJobPosting({
                                    jobId: job.jobId,
                                    reasonReject: result.value.trim(),
                                  }),
                                ).then(() => {
                                  dispatch(
                                    fetchJobPostingsByStatus({
                                      status,
                                      offset: page * pageSize,
                                      limit: pageSize,
                                    }),
                                  );
                                  Swal.fire(
                                    'Rejected!',
                                    'Job posting has been rejected.',
                                    'success',
                                  );
                                });
                              } else if (result.isConfirmed) {
                                Swal.fire(
                                  'Error',
                                  'Reason is required!',
                                  'error',
                                );
                              }
                            });
                          }}
                        >
                          <i className="fas fa-times" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-500">
                    No job postings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="pagination-container mt-6 flex justify-center items-center gap-2">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
              disabled={page === 0}
              className="pagination-button"
            >
              Prev
            </button>
            {[...Array(totalPages)].map((_, i) => {
              if (i === 0 || i === totalPages - 1 || Math.abs(i - page) <= 1) {
                return (
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    className={`pagination-number ${
                      i === page ? 'pagination-active' : ''
                    }`}
                  >
                    {i + 1}
                  </button>
                );
              } else if (
                (i === page - 2 && i > 1) ||
                (i === page + 2 && i < totalPages - 2)
              ) {
                return (
                  <span key={i} className="px-2 text-gray-500">
                    ...
                  </span>
                );
              }
              return null;
            })}
            <button
              onClick={() =>
                setPage((prev) => Math.min(prev + 1, totalPages - 1))
              }
              disabled={page >= totalPages - 1}
              className="pagination-button"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modal detail */}
      <Modal
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
        title="Job Detail"
        width="800px"
      >
        {selectedJob && (
          <div className="modal-job-content">
            {/* Header với avatar và tiêu đề */}
            <div className="modal-job-header">
              <div className="modal-job-avatar-wrapper">
                <img
                  src={selectedJob.avatarUrl}
                  alt="Company Avatar"
                  className="modal-job-avatar"
                />
              </div>
              <h2 className="modal-job-title">{selectedJob.title}</h2>
              <span
                className={`modal-job-status-badge ${
                  selectedJob.status === 1
                    ? 'status-active'
                    : selectedJob.status === 2
                    ? 'status-closed'
                    : 'status-pending'
                }`}
              >
                {selectedJob.status === -1
                  ? 'Draft'
                  : selectedJob.status === 0
                  ? 'Pending'
                  : selectedJob.status === 1
                  ? 'Approved'
                  : selectedJob.status === 2
                  ? 'Rejected'
                  : 'Unknown'}
              </span>
            </div>

            {/* Thông tin chính */}
            <div className="modal-job-details">
              <div className="modal-job-detail-item">
                <span className="modal-job-label">
                  <i className="fas fa-building"></i> Company:
                </span>
                <span>{selectedJob.companyName}</span>
              </div>
              <div className="modal-job-detail-item">
                <span className="modal-job-label">
                  <i className="fas fa-map-marker-alt"></i> Location:
                </span>
                <span>{selectedJob.location}</span>
              </div>
              <div className="modal-job-detail-item">
                <span className="modal-job-label">
                  <i className="fas fa-money-bill-wave"></i> Salary:
                </span>
                <span>{selectedJob.salary}</span>
              </div>
            </div>

            {/* Mô tả */}
            <div className="modal-job-description">
              <h3 className="modal-job-description-title">Description</h3>
              <p>{selectedJob.description}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
  /* withReactContent is now imported from 'sweetalert2-react-content' */
}
