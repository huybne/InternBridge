import { useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { setToken } from '../../../features/auth/localStorageService';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { setUser } from '../../../features/auth/authSlice';

export default function Authenticate() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const authCodeRegex = /code=([^&]+)/;
    const isMatch = window.location.href.match(authCodeRegex);

    if (!isMatch) {
      navigate('/login');
      return;
    }

    const authCode = isMatch[1];

    fetch(




      `http://localhost:8088/api/v1/auth/outbound/authentication?code=${authCode}`,

      { method: "POST", credentials: "include" }
    )
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('Google authentication failed');
        }

        const result = await response.json();
        const data = result?.data;

        if (!data?.accessToken) {
          throw new Error('Missing access token');
        }

        setToken(data.accessToken);

        dispatch(setUser({
          id: data.id, 
          email: data.email,
          username: data.name,
          picture: data.picture || null,
          roleNames: data.roleNames,
        }));


        dispatch(
          setUser({
            id: data.id,
            email: data.email,
            username: data.name,
            picture: data.picture || null,
            roleNames: data.roleNames,
          }),
        );

        navigate('/profile');
      })
      .catch((err) => {
        console.error('OAuth error:', err);
        navigate('/login');
      });
  }, [dispatch, navigate]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '30px',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <CircularProgress />
      <Typography>Authenticating...</Typography>
    </Box>
  );
}
