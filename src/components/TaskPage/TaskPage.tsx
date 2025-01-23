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

const ms = [
  {
    id: 'Беклог',
    tasks: [
      {
        id: '1',
        title: 'Спроектировать макет главной страницы',
        assignee: 'Иванов И.И.',
      },
      {
        id: '2',
        title: 'Написать техническое задание',
        assignee: 'Петрова А.С.',
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
      },
      {
        id: '4',
        title: 'Написание серверного кода',
        assignee: 'Иванов И.И.',
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
      },
      {
        id: '6',
        title: 'Обучение пользователей',
        assignee: 'Иванов И.И.',
      },
    ],
  },
];

interface ITask {
  id: string;
  title: string;
  assignee: string;
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
  const [currentCardDialog, setCurrentCardDialog] = useState<ITask | null>(
    null,
  );
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [searchQuery, setSearchQuery] = useState('');

  function dragOverHandler(e: DragEvent<HTMLDivElement>): void {
    e.preventDefault();
    if (
      e.target instanceof HTMLElement &&
      e.target.className === '_cards_1593g_31222156'
    ) {
      e.target.style.boxShadow = '0 7px 3px gray';
    }
  }

  function dragLeaveHandler(e: DragEvent<HTMLDivElement>): void {
    if (e.target instanceof HTMLElement) {
      e.target.style.border = 'none';
      e.target.style.boxShadow = 'none';
    }
  }

  function dragStartHandler(board: IBoard, task: ITask): void {
    const index = currentTaskSet.findIndex((b) => b.id === board.id);
    if (index !== -1) {
      board = currentTaskSet[index];
    }
    setCurrentBoard(board);
    setCurrentItem(task);
  }

  function dragEndHandler(e: DragEvent<HTMLDivElement>): void {
    if (e.target instanceof HTMLElement) {
      e.target.style.border = 'none';
      e.target.style.boxShadow = 'none';
    }
  }

  function dropHandler(
    e: DragEvent<HTMLDivElement>,
    board: IBoard,
    task: ITask,
  ): void {
    e.preventDefault();
    if (e.target instanceof HTMLElement) {
      e.target.style.border = 'none';
      e.target.style.boxShadow = 'none';
    }
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

      setDisplayedTasks(currentTaskSet);
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
      setDisplayedTasks(currentTaskSet);
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const filteredDisplayedTasks = currentTaskSet.map((board) => ({
    ...board,
    tasks: board.tasks.filter((task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()),
    ),
  }));

  useEffect(() => {
    setDisplayedTasks(filteredDisplayedTasks);
  }, [searchQuery, currentTaskSet]);

  useEffect(() => {}, [displayedTasks, currentTaskSet]);

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
                <p className={classes.titleBoard}>{board.id}</p>
                {board.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="_cards_1593g_31222156"
                    onClick={() => {
                      setCurrentCardDialog(task);
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
                    <h3>{task.title}</h3>
                    <p>Ответственный: {task.assignee}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <dialog ref={dialogRef} className={classes.dialogWindow}>
          <div className={classes.dialogTitle}>
            <p>{currentCardDialog?.title}</p>
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
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum
              amet atque accusamus veniam doloremque obcaecati placeat officia
              velit dolore consequuntur, ut aliquid repellat pariatur quaerat id
              inventore laborum rerum nisi?
            </p>
            <p>Ответственный: {currentCardDialog?.assignee}</p>
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
              <button>Сохранить</button>
              <button>Удалить</button>
            </div>
          </div>
        </dialog>
      </div>
    </>
  );
}
