import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ITask } from '../../interfaces.ts';

const TaskSlice = createSlice({
  name: 'task',
  initialState: {
    task: {
      id: '',
      title: '',
      assignee: '',
      description: '',
    } as ITask,
    boardId: '',
    taskStatus: 'old',
  },
  reducers: {
    setTask: (
      state,
      action: PayloadAction<{
        task: ITask;
        boardId: string;
      }>,
    ) => {
      const { task, boardId } = action.payload;
      state.task = task;
      state.boardId = boardId;
    },
    setTaskStatus: (
      state,
      action: PayloadAction<{
        taskStatus: string;
        boardId: string;
      }>,
    ) => {
      const { taskStatus, boardId } = action.payload;
      state.taskStatus = taskStatus;
      state.boardId = boardId;
    },

    clearTask: (state) => {
      state.task = {
        id: '',
        title: '',
        assignee: '',
        description: '',
      };
      state.boardId = '';
      state.taskStatus = 'old';
    },
  },
});

export const { setTask, setTaskStatus, clearTask } = TaskSlice.actions;
export default TaskSlice.reducer;
