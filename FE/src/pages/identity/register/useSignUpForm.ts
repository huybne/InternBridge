import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../app/store";
import { register } from "../../../features/auth/authSlice";

export const useSignUpForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== repeatPassword) {
      alert("Passwords do not match");
      return;
    }

    const result = await dispatch(register({ username, email, password }));
    if (register.fulfilled.match(result)) {
      setSuccessMessage(result.payload.message);
      setUsername('');
      setEmail('');
      setPassword('');
      setRepeatPassword('');
    }
  };

  return {
    username,
    email,
    password,
    repeatPassword,
    successMessage,
    loading,
    error,
    setUsername,
    setEmail,
    setPassword,
    setRepeatPassword,
    handleSubmit
  };
};
