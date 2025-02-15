import HeaderTaskPage from './Header/Header';
import classes from './TaskPage.module.scss';
import { useState, DragEvent, useRef } from 'react';
import { GoPlus } from 'react-icons/go';
import { useSelector, useDispatch } from 'react-redux';
import { moveTask } from '../../store/slices/User.slice.ts';
import {
  setTask,
  setTaskStatus,
  clearTask,
} from '../../store/slices/Task.slice.ts';
import { RootState } from '../../store/store.ts';
import TaskDialog from './TaskDialog/TaskDialog.tsx';
import { ITask, IBoard, IDateFilter } from '../../interfaces.ts';

export default function TaskPage() {
  const boards = useSelector(
    (state: RootState) => state.persistedReducer.userData.boards,
  );

  const dispatch = useDispatch();

  const [currentBoard, setCurrentBoard] = useState<IBoard>({
    id: '',
    tasks: [
      {
        id: '',
        title: '',
        assignee: '',
        description: '',
        createdAt: '',
        impotent: false,
      },
    ],
  });
  const [currentTask, setCurrentTask] = useState<ITask>({
    id: '',
    title: '',
    assignee: '',
    description: '',
    createdAt: '',
    impotent: false,
  });

  const dialogRef = useRef<HTMLDialogElement>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilter, setSearchFilter] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<IDateFilter | null>(null);

  function dragOverHandler(e: DragEvent<HTMLElement>): void {
    e.preventDefault();
  }

  function dragStartHandler(board: IBoard, task: ITask): void {
    setCurrentBoard(board);
    setCurrentTask(task);
  }

  function dropHandler(
    e: DragEvent<HTMLElement>,
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

  const filterSelection = (filter: string | null, dates?: IDateFilter) => {
    setSearchFilter(filter);
    if (dates) {
      if (dates.from) {
        setDateFilter({ ...dateFilter, from: dates.from });
      }
      if (dates.to) {
        setDateFilter({ ...dateFilter, to: dates.to });
      }
    }
  };

  function sortTasks(
    tasks: ITask[],
    sortBy: string | null,
    dateFilter: IDateFilter | null,
  ): ITask[] {
    if (!sortBy) {
      return tasks;
    }

    if (sortBy === 'assignee') {
      return [...tasks].sort((a, b) => {
        if (a.assignee && b.assignee) {
          const assigneeA = a.assignee.toLowerCase();
          const assigneeB = b.assignee.toLowerCase();
          if (assigneeA < assigneeB) return -1;
          if (assigneeA > assigneeB) return 1;
        }
        return 0;
      });
    }

    if (dateFilter?.from) {
      const dateF = new Date(dateFilter.from);
      tasks = tasks.filter((a) => {
        const date = new Date(a.createdAt);
        return dateF <= date;
      });
    }

    if (dateFilter?.to) {
      const dateT = new Date(dateFilter.to);
      tasks = tasks.filter((a) => {
        const date = new Date(a.createdAt);
        return dateT >= date;
      });
    }

    return tasks;
  }

  function filterAndSortTasks(
    boards: IBoard[],
    searchQuery: string,
    sortBy: string | null,
    dateFilter: IDateFilter | null,
  ): IBoard[] {
    return boards.map((board) => ({
      ...board,
      tasks: sortTasks(
        board.tasks.filter((task) =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
        sortBy,
        dateFilter,
      ),
    }));
  }

  return (
    <>
      <div className={classes.page}>
        <div className={classes.container}>
          <HeaderTaskPage
            onSearch={handleSearch}
            onFilter={filterSelection}
            isFilter={searchFilter}
          />
          <div className={classes.boardsContainer}>
            {filterAndSortTasks(
              boards,
              searchQuery,
              searchFilter,
              dateFilter,
            ).map((board) => (
              <section
                key={board.id}
                className={classes.boards}
                onDragOver={(e) => dragOverHandler(e)}
                onDrop={(e) => {
                  if (currentBoard.id != board.id) {
                    dropHandler(e, board.id, null);
                  }
                }}
              >
                <div>
                  <h1 className={classes.titleBoard}>{board.id}</h1>
                </div>
                <div className={classes.tasksContainer}>
                  {board.tasks.map((task) => (
                    <div
                      onClick={() => {
                        if (dialogRef.current) {
                          dispatch(setTask({ task, boardId: board.id }));
                          dialogRef.current.showModal();
                        }
                      }}
                      key={task.id}
                      className="_tasks_1593g_31222156"
                      draggable="true"
                      onDragOver={(e) => dragOverHandler(e)}
                      onDragStart={() => dragStartHandler(board, task)}
                      onDrop={(e) => {
                        dropHandler(e, board.id, task.id);
                      }}
                    >
                      <h2>{task.title}</h2>
                      <p>Дата создания: {task.createdAt}</p>
                      <hr />
                      {task.assignee ? (
                        <p>Ответственный: {task.assignee}</p>
                      ) : (
                        <div className={classes.addAssignee} onClick={() => {}}>
                          <GoPlus size={20} />
                          <p>Добавить Исполнителя</p>
                        </div>
                      )}
                      {task.impotent && (
                        <div className={classes.importance}>Важно</div>
                      )}
                    </div>
                  ))}
                </div>
                <div className={classes.addTask}>
                  <GoPlus size={30} />
                  <p
                    onClick={() => {
                      dispatch(clearTask());
                      dispatch(
                        setTaskStatus({
                          taskStatus: 'new',
                          boardId: board.id,
                        }),
                      );
                      if (dialogRef.current) {
                        dialogRef.current.showModal();
                      }
                    }}
                  >
                    Добавить задачу
                  </p>
                </div>
              </section>
            ))}
          </div>
        </div>
        <TaskDialog dialogRef={dialogRef} />
      </div>
    </>
  );
}
