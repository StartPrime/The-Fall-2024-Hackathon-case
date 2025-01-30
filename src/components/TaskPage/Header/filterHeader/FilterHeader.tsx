import classes from './FilterHeader.module.scss';
import { BsCheck2 } from 'react-icons/bs';

interface IFilterProps {
  filter: boolean;
  filterRef: React.RefObject<HTMLDivElement>;
}

const FilterHeader: React.FC<IFilterProps> = ({ filter, filterRef }) => {
  return (
    <>
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
    </>
  );
};

export default FilterHeader;
