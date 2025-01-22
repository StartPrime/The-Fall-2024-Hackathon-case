import classes from './Login.module.scss';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { setPage } from '../../../store/slices/AuthPageSlice.slice.ts';

interface TypeFormLogin {
  login: string;
  password: string;
}

export default function Login() {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<TypeFormLogin>({
    mode: 'onBlur',
  });

  function request(data: TypeFormLogin): void {
    console.log(data);
  }

  return (
    <>
      <form onSubmit={handleSubmit(request)} className={classes.form}>
        <p className={classes.heading}>Авторизация</p>
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
