import classes from './Login.module.scss';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { setPage } from '../../../store/slices/AuthPageSlice.slice.ts';
import { useLoginUserMutation } from '../../../store/Api.ts';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ILogin {
  login: string;
  password: string;
}

interface ILoginError {
  status: number;
  data: string | null;
}

export default function Login() {
  const dispatch = useDispatch();
  const [loginUser, { isError }] = useLoginUserMutation();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const LoginRequest = async (data: ILogin) => {
    try {
      const response = await loginUser(data).unwrap();
      window.localStorage.setItem('token', response.token);
      navigate('/tasks');
    } catch (e: unknown) {
      console.log(e);
      const error = e as ILoginError;
      if (error.status === 403) {
        setError('Неправильный логин или пароль');
      }
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ILogin>({
    mode: 'onBlur',
  });

  return (
    <>
      <form onSubmit={handleSubmit(LoginRequest)} className={classes.form}>
        <p className={classes.title}>Авторизация</p>
        <div className={classes.inputArea}>
          <label>
            Логин
            <input
              type="text"
              className={errors?.login && classes.errorInput}
              {...register('login', {
                required: 'Поле обязательно для заполнения',
              })}
            />
          </label>
          {errors?.login && (
            <p className={classes.errorMessage}>{errors.login.message}</p>
          )}
          <label>
            Пароль
            <input
              className={errors?.password && classes.errorInput}
              type="password"
              {...register('password', {
                required: 'Поле обязательно для заполнения',
              })}
            />
          </label>
          {errors?.password && (
            <p className={classes.errorMessage}>{errors.password.message}</p>
          )}
        </div>
        {error ? (
          <p className={classes.errorMessage}>{error}</p>
        ) : (
          isError && (
            <p className={classes.errorMessage}>
              Произошла ошибка, повторите попытку позже
            </p>
          )
        )}
        <div className={classes.navigation}>
          <button disabled={!isValid} type="submit">
            Вход
          </button>
          <p
            onClick={() => {
              dispatch(setPage('register'));
            }}
          >
            Зарегистрироваться
          </p>
        </div>
      </form>
    </>
  );
}
