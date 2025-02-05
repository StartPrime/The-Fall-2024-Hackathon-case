import classes from './Header.module.scss';
import { RiAlignJustify, RiAccountCircleFill } from 'react-icons/ri';
import { AiOutlineSearch } from 'react-icons/ai';
import { useState, useRef, useEffect } from 'react';
import FilterHeader from './filterHeader/FilterHeader.tsx';
import ProfileDialog from './ProfileDIalog/ProfileDialog.tsx';

interface SearchProps {
  onSearch: (query: string) => void;
  onFilter: (filter: string | null) => void;
  isFilter: string | null;
}

const HeaderTaskPage: React.FC<SearchProps> = ({
  onSearch,
  onFilter,
  isFilter,
}) => {
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

            <FilterHeader
              filter={filter}
              filterRef={filterRef}
              onFilter={onFilter}
              isFilter={isFilter}
            />
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
      <ProfileDialog dialogRef={dialogRef} />
    </>
  );
};

export default HeaderTaskPage;
