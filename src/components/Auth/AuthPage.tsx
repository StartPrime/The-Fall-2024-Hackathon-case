import Login from './Login/Login';
import classes from './AuthPage.module.scss';
import { useSelector } from 'react-redux';
import Register from './Register/Register';
import { RootState } from '../../store/store.ts';

export default function AuthPage() {
  const page = useSelector(
    (state: RootState) => state.persistedReducer.authPage.page,
  );

  return (
    <div className={classes.container}>
      {page === 'login' ? <Login /> : <Register />}
    </div>
  );
}
