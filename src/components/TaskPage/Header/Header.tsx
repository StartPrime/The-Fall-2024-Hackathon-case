import classes from './Header.module.scss';
import { RiAlignJustify, RiAccountCircleFill } from 'react-icons/ri';
import { AiOutlineSearch } from 'react-icons/ai';
import { useState, useRef, useEffect } from 'react';
import { BsCheck2 } from 'react-icons/bs';

interface SearchProps {
  onSearch: (query: string) => void;
  onFilter: (filter: string) => void;
}

const HeaderTaskPage: React.FC<SearchProps> = ({ onSearch, onFilter }) => {
  const [isFocus, setIsFocus] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [filter, setFilter] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    onSearch(value);
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setFilter(false);
      }
    };

    if (filter) {
      document.addEventListener('mousedown', handleOutsideClick);
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [filter]);

  return (
    <>
      <header className={classes.header}>
        <h2>Разработка</h2>
        <form role="search">
          <RiAlignJustify
            className={classes.filterSVG}
            size={30}
            onClick={() => {
              setFilter(!filter);
            }}
          />
          <div
            className={`${classes.searchContainer} ${
              isFocus && classes.searchContainerFocus
            }`}
          >
            <AiOutlineSearch />
            {filter && (
              <div ref={filterRef} className={classes.filter}>
                <p className={classes.titleFilter}>Меню фильтра</p>
                <div className={classes.changeDate}>
                  <input
                    type="date"
                    defaultValue={new Date().toLocaleDateString()}
                  ></input>
                  <BsCheck2 />
                </div>
                <div className={classes.changeDate}>
                  <input type="date"></input>
                  <BsCheck2 />
                </div>
                <div className={classes.assigneeFilter}>
                  <p className={classes.assigneeFilterText}>Ответственный</p>
                  <BsCheck2 />
                </div>
                <p onClick={() => {}}>Применить</p>
              </div>
            )}

            <input
              onChange={handleInputChange}
              type="search"
              onFocus={() => {
                setIsFocus(true);
              }}
              onBlur={() => {
                setIsFocus(false);
              }}
            />
          </div>
          <RiAccountCircleFill
            className={classes.profileSVG}
            size={30}
            onClick={() => {
              if (dialogRef.current) {
                dialogRef.current.showModal();
              }
            }}
          />
        </form>
      </header>
      <dialog ref={dialogRef} className={classes.dialogWindow}>
        <p>Горькавой Андрей Александрович</p>
        <p>Зарегистрирован 29.02.2024</p>
        <p>Количество задач:</p>
        <p>Количество досок:</p>
      </dialog>
    </>
  );
};

export default HeaderTaskPage;
