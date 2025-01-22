import classes from './Header.module.scss';
import { RiAlignJustify, RiAccountCircleFill } from 'react-icons/ri';
import { AiOutlineSearch } from 'react-icons/ai';
import { useState } from 'react';

interface SearchInputProps {
  onSearch: (query: string) => void;
}

const HeaderTaskPage: React.FC<SearchInputProps> = ({ onSearch }) => {
  const [isFocus, setIsFocus] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    onSearch(value);
  };

  return (
    <>
      <header className={classes.header}>
        <p>Разработка</p>
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
          <RiAccountCircleFill className={classes.profileSVG} size={30} />
        </form>
      </header>
    </>
  );
};

export default HeaderTaskPage;
