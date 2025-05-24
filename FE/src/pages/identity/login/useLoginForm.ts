import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../../app/store";
import { getProfile, login } from "../../../features/auth/authSlice";

export const useLoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!email.includes("@")) {
      setFormError("Vui lòng nhập email hợp lệ.");
      return;
    }
    if (password.length < 2) {
      setFormError("Mật khẩu phải có ít nhất 4 ký tự.");
      return;
    }

    const result = await dispatch(login({ email, password }));
    if (login.fulfilled.match(result)) {
      setTimeout(() => {
        dispatch(getProfile());
        navigate("/profile");
      }, 500); 
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    formError,
    handleSubmit,
    loading,
    serverError: error,
  };
};
