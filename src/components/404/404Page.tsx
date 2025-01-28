import { useNavigate } from 'react-router-dom';
import classes from './404Page.module.scss';

export default function ErrorPage() {
  const navigate = useNavigate();

  return (
    <div className={classes.container}>
      <p>404</p>
      <p>Страница не найдена</p>
      <button
        onClick={() => {
          navigate('/tasks');
        }}
      >
        На главную
      </button>
    </div>
  );
}
