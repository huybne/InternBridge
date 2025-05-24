import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function LogoutSang() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Xóa token trong localStorage
    localStorage.clear();

    // Điều hướng về trang login
    navigate('/login');
  }, []);

  return <div>Đang đăng xuất...</div>;
}
