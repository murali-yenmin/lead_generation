import { tableHeadProps } from '../../interfaces/table';
import { distributeColumnWidths } from '../../utils/tableColumnsDistributeWidths';
import { CheckBoxInput } from '../CheckBoxInput';
import AscendingIcon from '../Images/AscendingIcon';
import DescendingIcon from '../Images/DescendingIcon';
import SortIcon from '../Images/SortIcon';

const TableHead = ({
  columns,
  tableName,
  setSort,
  sort,
  onSelectAll,
  selectedRows,
  isSelected,
  data,
  defaultSort,
  isExpanded,
}: tableHeadProps) => {
  const getSort = (fieldName: string) => {
    if (sort?.value === '' || sort?.field !== fieldName) return <SortIcon />;
    else if (sort?.value === 'ascending') return <AscendingIcon />;
    else if (sort?.value === 'descending') return <DescendingIcon />;
  };

  const handleSort = (fieldName: string) => {
    if (fieldName === sort?.field && setSort) {
      if (sort?.value === '') {
        setSort({ value: 'ascending', field: sort?.field });
      } else if (sort?.value === 'ascending') {
        setSort({ value: 'descending', field: sort?.field });
      } else if (sort?.value === 'descending') {
        setSort({ value: '', field: defaultSort || '' });
      }
    } else {
      if (setSort) setSort({ value: 'ascending', field: fieldName });
    }
  };

  return (
    <div className="table-header">
      {isSelected && (
        <div className="table-header-cell sticky-column">
          <CheckBoxInput
            isHeader
            checked={
              selectedRows &&
              data?.length > 0 &&
              selectedRows?.length > 0 &&
              data.every((d) => selectedRows.some((s) => JSON.stringify(s) === JSON.stringify(d)))
            }
            indeterminate={
              selectedRows &&
              data?.length > 0 &&
              selectedRows?.length > 0 &&
              !data.every((d) =>
                selectedRows.some((s) => JSON.stringify(s) === JSON.stringify(d)),
              ) &&
              data.some((d) => selectedRows.some((s) => JSON.stringify(s) === JSON.stringify(d)))
            }
            onChange={onSelectAll}
          />
        </div>
      )}
      {isExpanded && <div className="table-header-cell expanded-arrow sticky-column" />}
      {distributeColumnWidths(columns)?.map((column, index) => {
        return (
          <div
            className={`table-header-cell ${column?.cellClassName || ''} ${
              column?.thClassName || ''
            } 
              ${column?.fixed ? 'sticky-column' : ''}`}
            style={{
              position: column?.fixed ? 'sticky' : 'relative',
              zIndex: column?.fixed ? 2 : 1,
              width: column?.width ? column?.width : '100%',
              left: column?.fixed ? column?.left : 'unset',
            }}
            key={`${tableName}-table-header-${column?.name}-${index}`}
          >
            <div className={`cell ${column?.isSort ? 'sortIcon' : ''}`}>
              <span
                onClick={() => {
                  column?.isSort && handleSort(column?.accessField);
                }}
              >
                {column?.th ? column?.th({ column }) : column?.name}
              </span>
              {column?.isSort && (
                <span className="sort-icon" onClick={() => handleSort(column?.accessField)}>
                  {getSort(column?.accessField)}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TableHead;
