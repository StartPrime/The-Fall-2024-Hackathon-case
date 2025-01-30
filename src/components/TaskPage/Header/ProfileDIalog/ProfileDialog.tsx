import classes from './ProfileDialog.module.scss';
import { useForm } from 'react-hook-form';
import { IUserInfo } from '../../../../interfaces';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/store.ts';
import { useState } from 'react';
import { RxCross1 } from 'react-icons/rx';

interface IHeaderDialogProps {
  dialogRef: React.RefObject<HTMLDialogElement>;
}

const ProfileDialog = ({ dialogRef }: IHeaderDialogProps) => {
  const userInfoState = useSelector(
    (state: RootState) => state.persistedReducer.userData.userInfo,
  ) as IUserInfo;

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<IUserInfo>({
    mode: 'onBlur',
    defaultValues: userInfoState,
  });

  const [error, setError] = useState(false);

  return (
    <dialog ref={dialogRef} className={classes.dialogWindow}>
      <form
        onSubmit={handleSubmit((data) => {
          if (JSON.stringify(data) === JSON.stringify(userInfoState)) {
            setError(true);
          } else {
            setError(false);
          }
        })}
        className={classes.form}
      >
        <div className={classes.title}>
          <p>Профиль</p>
          <RxCross1
            className={classes.exitIcon}
            onClick={() => {
              if (dialogRef.current) {
                dialogRef.current.close();
              }
            }}
          />
        </div>
        <div className={classes.inputArea}>
          <label>
            Фамилия
            <input
              type="text"
              className={errors?.surname && classes.errorInput}
              {...register('surname', {
                required: 'Поле обязательно для заполнения',
                maxLength: 50,
              })}
            />
          </label>
          {errors?.surname &&
            (errors.surname.message ? (
              <p className={classes.errorMessage}>{errors.surname.message}</p>
            ) : (
              <p className={classes.errorMessage}>Неверный формат</p>
            ))}
          <label>
            Имя:{' '}
            <input
              type="text"
              className={errors?.name && classes.errorInput}
              {...register('name', {
                required: 'Поле обязательно для заполнения',
                maxLength: 50,
              })}
            />
          </label>
          <label>
            Отчество:{' '}
            <input
              type="text"
              className={errors?.middleName && classes.errorInput}
              {...register('middleName', {
                required: 'Поле обязательно для заполнения',
                maxLength: 50,
              })}
            />
          </label>
          <label>
            Логин:{' '}
            <input
              type="text"
              className={errors?.login && classes.errorInput}
              {...register('login', {
                required: 'Поле обязательно для заполнения',
                maxLength: 50,
              })}
            />
          </label>
        </div>
        <div className={classes.navigation}>
          <button disabled={!isValid} type="submit">
            Редактировать
          </button>
        </div>
        {error && (
          <p className={classes.errorMessage}>Данный формы не изменились!</p>
        )}
      </form>
    </dialog>
  );
};

export default ProfileDialog;
