import { tableBodyProps } from '../../interfaces/table';
import { useEffect, useState } from 'react';
import { CheckBoxInput } from '../CheckBoxInput';
import { distributeColumnWidths } from '../../utils/tableColumnsDistributeWidths';

const TableBody = ({
  data,
  columns,
  tableName,
  isExpanded,
  rowSubComponent,
  selectedRows,
  onSelectRow,
  isSelected,
}: tableBodyProps) => {
  const expanded = sessionStorage.getItem('expanded');
  const [expandedRow, setExpandedRow] = useState<string[]>(() => {
    const savedExpandedRow = sessionStorage.getItem('expandedRow');
    return expanded ? JSON.parse(expanded) : savedExpandedRow ? JSON.parse(savedExpandedRow) : [];
  });
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);

  const [activeRow, setActiveRow] = useState<number | null>(null);

  const expandedHandler = (e: React.MouseEvent, key: string) => {
    const target = e.target as HTMLElement;
    if (target.closest('.dropdown-btn') || target.closest('.dot-menu')) {
      return;
    }
    setExpandedRow((prev: string[]) => {
      sessionStorage.removeItem('expanded');
      let updatedExpandedRow;
      if (prev.includes(key)) {
        updatedExpandedRow = prev.filter((item) => item !== key);
      } else {
        updatedExpandedRow = [key];
      }
      sessionStorage.setItem('expandedRow', JSON.stringify(updatedExpandedRow));
      return updatedExpandedRow;
    });
  };

  const handleRowSelection = (rowKey: string) => {
    onSelectRow && onSelectRow(rowKey);
  };

  useEffect(() => {
    if (!expanded) setExpandedRow([]);
    sessionStorage.removeItem('expandedRow');
  }, [data]);

  return (
    <div className="table-body-wrapper">
      {data?.length === 0 && (
        <div className="no-more-data" key="no-data">
          <p>No Data</p>
        </div>
      )}
      {data?.map((item, index) => {
        const rowKey = `${tableName}-body-data-${index}`;
        return (
          <div
            className={`table-body-row ${isExpanded ? 'expanded' : ''}  ${
              isExpanded && expandedRow.includes(rowKey) ? 'expanded-row' : ''
            }`}
            key={rowKey}
            onClick={() => setActiveRow(index)}
          >
            <div
              className={`table-body ${isExpanded ? 'cursor-pointer' : ''} ${
                activeRow === index ? 'active-row' : ''
              }`}
              onClick={(e) => {
                isExpanded && expandedHandler(e, rowKey);
              }}
            >
              {isSelected && (
                <div className="table-body-cell sticky-column" key={`${rowKey}-checkbox`}>
                  <CheckBoxInput
                    checked={selectedRows?.some((row: any) => row?.id === item?.id)}
                    onChange={() => handleRowSelection(rowKey)}
                  />
                </div>
              )}

              {isExpanded && (
                <div
                  key={`${rowKey}-arrow`}
                  className={`table-body-cell active-arrow sticky-column ${
                    expandedRow.includes(rowKey) ? 'active' : ''
                  }`}
                >
                  <svg width="15" height="9" viewBox="0 0 15 9" fill="none">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M1.1762 1.04395C1.59865 0.688203 2.2295 0.742276 2.58525 1.16472L7.26098 6.71716C7.35815 6.83254 7.44786 6.85309 7.50006 6.85309C7.55226 6.85309 7.64198 6.83254 7.73914 6.71716L12.4149 1.16472C12.7706 0.742276 13.4015 0.688203 13.8239 1.04395C14.2464 1.3997 14.3004 2.03055 13.9447 2.453L9.26896 8.00543C8.3172 9.13565 6.68292 9.13565 5.73116 8.00543L1.05542 2.453C0.699677 2.03055 0.75375 1.3997 1.1762 1.04395Z"
                      fill="#747474"
                    />
                  </svg>
                </div>
              )}

              {distributeColumnWidths(columns)?.map((column: any, cellIndex) => {
                let parts = column?.accessField.split('.');
                let result = parts && parts.reduce((obj: string, key: number) => obj?.[key], item);

                return (
                  <div
                    className={`table-body-cell ${column?.cellClassName || ''} ${
                      column?.thClassName || ''
                    } ${column?.fixed ? 'sticky-column' : ''}`}
                    style={{
                      position: column?.fixed ? 'sticky' : 'relative',
                      zIndex:
                        column?.fixed ||
                        hoveredCell === `${rowKey}-${column.accessField}-${cellIndex}`
                          ? 1
                          : 0,
                      left: column?.fixed ? column?.left : 'unset',
                      width: column?.width ? column?.width : '100%',
                    }}
                    key={`${rowKey}-${column.accessField}-${cellIndex}`}
                    onMouseEnter={() =>
                      setHoveredCell(`${rowKey}-${column.accessField}-${cellIndex}`)
                    }
                    onMouseLeave={() => setHoveredCell(null)}
                  >
                    <div className="cell">
                      {column?.td ? column?.td({ row: item }, index, data) : result}
                    </div>
                  </div>
                );
              })}
            </div>

            {isExpanded && (
              <div
                key={`${rowKey}-expanded`}
                className={`${expandedRow.includes(rowKey) ? 'table-body-expanded' : ''}`}
              >
                {expandedRow.includes(rowKey) && rowSubComponent && rowSubComponent(item)}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TableBody;
