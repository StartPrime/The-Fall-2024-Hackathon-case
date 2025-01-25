import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser, ITask } from '../../interfaces.ts';
const ms = [
  {
    id: 'Беклог',
    tasks: [
      {
        id: '1',
        title: 'Спроектировать макет главной страницы',
        assignee: '',
        description:
          'Создание эскиза и визуального представления главной страницы веб-сайта или приложения. Определение расположения основных элементов, навигации и контента.',
      },
      {
        id: '2',
        title: 'Написать техническое задание',
        assignee: 'Петрова А.С.',
        description:
          'Подготовка документа, содержащего подробное описание требований к разрабатываемому программному обеспечению или системе, включая функциональные и нефункциональные требования.',
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
          'Создание интерактивного и удобного интерфейса для пользователей веб-сайта или приложения, включая разработку HTML, CSS и JavaScript-кода.',
      },
      {
        id: '4',
        title: 'Написание серверного кода',
        assignee: 'Иванов И.И.',
        description:
          'Разработка кода на стороне сервера, который обеспечивает логику работы веб-сайта или приложения, включая обработку запросов, взаимодействие с базой данных и управление бизнес-логикой.',
      },
    ],
  },
  {
    id: 'Выполнена',
    tasks: [
      {
        id: '5',
        title: 'Запуск приложения в продакшн',
        assignee: 'Петрова А.С.',
        description:
          'Деплоймент приложения на продакшн-сервер и обеспечение его доступности для пользователей.',
      },
      {
        id: '6',
        title: 'Обучение пользователей',
        assignee: 'Иванов И.И.',
        description:
          'Проведение обучения пользователей по работе с новым приложением или системой, включая подготовку учебных материалов и проведение тренингов.',
      },
      {
        id: '7',
        title: 'Спроектировать макет главной страницы',
        assignee: 'Иванов И.И.',
        description:
          'Создание эскиза и визуального представления главной страницы веб-сайта или приложения. Определение расположения основных элементов, навигации и контента.',
      },
      {
        id: '8',
        title: 'Спроектировать макет главной страницы',
        assignee: 'Иванов И.И.',
        description:
          'Создание эскиза и визуального представления главной страницы веб-сайта или приложения. Определение расположения основных элементов, навигации и контента.',
      },
    ],
  },
];

const UserSlice = createSlice({
  name: 'userSlice',
  initialState: {
    userInfo: {},
    boards: ms,
  } as IUser,
  reducers: {
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

export const { updateTask, deleteTask, moveTask, addTask } = UserSlice.actions;
export default UserSlice.reducer;
