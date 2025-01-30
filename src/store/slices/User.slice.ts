import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser, ITask, IBoard, IUserInfo } from '../../interfaces.ts';
const ms: IBoard[] = [
  {
    id: 'Беклог',
    tasks: [
      {
        id: '1',
        title: 'Спроектировать макет главной страницы',
        assignee: '',
        description:
          '{"blocks":[{"key":"am1gu","text":"dqwdqwdqw","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":4,"length":5,"style":"color-rgb(26,188,156)"}],"entityRanges":[],"data":{}}],"entityMap":{}}',
        createdAt: '2024-06-20T10:00:00', // Установили конкретную дату
      },
      {
        id: '2',
        title: 'Написать техническое задание',
        assignee: 'Петрова А.С.',
        description:
          '{"blocks":[{"key":"am1gu","text":"dqwdqwdqw","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":4,"length":5,"style":"color-rgb(26,188,156)"}],"entityRanges":[],"data":{}}],"entityMap":{}}',
        createdAt: '2024-06-20T12:30:00', // Установили конкретную дату
      },
    ],
  },
  {
    id: 'В процессе',
    tasks: [
      {
        id: '3',
        title: 'Разработка пользовательского интерфейса',
        assignee: 'Сидоров В.П.',
        description:
          '{"blocks":[{"key":"am1gu","text":"dqwdqwdqw","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":4,"length":5,"style":"color-rgb(26,188,156)"}],"entityRanges":[],"data":{}}],"entityMap":{}}',
        createdAt: '2024-06-21T09:15:00', // Установили конкретную дату
      },
    ],
  },
  {
    id: 'Выполнена',
    tasks: [
      {
        id: '4',
        title: 'Запуск приложения в продакшн',
        assignee: 'Петрова А.С.',
        description:
          '{"blocks":[{"key":"am1gu","text":"dqwdqwdqw","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":4,"length":5,"style":"color-rgb(26,188,156)"}],"entityRanges":[],"data":{}}],"entityMap":{}}',
        createdAt: '2024-06-22T11:00:00', // Установили конкретную дату
      },
    ],
  },
];

const userInfo: IUserInfo = {
  id: 1,
  login: 'StartPrime',
  name: 'Андрей',
  surname: 'Горькавой',
  middleName: 'Александрович',
};

const UserSlice = createSlice({
  name: 'userSlice',
  initialState: {
    userInfo: userInfo,
    boards: ms,
  } as IUser,
  reducers: {
    setUserInfo: (state, action: PayloadAction<{ data: IUserInfo }>) => {
      state.userInfo = action.payload.data;
    },

    addTask: (
      state,
      action: PayloadAction<{ boardId: string; newTask: ITask }>,
    ) => {
      const { boardId, newTask } = action.payload;
      const board = state.boards.find((b) => b.id === boardId);
      if (board) {
        board.tasks.push(newTask);
      }
    },

    updateTask: (
      state,
      action: PayloadAction<{ boardId: string; task: ITask }>,
    ) => {
      const { boardId, task } = action.payload;
      const board = state.boards.find((b) => b.id === boardId);
      if (board) {
        board.tasks = board.tasks.map((t) => (t.id === task.id ? task : t));
      }
    },

    deleteTask: (
      state,
      action: PayloadAction<{ boardId: string; taskId: string }>,
    ) => {
      const { boardId, taskId } = action.payload;
      const board = state.boards.find((b) => b.id === boardId);
      if (board) {
        board.tasks = board.tasks.filter((t) => t.id !== taskId);
      }
    },

    moveTask: (
      state,
      action: PayloadAction<{
        sourceBoardId: string;
        taskId: string;
        targetBoardId: string;
        afterTaskId: string | null;
      }>,
    ) => {
      const { sourceBoardId, taskId, targetBoardId, afterTaskId } =
        action.payload;

      // 1. Находим исходную доску и целевую доску
      const sourceBoard = state.boards.find((b) => b.id === sourceBoardId);
      const targetBoard = state.boards.find((b) => b.id === targetBoardId);

      if (!sourceBoard || !targetBoard) {
        return; // Не нашли доску, ничего не делаем
      }

      // 2. Находим задачу, которую нужно переместить
      const taskToMoveIndex = sourceBoard.tasks.findIndex(
        (t) => t.id === taskId,
      );
      if (taskToMoveIndex === -1) {
        return; // не нашли задачу
      }
      const taskToMove = sourceBoard.tasks[taskToMoveIndex];

      // 3. Удаляем задачу из исходной доски
      sourceBoard.tasks.splice(taskToMoveIndex, 1);
      // 4. Определяем индекс для вставки в целевую доску
      let insertIndex = 0;
      if (afterTaskId) {
        const afterTaskIndex = targetBoard.tasks.findIndex(
          (t) => t.id === afterTaskId,
        );
        if (afterTaskIndex !== -1) {
          insertIndex = afterTaskIndex + 1;
        }
      }

      // 5. Вставляем задачу в целевую доску
      targetBoard.tasks.splice(insertIndex, 0, taskToMove);
    },
  },
});

export const { updateTask, deleteTask, moveTask, addTask, setUserInfo } =
  UserSlice.actions;
export default UserSlice.reducer;
