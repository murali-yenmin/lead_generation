import TableHead from './TableHead';
import TableBody from './TableBody';
import {
  DataPerPageOptionsProps,
  FilterItem,
  FilterOutput,
  QueryProps,
  TableProps,
} from '../../interfaces/table';
import DataPerPage from './DataPerPage';
import { Pagination } from './Pagination/Pagination';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Search } from '../Search';
import TableReset from '../../assets/TableReset';
import Filter from '../Filter';
import { DateRangeInput } from '../DateRangeInput';
import { PreLoader } from '../../assets/PreLoader';
import { debounce } from 'lodash';

const pageConst = {
  filter: 'eq',
};

export const Table = ({
  columns,
  data,
  tableName,
  sort,
  setSort,
  currentPage = 0,
  setCurrentPage,
  isPagination,
  totalCount = 0,
  customPageSize,
  pageSize = '10',
  setPageSize,
  isExpanded = false,
  rowSubComponent = null,
  tableWidth,
  enableScrollX,
  minWidth,
  isSelected = false,
  onSelectedRowsChange,
  filterSection = true,
  searchable = true,
  filter,
  searchableFields = [],
  searchPlaceholder,
  setFilter,
  customFilter,
  filterOption = true,
  filterList,
  defaultSort,
  scrollTop = true,
  isDateFilter = false,
  defaultDate,
  daterange,
  setDateRange,
  preLoader = false,
  minDate,
  maxDate,
}: TableProps & { preLoader?: boolean }) => {
  const iconRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<{ resetFilters: () => void }>();

  const [selectedRows, setSelectedRows] = useState<any>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [filterActive, setFilterActive] = useState<boolean>(false);
  const startRecord = (currentPage - 1) * Number(pageSize) + 1;
  const endRecord = Math.min(currentPage * Number(pageSize), totalCount);

  const handleSelectRow = (rowKey: string) => {
    // Find the corresponding row data based on the rowKey
    const rowData = data.find((item, index) => `${tableName}-body-data-${index}` === rowKey);

    if (!rowData) return; // In case the rowData is not found, do nothing

    setSelectedRows((prevSelectedRows: any) => {
      const rowIsSelected = prevSelectedRows.some(
        (selectedRow: any) => selectedRow?.id === rowData?.id, // Assuming each row has a unique `id`
      );

      if (rowIsSelected) {
        // If the row is already selected, deselect it by filtering it out of the selected rows
        return prevSelectedRows.filter((selectedRow: any) => selectedRow?.id !== rowData?.id);
      } else {
        // If the row is not selected, add it to the selected rows
        return [...prevSelectedRows, rowData];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedRows.length === data.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(data);
    }
  };

  useEffect(() => {
    onSelectedRowsChange && onSelectedRowsChange(selectedRows);
  }, [selectedRows]);

  const resetFilter = () => {
    resetDatas();
    filterRef.current?.resetFilters(); // calls child's resetFilters()
    if (iconRef.current && !iconRef.current.classList.contains('spin-slow')) {
      iconRef.current.classList.add('spin-slow');
    }
    if (setFilter) setFilter({ query: [], sort: filter?.sort ?? {} });
    setSearchValue('');
    setTimeout(() => {
      if (iconRef.current) {
        iconRef.current.classList.remove('spin-slow');
      }
    }, 800);
  };

  const filterListOptions = (filterList: FilterItem[]): FilterOutput => {
    const output: FilterOutput = {};

    filterList?.forEach((item) => {
      const key = item.name;
      if (!output[key]) {
        output[key] = [];
      }
      output[key].push(item.label);
    });

    return output;
  };

  // Utility to normalize values to an array
  const normalizeToArray = (val: string | string[] | undefined | null): string[] => {
    if (!val) return [];
    return Array.isArray(val) ? val : [val];
  };

  // Filters and transforms based on the input event object and filterList
  const filterAndTransform = (
    e: Record<string, string[] | string>,
    filterList: FilterItem[],
  ): QueryProps[] => {
    const resultMap: Record<
      string,
      { operation: string; fieldName: string; fieldString: string[] }
    > = {};

    const filtered = filterList?.filter((item: FilterItem) => {
      const selectedValues = normalizeToArray(e[item.name]);
      return selectedValues.includes(item.label);
    });

    filtered?.forEach((item: FilterItem) => {
      const key = item.fieldName;
      const value = item?.value;

      // Only skip if value is undefined or null
      if (value === undefined || value === null) return;

      if (!resultMap[key]) {
        resultMap[key] = {
          operation: item.operation,
          fieldName: item.fieldName,
          fieldString: [value],
        };
      } else {
        resultMap[key].fieldString.push(value);
      }
    });

    return Object.values(resultMap);
  };

  // Compares two field strings or arrays
  const compareFieldStrings = (
    a: string | string[] | undefined,
    b: string | string[] | undefined,
  ): boolean => typeof b === 'string' && (Array.isArray(a) ? a.includes(b) : a === b);

  const getFilterStatus = (updatedQuery: any) => {
    const hasAnyEqOperation = updatedQuery?.some(
      (item: any) => item.operation === pageConst.filter,
    );
    setFilterActive(hasAnyEqOperation);
  };

  // Main function that applies filter transformation and updates the filter state
  const updateFilter = async (e: Record<string, string[] | string>) => {
    const finalTransformed = await filterAndTransform(e, filterList);
    if (filter && setFilter) {
      const filterListFieldNames = filterList.map((f: FilterItem) => f.fieldName);

      const updatedQuery = [
        ...filter.query.filter((q) => {
          const isInFilterList = filterListFieldNames.includes(q.fieldName);
          const isInTransformed = finalTransformed.some(
            (t) => t.fieldName === q.fieldName && compareFieldStrings(t.fieldString, q.fieldString),
          );
          return !isInFilterList || isInTransformed;
        }),

        ...finalTransformed.filter(
          (t) =>
            !filter.query.some(
              (q) =>
                q.fieldName === t.fieldName && compareFieldStrings(t.fieldString, q.fieldString),
            ),
        ),
      ];
      getFilterStatus(updatedQuery);
      setFilter({
        ...filter,
        query: updatedQuery,
      });
    }
  };

  const resetDatas = () => {
    if (setSort) setSort({ value: '', field: defaultSort || '' });
    if (setDateRange && defaultDate) setDateRange(defaultDate);
    setSelectedRows([]);
    getFilterStatus(filter?.query);
  };

  const scrollEvent = () => {
    if (scrollTop) {
      const scrollContainer = document.querySelector('.content');
      if (scrollContainer) {
        scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        if (value === '') {
          setSearchValue('');
          if (setFilter) {
            const searchFieldNames = searchableFields.map((f) => f.fieldName);
            const preservedQuery = filter?.query?.filter(
              (q) => !searchFieldNames.includes(q.fieldName),
            );

            setFilter({
              query: preservedQuery ?? [],
              sort: filter?.sort ?? {},
            });
          }
          return;
        }

        const searchQuery = searchableFields.map((field) => ({
          operation: field.operation ?? '%',
          fieldName: field.fieldName,
          fieldString: value,
        }));

        if (setFilter) {
          const searchFieldNames = searchableFields.map((f) => f.fieldName);

          const preservedQuery =
            filter?.query?.filter((q) => !searchFieldNames.includes(q.fieldName)) ?? [];

          setFilter({
            query: [...preservedQuery, ...searchQuery],
            sort: filter?.sort ?? {},
          });
        }
      }, 500),
    [],
  );

  return (
    <>
      {preLoader && <PreLoader />}
      {filterSection && (
        <div className="table-filter">
          {searchable && (
            <Search
              placeholder={
                searchPlaceholder ||
                `Search by ${searchableFields
                  .map((field) => field.fieldName.split('.').pop()?.replace(/_/g, ' '))
                  .join(', ')}...`
              }
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const value = String(e.target.value ?? '');
                setSearchValue(value);
                debouncedSearch(value);
              }}
              value={searchValue}
            />
          )}
          {isDateFilter && (
            <DateRangeInput
              label="Select Date"
              id="table-date"
              value={daterange}
              onChange={(date) => {
                if (setDateRange && date) setDateRange(date);
              }}
              maxDate={maxDate}
              minDate={minDate}
            />
          )}
          {customFilter}
          {filterOption && (
            <Filter
              ref={filterRef}
              filtersData={filterListOptions(filterList)}
              active={filterActive}
              setFilterActive={setFilterActive}
              handleExport={(e) => {
                updateFilter(e);
              }}
            />
          )}
          <button onClick={resetFilter} title="Refresh">
            <div ref={iconRef}>
              <TableReset />
            </div>
          </button>
        </div>
      )}
      <div
        className="table-wrapper"
        style={{
          overflowX: enableScrollX ? 'auto' : 'hidden',
          paddingBottom: enableScrollX ? '10px' : '0px',
        }}
      >
        <div
          className="table-container"
          style={{
            width: tableWidth ? tableWidth : '-webkit-fill-available',
            minWidth: minWidth ?? '1127px',
          }}
        >
          <TableHead
            sort={sort}
            setSort={setSort}
            columns={columns}
            tableName={tableName}
            selectedRows={selectedRows}
            onSelectAll={handleSelectAll}
            isSelected={isSelected}
            data={preLoader ? [] : data}
            defaultSort={defaultSort}
            isExpanded={isExpanded}
          />
          <TableBody
            data={preLoader ? [] : data}
            columns={columns}
            tableName={tableName}
            isExpanded={isExpanded}
            rowSubComponent={rowSubComponent}
            selectedRows={selectedRows}
            onSelectRow={handleSelectRow}
            isSelected={isSelected}
            onSelectedRowsChange={onSelectedRowsChange}
          />
        </div>
      </div>
      {isPagination === true && data.length > 0 && (
        <div className={`table-footer ${customPageSize ? 'between' : 'center'}`}>
          <div className={'pagination'}>
            <div className="page-info">
              <p>
                Showing{' '}
                <span>
                  ({startRecord} - {endRecord} of {totalCount} records)
                </span>
              </p>
            </div>
            {isPagination &&
              totalCount > 0 &&
              totalCount > Number(pageSize) &&
              Number(pageSize) > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalCount={totalCount}
                  pageSize={Number(pageSize)}
                  onPageChange={(page: number) => {
                    sessionStorage.removeItem('expanded');
                    setCurrentPage(page);
                    scrollEvent();
                  }}
                />
              )}
          </div>
        </div>
      )}
    </>
  );
};
