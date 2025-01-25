import classes from './Header.module.scss';
import { RiAlignJustify, RiAccountCircleFill } from 'react-icons/ri';
import { AiOutlineSearch } from 'react-icons/ai';
import { useState, useRef } from 'react';

interface SearchInputProps {
  onSearch: (query: string) => void;
}

const HeaderTaskPage: React.FC<SearchInputProps> = ({ onSearch }) => {
  const [isFocus, setIsFocus] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    onSearch(value);
  };

  return (
    <>
      <header className={classes.header}>
        <h2>Разработка</h2>
        <form role="search">
          <RiAlignJustify className={classes.filterSVG} size={30} />
          <div
            id="searchInputTaskPage"
            className={`${classes.searchContainer} ${
              isFocus && classes.searchContainerFocus
            }`}
          >
            <AiOutlineSearch />
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
