import HeaderTaskPage from './Header/Header';
import classes from './TaskPage.module.scss';
import { useState, DragEvent, useRef, useEffect } from 'react';
import { RxCross1 } from 'react-icons/rx';
import { LiaItalicSolid } from 'react-icons/lia';
import { BsTypeBold } from 'react-icons/bs';
import { PiTextAUnderline } from 'react-icons/pi';
import { RiFontSize2 } from 'react-icons/ri';
import { IoIosColorPalette } from 'react-icons/io';
import { MdFormatListNumbered } from 'react-icons/md';
import { CiLink } from 'react-icons/ci';
import { GoPlus } from 'react-icons/go';
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

interface ITask {
  id: string;
  title: string;
  assignee: string;
  description: string;
}

interface IBoard {
  id: string;
  tasks: ITask[];
}

export default function TaskPage() {
  const [displayedTasks, setDisplayedTasks] = useState(ms);
  const [currentTaskSet, setCurrentTaskSet] = useState(ms);

  const [currentBoard, setCurrentBoard] = useState<IBoard | null>(null);
  const [currentItem, setCurrentItem] = useState<ITask | null>(null);

  const dialogRef = useRef<HTMLDialogElement>(null);
  const [searchQuery, setSearchQuery] = useState('');

  function dragOverHandler(e: DragEvent<HTMLDivElement>): void {
    e.preventDefault();
  }

  function dragLeaveHandler(e: DragEvent<HTMLDivElement>): void {}

  function dragStartHandler(board: IBoard, task: ITask): void {
    const index = currentTaskSet.findIndex((b) => b.id === board.id);
    if (index !== -1) {
      board = currentTaskSet[index];
    }
    setCurrentBoard(board);
    setCurrentItem(task);
  }

  function dragEndHandler(e: DragEvent<HTMLDivElement>): void {}

  function dropHandler(
    e: DragEvent<HTMLDivElement>,
    board: IBoard,
    task: ITask,
  ): void {
    e.preventDefault();
    const index = currentTaskSet.findIndex((b) => b.id === board.id);
    if (currentBoard && currentItem && index !== -1) {
      board = currentTaskSet[index];
      const currentIndex = currentBoard.tasks.indexOf(currentItem);
      currentBoard.tasks.splice(currentIndex, 1);
      const dropIndex = board.tasks.indexOf(task);
      board.tasks.splice(dropIndex + 1, 0, currentItem);
      setCurrentTaskSet(
        currentTaskSet.map((b) => {
          if (b.id === board.id) {
            return board;
          }
          if (b.id === currentBoard.id) {
            return currentBoard;
          }
          return b;
        }),
      );
    }
  }

  function dropCardHandler(board: IBoard) {
    const index = currentTaskSet.findIndex((b) => b.id === board.id);
    if (
      currentBoard &&
      currentItem &&
      board.tasks.length == 0 &&
      index !== -1
    ) {
      board = currentTaskSet[index];
      board.tasks.push(currentItem);
      const currentIndex = currentBoard.tasks.indexOf(currentItem);
      currentBoard.tasks.splice(currentIndex, 1);
      setCurrentTaskSet(
        currentTaskSet.map((b) => {
          if (b.id === board.id) {
            return board;
          }
          if (b.id === currentBoard.id) {
            return currentBoard;
          }
          return b;
        }),
      );
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  function editCard(): void {
    setCurrentTaskSet(
      currentTaskSet.map((b) => {
        if (b.id === currentBoard?.id) {
          return {
            ...b,
            tasks: b.tasks.map((task) => {
              if (task.id === currentItem?.id) {
                return currentItem;
              } else {
                return task;
              }
            }),
          };
        }
        return b;
      }),
    );
  }

  function deleteCard(): void {
    setCurrentTaskSet(
      currentTaskSet.map((board) => {
        if (board.id === currentBoard?.id) {
          return {
            ...board,
            tasks: board.tasks.filter((task) => task.id !== currentItem?.id),
          };
        }
        return board; // Возвращаем доску без изменений
      }),
    );
    if (dialogRef.current) {
      dialogRef.current.close();
    }
  }

  const filteredDisplayedTasks = currentTaskSet.map((board) => ({
    ...board,
    tasks: board.tasks.filter((task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()),
    ),
  }));

  useEffect(() => {
    setDisplayedTasks(filteredDisplayedTasks);
  }, [searchQuery, currentTaskSet]);

  return (
    <>
      <div className={classes.page}>
        <div className={classes.container}>
          <HeaderTaskPage onSearch={handleSearch} />
          <div className={classes.boardsContainer}>
            {displayedTasks.map((board) => (
              <div
                key={board.id}
                className={classes.boards}
                onDragOver={(e) => dragOverHandler(e)}
                onDrop={() => dropCardHandler(board)}
              >
                <h1 className={classes.titleBoard}>{board.id}</h1>
                {board.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="_cards_1593g_31222156"
                    onClick={() => {
                      setCurrentBoard(board);
                      setCurrentItem(task);
                      if (dialogRef.current) {
                        dialogRef.current.showModal();
                      }
                    }}
                    draggable="true"
                    onDragOver={(e) => dragOverHandler(e)}
                    onDragLeave={(e) => dragLeaveHandler(e)}
                    onDragStart={() => dragStartHandler(board, task)}
                    onDragEnd={(e) => dragEndHandler(e)}
                    onDrop={(e) => dropHandler(e, board, task)}
                  >
                    <h2>{task.title}</h2>
                    <hr />
                    <p>{task.description}</p>
                    <hr />
                    {task.assignee ? (
                      <p>Ответственный: {task.assignee}</p>
                    ) : (
                      <div
                        className={classes.addAssignee}
                        onClick={() => {
                          console.log(1);
                        }}
                      >
                        <GoPlus size={20} />
                        <p>Добавить Исполнителя</p>
                      </div>
                    )}
                  </div>
                ))}
                <div className={classes.addTask}>
                  <GoPlus size={30} />
                  <p>Добавить задачу</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <dialog ref={dialogRef} className={classes.dialogWindow}>
          <div className={classes.dialogTitle}>
            <p>{currentItem?.title}</p>
            <RxCross1
              className={classes.exitIconDialog}
              onClick={() => {
                if (dialogRef.current) {
                  dialogRef.current.close();
                }
              }}
            />
          </div>
          <div className={classes.dialogMainInfo}>
            <textarea
              value={currentItem?.description}
              onChange={(e) => {
                setCurrentItem({
                  ...currentItem,
                  description: e.target.value,
                } as ITask);
              }}
              rows={5}
            ></textarea>
            <div className={classes.assigneeTextAreaDialog}>
              <p>Ответственный: </p>
              <textarea
                value={currentItem?.assignee}
                rows={1}
                onChange={(e) => {
                  setCurrentItem({
                    ...currentItem,
                    assignee: e.target.value,
                  } as ITask);
                }}
              ></textarea>
            </div>
            <div className={classes.editor}>
              <LiaItalicSolid size={30} />
              <BsTypeBold size={30} />
              <PiTextAUnderline size={30} />
              <RiFontSize2 size={30} />
              <IoIosColorPalette size={30} />
              <MdFormatListNumbered size={30} />
              <CiLink size={30} />
            </div>
            <div className={classes.dialogButtons}>
              <button onClick={editCard}>Сохранить</button>
              <button onClick={deleteCard}>Удалить</button>
            </div>
          </div>
        </dialog>
      </div>
    </>
  );
}
