import classes from './TaskDialog.module.scss';
import { RxCross1 } from 'react-icons/rx';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/store.ts';
import { ITask } from '../../../interfaces.ts';
import { RussianLocalization } from '../../../utils.ts';
import {
  updateTask,
  deleteTask,
  addTask,
  moveTask,
} from '../../../store/slices/User.slice.ts';
import { clearTask, setTask } from '../../../store/slices/Task.slice.ts';
import { Editor } from 'react-draft-wysiwyg';
import {
  convertFromRaw,
  convertToRaw,
  EditorState,
  RawDraftContentState,
} from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

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
    if (task.description) {
      handleLoad(task.description);
    } else {
      setEditorState(EditorState.createEmpty());
    }
  }, [task]);

  const data = new Date().toLocaleDateString('ru-RU');

  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty(),
  );

  const handleSave = () => {
    const contentState = editorState.getCurrentContent();
    const rawContent = convertToRaw(contentState);
    return JSON.stringify(rawContent);
  };

  const handleLoad = (text: string) => {
    const rawContent = JSON.parse(text) as RawDraftContentState;
    const contentState = convertFromRaw(rawContent);
    const newEditorState = EditorState.createWithContent(contentState);
    setEditorState(newEditorState);
  };

  return (
    <dialog ref={dialogRef} className={classes.dialogWindow}>
      <div className={classes.dialogTitle}>
        <textarea
          spellCheck="false"
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
        <div className={classes.editorContainer}>
          <Editor
            wrapperClassName={classes.wrapperClass}
            editorClassName={classes.editorClass}
            toolbarClassName={classes.toolbarClass}
            editorState={editorState}
            onEditorStateChange={setEditorState}
            placeholder="Текст..."
            localization={{
              locale: 'ru',
              translations: RussianLocalization,
            }}
          />
        </div>
        <div className={classes.assigneeTextAreaDialog}>
          <p>Ответственный: </p>
          <textarea
            spellCheck="false"
            placeholder="..."
            rows={1}
            value={currentTask.assignee}
            onChange={(e) =>
              setCurrentTask({ ...currentTask, assignee: e.target.value })
            }
          ></textarea>
        </div>
        <p>Дата создания: {taskStatus === 'new' ? data : task.createdAt}</p>
        {taskStatus === 'new' ? (
          <div className={classes.dialogButtons}>
            <button
              onClick={() => {
                if (currentTask.title) {
                  if (dialogRef.current) {
                    const text = handleSave();
                    dispatch(
                      addTask({
                        boardId,
                        newTask: {
                          ...currentTask,
                          createdAt: data,
                          description: text,
                        },
                      }),
                    );
                    dispatch(clearTask());
                    dialogRef.current.close();
                  }
                } else {
                  alert('Название задачи не может быть пустым!');
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
                if (currentTask.title) {
                  const text = handleSave();
                  dispatch(
                    updateTask({
                      boardId,
                      task: { ...currentTask, description: text },
                    }),
                  );
                  if (dialogRef.current) {
                    dispatch(clearTask());
                    dialogRef.current.close();
                  }
                } else {
                  alert('Название карточки не может быть пустым');
                }
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
            {currentTask.impotent ? (
              <button
                onClick={() => {
                  dispatch(
                    updateTask({
                      boardId,
                      task: { ...currentTask, impotent: false },
                    }),
                  );
                  if (dialogRef.current) {
                    dialogRef.current.close();
                  }
                }}
              >
                Убрать важность
              </button>
            ) : (
              <button
                onClick={() => {
                  dispatch(
                    updateTask({
                      boardId,
                      task: { ...currentTask, impotent: true },
                    }),
                  );
                  if (dialogRef.current) {
                    dialogRef.current.close();
                  }
                }}
              >
                Назначить важной
              </button>
            )}

            <select
              value={boardId}
              onChange={(e) => {
                dispatch(
                  moveTask({
                    sourceBoardId: boardId,
                    taskId: task.id,
                    targetBoardId: e.target.value,
                    afterTaskId: null,
                  }),
                );
                dispatch(setTask({ task, boardId: e.target.value }));
              }}
            >
              <option value={'Беклог'}>Беклог</option>
              <option value={'В процессе'}>В процессе</option>
              <option value={'Выполнена'}>Выполнена</option>
            </select>
          </div>
        )}
      </div>
    </dialog>
  );
}
