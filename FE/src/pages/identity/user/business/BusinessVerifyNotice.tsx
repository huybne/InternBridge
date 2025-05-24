import { useNavigate } from 'react-router-dom';
import './BusinessVerifyNotice.css';

export default function BusinessVerifyNotice() {
  const navigate = useNavigate();

  return (
    <>
      {/* <Loading /> */}
      <div className="verify-notice-container">
        <div className="verify-notice-box">
          <h2 className="verify-title">Tài khoản chưa xác thực</h2>
          <p className="verify-message">
            Doanh nghiệp của bạn chưa hoàn tất xác thực. Vui lòng tiến hành xác
            thực để tiếp tục sử dụng các chức năng chính.
          </p>
          <button
            className="verify-button"
            onClick={() => navigate('/verify-business')}
          >
            Xác thực ngay
          </button>
        </div>
      </div>
    </>
  );
}
