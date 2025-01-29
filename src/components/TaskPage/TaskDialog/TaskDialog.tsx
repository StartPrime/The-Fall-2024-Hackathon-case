import classes from './TaskDialog.module.scss';
import { RxCross1 } from 'react-icons/rx';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/store.ts';
import { ITask } from '../../../interfaces.ts';
import { formatDateStringWithoutDateObject } from '../../../utils.ts';
import { getCurrentDateInISOFormat } from '../../../utils.ts';
import {
  updateTask,
  deleteTask,
  addTask,
} from '../../../store/slices/User.slice.ts';
import { clearTask } from '../../../store/slices/Task.slice.ts';
import MyEditor from './Editor/Editor.tsx';

interface CardDialogProps {
  dialogRef: React.RefObject<HTMLDialogElement>;
}

export default function TaskDialog({ dialogRef }: CardDialogProps) {
  const { task, boardId, taskStatus } = useSelector(
    (state: RootState) => state.persistedReducer.task,
  );

  const dispatch = useDispatch();

  const [currentTask, setCurrentTask] = useState<ITask>(task);
  useEffect(() => {
    setCurrentTask(task);
  }, [task]);

  const data = new Date().toLocaleDateString('ru-RU');

  return (
    <dialog ref={dialogRef} className={classes.dialogWindow}>
      <div className={classes.dialogTitle}>
        <textarea
          placeholder="Заголовок..."
          rows={1}
          value={currentTask.title}
          onChange={(e) =>
            setCurrentTask({ ...currentTask, title: e.target.value })
          }
        ></textarea>
        <RxCross1
          className={classes.exitIconDialog}
          onClick={() => {
            if (dialogRef.current) {
              dispatch(clearTask());
              dialogRef.current.close();
            }
          }}
        />
      </div>

      <div className={classes.dialogMainInfo}>
        <MyEditor></MyEditor>
        <div className={classes.assigneeTextAreaDialog}>
          <p>Ответственный: {task.assignee ? task.assignee : 'не назначен'}</p>
        </div>
        {taskStatus === 'new' ? (
          <p>Дата создания: {data}</p>
        ) : (
          <p>
            Дата создания:{' '}
            {task.createdAt &&
              formatDateStringWithoutDateObject(task.createdAt)}
          </p>
        )}
        {taskStatus === 'new' ? (
          <div className={classes.dialogButtons}>
            <button
              onClick={() => {
                if (dialogRef.current) {
                  currentTask.createdAt = getCurrentDateInISOFormat();
                  dispatch(addTask({ boardId, newTask: currentTask }));
                  dispatch(clearTask());
                  dialogRef.current.close();
                }
              }}
            >
              Добавить карточку
            </button>
          </div>
        ) : (
          <div className={classes.dialogButtons}>
            <button
              onClick={() => {
                dispatch(updateTask({ boardId, task: currentTask }));
              }}
            >
              Сохранить
            </button>
            <button
              onClick={() => {
                const req = confirm('Удалить задачу?');
                if (req) {
                  dispatch(deleteTask({ boardId, taskId: currentTask.id }));
                  if (dialogRef.current) {
                    dialogRef.current.close();
                  }
                }
              }}
            >
              Удалить
            </button>
          </div>
        )}
      </div>
    </dialog>
  );
}
