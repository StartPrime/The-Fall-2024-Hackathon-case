import classes from './FilterHeader.module.scss';

interface IFilterProps {
  filter: boolean;
  filterRef: React.RefObject<HTMLDivElement>;
  onFilter: (filter: string | null) => void;
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
              defaultValue={new Date().toLocaleDateString()}
            ></input>
          </div>
          <div className={classes.changeDate}>
            <input type="date"></input>
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
                onFilter(null);
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
