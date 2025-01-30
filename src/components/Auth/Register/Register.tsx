import classes from './Register.module.scss';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { setPage } from '../../../store/slices/AuthPageSlice.slice.ts';
import { useRegisterUserMutation } from '../../../store/Api.ts';
import { useState } from 'react';
import { ApiError } from '../../../interfaces.ts';
import { useNavigate } from 'react-router-dom';

interface IRegister {
  initials: string;
  login: string;
  password: string;
  passwordRepeat: string;
}

export default function Register() {
  const dispatch = useDispatch();
  const [registerUser, { isError }] = useRegisterUserMutation();
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<IRegister>({
    mode: 'onBlur',
  });

  async function request(data: IRegister): Promise<void> {
    const splitInitials = data.initials.split(' ');

    interface IFormLoginSplitInitials
      extends Omit<IRegister, 'initials' | 'passwordRepeat'> {
      name: string;
      surname: string;
      middleName: string;
    }

    const userData: IFormLoginSplitInitials = {
      name: splitInitials[1],
      surname: splitInitials[0],
      middleName: splitInitials[2],
      login: data.login,
      password: data.password,
    };

    setError(null);

    try {
      const response = await registerUser(userData).unwrap();
      window.localStorage.setItem('token', response.token);
      navigate('/tasks');
    } catch (e: unknown) {
      if (e) {
        const error = e as ApiError;
        console.log(error);
        if (error.originalStatus === 400) {
          setError('Пользователь с таким логином уже существует.');
        }
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(request)} className={classes.form}>
      <p className={classes.title}>Регистрация</p>
      <div className={classes.inputArea}>
        <label>
          ФИО
          <input
            type="text"
            className={errors?.initials && classes.errorInput}
            {...register('initials', {
              required: 'Поле обязательно для заполнения',
              pattern:
                /^[А-ЯЁ][а-яё]+\s[-]?\s?[А-ЯЁ][а-яё]+\s[-]?\s?[А-ЯЁ][а-яё]+$/,
              maxLength: 50,
            })}
          />
        </label>
        {errors?.initials &&
          (errors.initials.message ? (
            <p className={classes.errorMessage}>{errors.initials.message}</p>
          ) : (
            <p className={classes.errorMessage}>Неверный формат</p>
          ))}

        <label>
          Логин
          <input
            type="text"
            className={errors?.login && classes.errorInput}
            {...register('login', {
              required: 'Поле обязательно для заполнения',
              maxLength: 20,
            })}
          />
        </label>
        {errors?.login && (
          <p className={classes.errorMessage}>
            {errors.login.message
              ? errors.login.message
              : 'Максимально число символов 20'}
          </p>
        )}
        <label>
          Пароль
          <input
            type="password"
            className={errors?.password && classes.errorInput}
            {...register('password', {
              required: 'Поле обязательно для заполнения',
            })}
          />
        </label>
        {errors?.password && (
          <p className={classes.errorMessage}>{errors.password.message}</p>
        )}
        <label>
          Повторите
          <input
            type="password"
            className={errors?.passwordRepeat && classes.errorInput}
            {...register('passwordRepeat', {
              required: 'Поле обязательно для заполнения',
              validate: (value) => {
                return value === watch('password') || 'Пароли не совпадают';
              },
            })}
          />
        </label>
        {errors?.passwordRepeat && (
          <p className={classes.errorMessage}>
            {errors.passwordRepeat.message}
          </p>
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
          Зарегистрироваться
        </button>
        <p
          onClick={() => {
            dispatch(setPage('login'));
          }}
        >
          Вход
        </p>
      </div>
    </form>
  );
}
