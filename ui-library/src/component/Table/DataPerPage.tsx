import { DataPerPageOptionsProps, DataPerPageProps } from '../../interfaces/table';
import OutsideClick from '../../utils/outsideClick';
import { useEffect, useRef, useState } from 'react';
import DownArrow from '../Images/DownArrow';

const DataPerPage = ({
  options,
  onSelect,
  value,
  parentClass = '',
  toggleClass = '',
}: DataPerPageProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<DataPerPageOptionsProps>();
  const [search, setSearch] = useState('');
  const [list, setList] = useState<Array<DataPerPageOptionsProps>>([]);

  const wrapperRef = useRef<HTMLUListElement | null>(null);

  const toggling = () => setIsOpen(!isOpen);

  const onOptionClicked = (value: DataPerPageOptionsProps) => () => {
    onSelect(value);
    setSelectedOption(value);
    setIsOpen(false);
    setSearch('');
    setList(options);
  };

  useEffect(() => {
    OutsideClick({ wrapperRef, setIsOpen });

    if (options && options?.length > 0) {
      setList(options);
    } else {
      setList([]);
    }
  }, [options]);

  useEffect(() => {
    if (value) {
      const result = options.filter((item: DataPerPageOptionsProps) => {
        return item?.value === value;
      });
      setSelectedOption(result[0] || { lable: '', value: '' });
    }
  }, [value]);

  return (
    <div className={`dropdown ${parentClass}`}>
      <button type="button" onClick={toggling} className={`dropdown-toggle ${toggleClass}`}>
        {selectedOption?.label}{' '}
        <span>
          <DownArrow />
        </span>
      </button>
      {isOpen && (
        <ul ref={wrapperRef} className="list-wrapper">
          {list?.map((option: DataPerPageOptionsProps) => (
            <li
              className={`list-item ${selectedOption?.value === option?.value ? 'active' : ''}`}
              onClick={onOptionClicked(option)}
              key={option?.value}
            >
              {option?.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DataPerPage;
