import { useEffect, useState } from 'react';
import './JobApplicationForm.css';
import { RootState } from '../../../app/store';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../../app/hook';
import { fetchCvByUserId } from '../../../services/user/ManageCv/ManageCv';
import Swal from 'sweetalert2';
import { sendApplyJob } from '../../../features/applyjobs/applyJobsSlice';
import { updateCvId } from '../../../service/business/apply-jobs/ApplyJobsService';

interface JobApplicationFormProps {
  onClose: () => void;
  jobId: string;
  previousCvId?: string;
  onSuccess?: () => void;
  applyId?: string; // Thêm applyId để sử dụng trong updateCvId
}

const JobApplicationForm = ({
  onClose,
  jobId,
  previousCvId,
  onSuccess,
  applyId,
}: JobApplicationFormProps) => {
  const dispatch = useAppDispatch();
  const [selectedCVOption, setSelectedCVOption] = useState('existing');
  const [selectedCV, setSelectedCV] = useState<any>(null);
  const [attemptedFetch, setAttemptedFetch] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);

  const cvList = useSelector((state: RootState) => state.cv.cvs);
  const userId = useSelector((state: RootState) => state.auth.user?.id);

  useEffect(() => {
    if (cvList.length === 0 && !attemptedFetch) {
      dispatch(fetchCvByUserId());
      setAttemptedFetch(true);
    }
  }, [cvList, attemptedFetch, dispatch]);

  // Set the previously selected CV when the CV list loads
  useEffect(() => {
    if (previousCvId && cvList.length > 0) {
      const previousCV = cvList.find((cv) => cv.cvId === previousCvId);
      if (previousCV) {
        setSelectedCV(previousCV);
      }
    }
  }, [previousCvId, cvList]);

  // Determine if submit button should be enabled (only if a different CV is selected)
  useEffect(() => {
    if (selectedCV && previousCvId) {
      setCanSubmit(selectedCV.cvId !== previousCvId);
    } else if (selectedCV) {
      setCanSubmit(true);
    } else {
      setCanSubmit(false);
    }
  }, [selectedCV, previousCvId]);

  const handleCVOptionChange = (option) => {
    setSelectedCVOption(option);
  };

  const handleSubmit = async () => {
    if (!selectedCV) {
      Swal.fire('Error', 'Please select a CV to apply.', 'error');
      return;
    }

    if (previousCvId && selectedCV.cvId === previousCvId) {
      Swal.fire(
        'Error',
        'Please select a different CV to apply again.',
        'error',
      );
      return;
    }

    try {
      if (previousCvId && applyId) {
        await updateCvId(applyId, selectedCV.cvId);

        Swal.fire({
          title: 'Success',
          text: 'You have successfully updated your application with a new CV!',
          icon: 'success',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        }).then(() => {
          window.location.reload();
        });
      } else {
        await dispatch(
          sendApplyJob({
            jobId,
            cvId: selectedCV.cvId,
          }),
        ).unwrap();

        Swal.fire({
          title: 'Success',
          text: 'You have successfully applied to this job!',
          icon: 'success',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        }).then(() => {
          window.location.reload();
        });
      }

      if (onSuccess) {
        onSuccess();
      } else {
        onClose();
      }
    } catch (error) {
      Swal.fire('Error', error || 'Failed to apply for the job.', 'error');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="job-application-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="application-header sticky-header">
          <h1>
            <span className="text-normal">Apply </span>
            <span className="text-green">Internship Job</span>
          </h1>
          <button className="close-button" onClick={onClose}>
            <span>&times;</span>
          </button>
        </div>

        <div className="application-body-scrollable">
          <div className="section">
            <div className="section-header">
              <div className="icon-circle">
                <i className="fas fa-check"></i>
              </div>
              <span>Select CV to apply</span>
            </div>

            {previousCvId && (
              <div className="previously-applied-cv">
                <p className="info-message">
                  <i className="fas fa-info-circle"></i>
                  You previously applied to this job with CV ID: {previousCvId}.
                  To apply again, please select a different CV.
                </p>
              </div>
            )}

            <div className="cv-option-box active-option">
              <div className="option-row">
                <div className="radio-container">
                  <div
                    className={`radio-button ${
                      selectedCVOption === 'existing' ? 'selected' : ''
                    }`}
                    onClick={() => handleCVOptionChange('existing')}
                  >
                    {selectedCVOption === 'existing' && (
                      <div className="radio-inner"></div>
                    )}
                  </div>
                </div>
                <div className="option-content">
                  <p className="text-green">
                    {previousCvId
                      ? 'Select a different CV from your CV library'
                      : 'Select a CV from my CV library'}
                  </p>
                  <p className="cv-online-label">CV Online</p>

                  <div className="cv-list">
                    {cvList.map((cv) => (
                      <div
                        key={cv.cvId}
                        className={`cv-item ${
                          selectedCV?.cvId === cv.cvId ? 'selected-cv' : ''
                        } ${
                          previousCvId && cv.cvId === previousCvId
                            ? 'previous-cv'
                            : ''
                        }`}
                        onClick={() => setSelectedCV(cv)}
                      >
                        {cv.title}
                        {previousCvId && cv.cvId === previousCvId && (
                          <span className="previously-used">
                            {' '}
                            (Previously used)
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="section">
            <div className="warning-box">
              <div className="warning-content">
                <div className="warning-icon">
                  <i className="fas fa-exclamation-triangle"></i>
                </div>
                <div>
                  <p className="warning-title">Note:</p>
                  <ol className="warning-list">
                    <li>
                      Be cautious during your job search. If anything seems
                      suspicious, report it to{' '}
                      <span className="text-green">hotro@jobstock.vn</span>.
                    </li>
                    <li>
                      Learn more about fraud prevention{' '}
                      <span className="text-green">here</span>.
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="action-buttons sticky-footer">
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button
            className={`submit-button ${!canSubmit ? 'disabled' : ''}`}
            onClick={handleSubmit}
            disabled={!canSubmit}
          >
            {previousCvId ? 'Update Application' : 'Submit Apply'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobApplicationForm;
