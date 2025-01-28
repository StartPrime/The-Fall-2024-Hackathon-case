import Login from './Login/Login';
import classes from './AuthPage.module.scss';
import { useSelector } from 'react-redux';
import Register from './Register/Register';
import { RootState } from '../../store/store.ts';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function AuthPage() {
  const navigate = useNavigate();

  const isAuth = window.localStorage.getItem('token');

  const page = useSelector(
    (state: RootState) => state.persistedReducer.authPage.page,
  );

  useEffect(() => {
    if (isAuth) {
      navigate('/404');
    }
  }, [isAuth, navigate]);

  return (
    <div className={classes.container}>
      {page === 'login' ? <Login /> : <Register />}
    </div>
  );
}
