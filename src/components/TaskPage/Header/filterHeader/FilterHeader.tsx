import classes from './FilterHeader.module.scss';
import { IDateFilter } from '../../../../interfaces.ts';

interface IFilterProps {
  filter: boolean;
  filterRef: React.RefObject<HTMLDivElement>;
  onFilter: (filter: string | null, dateFilter?: IDateFilter) => void;
  isFilter: string | null;
}

const FilterHeader: React.FC<IFilterProps> = ({
  filter,
  filterRef,
  onFilter,
  isFilter,
}) => {
  return (
    <>
      {filter && (
        <div ref={filterRef} className={classes.filter}>
          <p className={classes.titleFilter}>Меню фильтра</p>
          <div className={classes.changeDate}>
            <input
              type="date"
              onChange={(e) => {
                const date = e.target.value.split('-').reverse().join('.');
                onFilter('date', { from: date });
              }}
            ></input>
          </div>
          <div className={classes.changeDate}>
            <input
              type="date"
              onChange={(e) => {
                const date = e.target.value.split('-').reverse().join('.');
                onFilter('date', { to: date });
              }}
            ></input>
          </div>
          <div className={classes.assigneeFilter}>
            <p
              className={classes.assigneeFilterText}
              onClick={() => {
                onFilter('assignee');
              }}
            >
              Ответственный
            </p>
          </div>
          {isFilter ? (
            <p
              className={classes.resetFiler}
              onClick={() => {
                onFilter(null, { from: null, to: null });
              }}
            >
              Сбросить фильтры
            </p>
          ) : null}
        </div>
      )}
    </>
  );
};

export default FilterHeader;
