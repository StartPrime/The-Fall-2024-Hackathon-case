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
import { Editor } from 'react-draft-wysiwyg';
import {
  convertFromRaw,
  convertToRaw,
  EditorState,
  RawDraftContentState,
} from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
// import * as XLSX from 'xlsx';
// import * as XLSXStyle from 'sheetjs-style';

interface CardDialogProps {
  dialogRef: React.RefObject<HTMLDialogElement>;
}

type WorksheetRow = string[];

const RussianLocalization = {
  'components.controls.blocktype.h1': 'h1',
  'components.controls.blocktype.h2': 'h2',
  'components.controls.blocktype.h3': 'h3',
  'components.controls.blocktype.h4': 'h4',
  'components.controls.blocktype.h5': 'h5',
  'components.controls.blocktype.h6': 'h6',
  'components.controls.blocktype.blockquote': 'Цитата',
  'components.controls.blocktype.code': 'Код',
  'components.controls.blocktype.blocktype': '',
  'components.controls.blocktype.normal': 'Обычный',
  'components.controls.inline.monospace': 'Моноширинное пространство',
};

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

  const getEditorContent = (editorState: EditorState): string => {
    const contentState = editorState.getCurrentContent();
    return contentState.getPlainText();
  };

  // const exportTasksToExcel = (tasks: ITask[]) => {
  //   const worksheetData: WorksheetRow[] = [
  //     ['Заголовок', 'Ответственный', 'Описание', 'Дата создания'],
  //   ];

  //   tasks.forEach((task) => {
  //     worksheetData.push([
  //       task.title,
  //       task.assignee,
  //       task.description,
  //       task.createdAt,
  //     ]);
  //   });

  //   const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  //   const headerStyle = {
  //     font: { bold: true, sz: 12 },
  //     fill: {
  //       fgColor: { rgb: 'D9E1F2' },
  //       patternType: 'solid',
  //     },
  //     alignment: { horizontal: 'center' },
  //   };

  //   const defaultStyle = {
  //     font: { sz: 11 },
  //   };

  //   worksheet['!cols'] = [{ wch: 30 }, { wch: 20 }, { wch: 50 }, { wch: 20 }];

  //   const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1:A1');

  //   for (let C = range.s.c; C <= range.e.c; ++C) {
  //     const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
  //     if (worksheet[cellAddress]) {
  //       worksheet[cellAddress].s = headerStyle;
  //     }
  //   }

  //   for (let i = 2; i <= worksheetData.length; i++) {
  //     const row = worksheet[`A${i}`];
  //     if (row) {
  //       worksheet[`A${i}`].s = defaultStyle;
  //       worksheet[`B${i}`].s = defaultStyle;
  //       worksheet[`C${i}`].s = defaultStyle;
  //       worksheet[`D${i}`].s = defaultStyle;
  //     }
  //   }

  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, 'Tasks');
  //   XLSXStyle.writeFile(workbook, 'tasks.xlsx');
  // };

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
          <p>Ответственный: {task.assignee ? task.assignee : 'не назначен'}</p>
        </div>
        <p>
          Дата создания:{' '}
          {taskStatus === 'new'
            ? data
            : task.createdAt &&
              formatDateStringWithoutDateObject(task.createdAt)}
        </p>
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
                          createdAt: getCurrentDateInISOFormat(),
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
            <button
              onClick={() => {
                exportTasksToExcel([
                  {
                    ...currentTask,
                    description: getEditorContent(editorState),
                    createdAt: formatDateStringWithoutDateObject(
                      task.createdAt,
                    ),
                    assignee: task.assignee ? task.assignee : 'Не назначен',
                  },
                ]);
              }}
            >
              Экспорт
            </button>
          </div>
        )}
      </div>
    </dialog>
  );
}
