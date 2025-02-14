import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser, ITask, IBoard, IUserInfo } from '../../interfaces.ts';
const ms: IBoard[] = [
  {
    id: 'Беклог',
    tasks: [
      {
        id: '1',
        title: 'Задача 1',
        createdAt: '5.02.2025',
      },
    ],
  },
  {
    id: 'В процессе',
    tasks: [
      {
        id: '2',
        title: 'Задача 2',
        createdAt: '6.02.2025',
      },
    ],
  },
  {
    id: 'Выполнена',
    tasks: [
      {
        id: '3',
        title: 'Задача 3',
        createdAt: '7.02.2025',
      },
      {
        id: '4',
        title: 'Задача 4',
        createdAt: '8.02.2025',
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
        newTask.id = Math.random().toString(36).substring(2, 15);
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

      const sourceBoard = state.boards.find((b) => b.id === sourceBoardId);
      const targetBoard = state.boards.find((b) => b.id === targetBoardId);

      if (!sourceBoard || !targetBoard) {
        return;
      }

      const taskToMoveIndex = sourceBoard.tasks.findIndex(
        (t) => t.id === taskId,
      );
      if (taskToMoveIndex === -1) {
        return;
      }
      const taskToMove = sourceBoard.tasks[taskToMoveIndex];

      sourceBoard.tasks.splice(taskToMoveIndex, 1);

      let insertIndex = 0;
      if (afterTaskId) {
        const afterTaskIndex = targetBoard.tasks.findIndex(
          (t) => t.id === afterTaskId,
        );
        if (afterTaskIndex !== -1) {
          insertIndex = afterTaskIndex + 1;
        }
      }

      targetBoard.tasks.splice(insertIndex, 0, taskToMove);
    },
  },
});

export const { updateTask, deleteTask, moveTask, addTask, setUserInfo } =
  UserSlice.actions;
export default UserSlice.reducer;
