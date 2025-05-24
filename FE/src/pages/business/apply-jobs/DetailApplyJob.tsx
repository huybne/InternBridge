import React, { useEffect, useState } from 'react';
import ScheduleInterviewModal from './ScheduleInterviewModal';
import { useParams } from 'react-router-dom';
import {
  acceptApplyJob,
  getCvByCvIdAndStudentId,
  rejectApplyJob,
  viewDetailApplyJob,
} from '../../../service/business/apply-jobs/ApplyJobsService';
import Loading from '../../../common/Loading';
import Swal from 'sweetalert2';
import { setupInterviewSchedule } from '../../../service/business/interviews/InterviewService';

export default function DetailApplyJob() {
  const { applyId } = useParams();
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [detailApplyJob, setDetailApplyJob] = useState(null);
  const [cvData, setCvData] = useState(null);

  const handleConfirmSchedule = async (schedule) => {
    const scheduledAt = `${schedule.date}T${schedule.time}`;
    const interviewScheduleDTO = {
      applyId: applyId,
      scheduledAt,
    };

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to set this interview schedule?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#22c55e',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, confirm it!',
    });

    if (result.isConfirmed) {
      try {
        await setupInterviewSchedule(interviewScheduleDTO);
        await acceptApplyJob(applyId);

        Swal.fire({
          title: 'Success!',
          text: 'Interview schedule has been set.',
          icon: 'success',
          timer: 3000,
          showConfirmButton: false,
          willClose: () => {
            // navigate('/your-target-path');
            window.location.reload();
          },
        });
        setShowScheduleModal(false);
      } catch (error) {
        Swal.fire('Error', error.message || 'Something went wrong!', 'error');
      }
    }
    setShowScheduleModal(false);
  };

  const handleReject = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to reject this application?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, reject it!',
    });

    if (result.isConfirmed) {
      try {
        const res = await rejectApplyJob(applyId);
        console.log(res.status, 'Rejected');

        Swal.fire({
          icon: 'success',
          title: 'Rejected!',
          text: 'The application has been rejected. Reloading in 3 seconds...',
          timer: 3000,
          showConfirmButton: false,
          willClose: () => {
            window.location.reload();
          },
        });
      } catch (error) {
        Swal.fire('Error!', 'Something went wrong.', 'error');
      }
    }
  };

  useEffect(() => {
    const fetchDetailApplyJob = async () => {
      try {
        const response = await viewDetailApplyJob(applyId);
        setDetailApplyJob(response);

        const cvResponse = await getCvByCvIdAndStudentId(
          response.cvId,
          response.studentId,
        );
        setCvData(cvResponse.cvDetail);
      } catch (error) {
        console.error('Error fetching detail apply job:', error);
        throw new Error(
          error.response?.data?.message || 'Something went wrong',
        );
      }
    };
    fetchDetailApplyJob();
  }, [applyId]);

  if (!detailApplyJob) {
    return <Loading />;
  }
  return (
    <>
      <div className="clearfix" />
      {/* Title Header Start */}
      <section
        className="inner-header-title"
        style={{ backgroundImage: 'url(/assets/img/banner-10.jpg)' }}
      >
        <div className="container">
          <h1>Resume Detail</h1>
        </div>
      </section>
      <div className="clearfix" />

      <section className="detail-desc">
        <div className="container white-shadow">
          <div className="row mrg-0">
            <div className="detail-pic">
              <img
                src={detailApplyJob.studentAvatarUrl}
                className="img"
                alt=""
              />
            </div>
            <div className="detail-status">
              {['pending', 'viewed'].includes(detailApplyJob.status) && (
                <span style={{ color: '#FFA500', fontWeight: 'semibold' }}>
                  Pending
                </span>
              )}
              {detailApplyJob.status === 'accepted' && (
                <span style={{ color: '#4CAF50', fontWeight: 'semibold' }}>
                  Accepted
                </span>
              )}
              {detailApplyJob.status === 'rejected' && (
                <span style={{ color: 'red', fontWeight: 'semibold' }}>
                  Rejected
                </span>
              )}
            </div>
          </div>
          <div className="row bottom-mrg mrg-0">
            <div
              className="detail-desc-caption"
              style={{
                alignItems: 'center',
                flexDirection: 'column',
                justifyContent: 'center',
                textAlign: 'center',
              }}
            >
              <h4>{detailApplyJob.studentName}</h4>
              <span className="designation">
                <div>{detailApplyJob.studentUniversity}</div>
                <div>
                  Applied on:{' '}
                  {new Date(detailApplyJob.appliedAt).toLocaleDateString(
                    'en-GB',
                  )}
                </div>
              </span>
            </div>
          </div>
          <div className="row no-padd mrg-0">
            <div className="detail pannel-footer">
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: '20px',
                }}
              >
                <div
                  className="detail-pannel-footer-btn"
                  style={{
                    display: 'flex',
                    gap: '20px',
                    justifyContent:
                      detailApplyJob.status === 'pending' ||
                      detailApplyJob.status === 'viewed'
                        ? 'center'
                        : 'center',
                  }}
                >
                  {(detailApplyJob.status === 'pending' ||
                    detailApplyJob.status === 'viewed') && (
                    <>
                      {/* Accept */}
                      <button
                        style={{
                          padding: '10px 20px',
                          backgroundColor: '#22c55e',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '16px',
                          cursor: 'pointer',
                          transition: 'background-color 0.3s',
                        }}
                        onMouseOver={(e) =>
                          (e.target.style.backgroundColor = '#388E3C')
                        }
                        onMouseOut={(e) =>
                          (e.target.style.backgroundColor = '#22c55e')
                        }
                        onClick={() => setShowScheduleModal(true)}
                      >
                        Accept
                      </button>

                      {/* Reject */}
                      <button
                        style={{
                          padding: '10px 20px',
                          backgroundColor: '#F44336',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '16px',
                          cursor: 'pointer',
                          transition: 'background-color 0.3s',
                        }}
                        onMouseOver={(e) =>
                          (e.target.style.backgroundColor = '#D32F2F')
                        }
                        onMouseOut={(e) =>
                          (e.target.style.backgroundColor = '#F44336')
                        }
                        onClick={handleReject}
                      >
                        Reject
                      </button>
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
          <div className="row row-bottom mrg-0">
            <h2 className="detail-title">About Resume</h2>
          </div>
          <div
            className="row"
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              display: 'flex',
            }}
          >
            <img
              src={cvData}
              alt="CV"
              style={{
                width: '70%',
                maxWidth: '100%',
                height: 'auto',
                borderRadius: '10px',
                marginTop: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              }}
            />
          </div>
        </div>
      </section>

      {showScheduleModal && (
        <ScheduleInterviewModal
          onClose={() => setShowScheduleModal(false)}
          onConfirm={handleConfirmSchedule}
          applyId={applyId}
        />
      )}
    </>
  );
}
