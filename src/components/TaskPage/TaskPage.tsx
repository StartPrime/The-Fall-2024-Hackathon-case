import HeaderTaskPage from './Header/Header';
import classes from './TaskPage.module.scss';
import { useState, DragEvent, useRef } from 'react';
import { GoPlus } from 'react-icons/go';
import { useSelector, useDispatch } from 'react-redux';
import { moveTask } from '../../store/slices/User.slice.ts';
import { setTask, setTaskStatus } from '../../store/slices/Task.slice.ts';
import { RootState } from '../../store/store.ts';
import TaskDialog from './TaskDialog/TaskDialog.tsx';
import { ITask, IBoard } from '../../interfaces.ts';

export default function TaskPage() {
  const boards = useSelector(
    (state: RootState) => state.persistedReducer.userData.boards,
  );
  const dispatch = useDispatch();

  const [currentBoard, setCurrentBoard] = useState<IBoard>({
    id: '',
    tasks: [{ id: '', title: '', assignee: '', description: '' }],
  });
  const [currentTask, setCurrentTask] = useState<ITask>({
    id: '',
    title: '',
    assignee: '',
    description: '',
  });

  const dialogRef = useRef<HTMLDialogElement>(null);

  const [searchQuery, setSearchQuery] = useState('');

  function dragOverHandler(e: DragEvent<HTMLDivElement>): void {
    e.preventDefault();
  }

  function dragStartHandler(board: IBoard, task: ITask): void {
    setCurrentBoard(board);
    setCurrentTask(task);
  }

  function dropHandler(
    e: DragEvent<HTMLDivElement>,
    targetBoardId: string,
    afterTaskId: string | null,
  ): void {
    e.preventDefault();

    dispatch(
      moveTask({
        sourceBoardId: currentBoard.id,
        taskId: currentTask.id,
        targetBoardId,
        afterTaskId,
      }),
    );
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const filteredDisplayedTasks = boards.map((board) => ({
    ...board,
    tasks: board.tasks.filter((task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()),
    ),
  }));

  return (
    <>
      <div className={classes.page}>
        <div className={classes.container}>
          <HeaderTaskPage onSearch={handleSearch} />
          <div className={classes.boardsContainer}>
            {filteredDisplayedTasks.map((board) => (
              <div
                key={board.id}
                className={classes.boards}
                onDragOver={(e) => dragOverHandler(e)}
                onDrop={(e) => {
                  if (board.tasks.length === 0) {
                    dropHandler(e, board.id, null);
                  }
                }}
              >
                <h1 className={classes.titleBoard}>{board.id}</h1>
                {board.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="_tasks_1593g_31222156"
                    onClick={() => {
                      if (dialogRef.current) {
                        dispatch(setTask({ task, boardId: board.id }));
                        dialogRef.current.showModal();
                      }
                    }}
                    draggable="true"
                    onDragOver={(e) => dragOverHandler(e)}
                    onDragStart={() => dragStartHandler(board, task)}
                    onDrop={(e) => {
                      dropHandler(e, board.id, task.id);
                    }}
                  >
                    <h2>{task.title}</h2>
                    <hr />
                    <p>{task.description}</p>
                    <hr />
                    {task.assignee ? (
                      <p>Ответственный: {task.assignee}</p>
                    ) : (
                      <div className={classes.addAssignee} onClick={() => {}}>
                        <GoPlus size={20} />
                        <p>Добавить Исполнителя</p>
                      </div>
                    )}
                  </div>
                ))}
                <div className={classes.addTask}>
                  <GoPlus size={30} />
                  <p
                    onClick={() => {
                      dispatch(
                        setTaskStatus({ taskStatus: 'new', boardId: board.id }),
                      );
                      if (dialogRef.current) {
                        dialogRef.current.showModal();
                      }
                    }}
                  >
                    Добавить задачу
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <TaskDialog dialogRef={dialogRef} />
      </div>
    </>
  );
}
