import { useEffect, useState } from 'react';
import { useAppDispatch } from '../app/hook';
import { authService } from '../features/auth/authService';
import { setUser } from '../features/auth/authSlice';
import { User } from '../features/auth/authType'; 

export const useAuthInit = () => {
  const dispatch = useAppDispatch();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    if (token) {
      authService.getProfile()
        .then((profile) => {
          dispatch(setUser(profile as User)); 
        })
        .finally(() => setReady(true));
    } else {
      setReady(true);
    }
  }, [dispatch]);

  return ready;
};
