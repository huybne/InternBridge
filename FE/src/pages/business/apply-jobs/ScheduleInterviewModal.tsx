import { useState } from 'react';
import './ScheduleInterviewModal.css';

const ScheduleInterviewModal = ({ onClose, onConfirm, applyId }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleConfirm = () => {
    if (!date || !time) {
      alert('Please select full date and time!');
      return;
    }
    onConfirm({ date, time });
    // console.log(applyId);
  };

  return (
    <div className="schedule-modal-overlay">
      <div className="schedule-modal-content">
        <h2>Setup Interview Schedule</h2>
        <div className="form-group">
          <label>Choose date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Choose time:</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="confirm-btn" onClick={handleConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleInterviewModal;
