import React, { useEffect, useState } from 'react';
import { useLoginForm } from './useLoginForm';
import backgroundImage from '/assets/img/banner-10.jpg';
import logoImage from '/assets/img/logo.png';
import googleIcon from '../../../assets/img/google-icon.svg';
import { Button } from '@mui/material';
import { OAuthConfig } from '../../../config/configuration';
import Loading from '../../../common/Loading';

const Login: React.FC = () => {
  const [showComp, setShowComp] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowComp(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);
  const {
    email,
    setEmail,
    password,
    setPassword,
    formError,
    handleSubmit,
    loading,
    serverError,
  } = useLoginForm();

  const handleClick = () => {
    const callbackUrl = OAuthConfig.redirectUri;
    const authUrl = OAuthConfig.authUri;
    const googleClientId = OAuthConfig.clientId;

    const targetUrl = `${authUrl}?redirect_uri=${encodeURIComponent(
      callbackUrl,
    )}&response_type=code&client_id=${googleClientId}&scope=openid%20email%20profile`;

    console.log(targetUrl);
    window.location.href = targetUrl;
  };
  const googleButtonStyle = {
    marginTop: '15px',
    padding: '10px 20px',
    borderRadius: '4px',
    border: '1px solid #dadce0',
    backgroundColor: '#ffffff', // trắng tinh
    color: '#3c4043', // màu chữ mặc định của Google
    fontSize: '14px',
    fontWeight: 600,
    fontFamily: 'Roboto, sans-serif',
    textTransform: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
    '&:hover': {
      backgroundColor: '#f7f8f8', // nhạt nhẹ khi hover
      borderColor: '#c6c7c8',
      boxShadow: '0 1px 3px rgba(60, 64, 67, 0.3)',
    },
  };

  if (!showComp) {
    return <Loading />;
  }

  return (
    <div
      className="simple-bg-screen"
      style={{ backgroundImage: `url(${backgroundImage})`, height: '100vh' }}
    >
      <div className="wrapper">
        <section className="login-screen-sec">
          <div className="container">
            <div className="login-screen">
              <a href="/">
                <img src={logoImage} className="logo" alt="Job Stock Logo" />
              </a>
              <form onSubmit={handleSubmit}>
                <label htmlFor="email" className="sr-only">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="form-control"
                  placeholder="konosuba93@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  aria-required="true"
                />
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  className="form-control"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  aria-required="true"
                />
                <button
                  className="btn btn-login"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'LOGIN'}
                </button>
                <Button
                  type="button"
                  variant="outlined"
                  onClick={handleClick}
                  fullWidth
                  sx={googleButtonStyle}
                >
                  <img
                    src={googleIcon}
                    alt="Google Icon"
                    style={{ width: 20, height: 20 }}
                  />
                  Login with Google
                </Button>

                {formError && <p className="error">{formError}</p>}
                {serverError && <p className="error">{serverError}</p>}
                <div className="links">
                  <span>
                    You Have No Account? <a href="/signup">Create An Account</a>
                  </span>
                  <span>
                    <a href="/forget-password">Forget Password</a>
                  </span>
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Login;
