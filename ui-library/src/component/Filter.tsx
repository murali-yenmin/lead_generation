import React, {
  useState,
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
  SetStateAction,
  Dispatch,
} from 'react';
import FilterIcon from '../assets/FilterIcon';
import { Button } from './Button';
import ResetIcon from '../assets/ResetIcon';
import { CheckBoxInput } from './CheckBoxInput';
import { useOutsideClick } from '../utils/useOutsideClick';

type FilterState = Record<string, string[]>;

interface FilterProps {
  filtersData: Record<string, string[]>;
  handleExport: (e: Record<string, string[]>) => void;
  active?: boolean;
  setFilterActive?: Dispatch<SetStateAction<boolean>>;
}

const pageConst = {
  filterActive: '#834934',
  filterDeActive: '#747474',
};

const Filter = forwardRef(
  ({ filtersData, handleExport, active = false, setFilterActive }: FilterProps, ref) => {
    const [isDropdownOpen, setDropdownOpen] = useState<boolean>(false);
    const [tempFilters, setTempFilters] = useState<FilterState>({});
    const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

    const buttonRef = useRef<HTMLButtonElement>(null);
    const iconRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = () => {
      setDropdownOpen((prev) => {
        const newState = !prev;

        if (newState && buttonRef.current && dropdownRef.current) {
          const button = buttonRef.current;
          const spacing = 8;

          const buttonOffsetTop = button.offsetTop;
          const buttonOffsetLeft = button.offsetLeft;
          const buttonHeight = button.offsetHeight;
          const top = buttonOffsetTop + buttonHeight + spacing;
          const left = buttonOffsetLeft;

          setDropdownStyle({
            position: 'absolute',
            top: `${top}px`,
            left: `${left}px`,
            zIndex: 1000,
          });
        }

        return newState;
      });
    };

    const resetFilters = () => {
      if (iconRef.current && !iconRef.current.classList.contains('spin-slow')) {
        iconRef.current.classList.add('spin-slow');
      }
      setTempFilters({});
      setFilterActive?.(false);
      setTimeout(() => {
        if (iconRef.current) {
          iconRef.current.classList.remove('spin-slow');
        }
      }, 800);
    };

    const applyFilters = () => {
      setDropdownOpen(false);
      handleExport(tempFilters);
    };

    const handleCheckboxChange = (category: string, option: string) => {
      setTempFilters((prev) => {
        const prevOptions = prev[category] || [];
        return {
          ...prev,
          [category]: prevOptions.includes(option)
            ? prevOptions.filter((item) => item !== option)
            : [...prevOptions, option],
        };
      });
    };

    const getAppliedFilterCount = (): number =>
      Object.values(tempFilters).reduce((acc, arr) => acc + arr.length, 0);

    useImperativeHandle(ref, () => ({
      resetFilters,
    }));

    useOutsideClick(dropdownRef, () => setDropdownOpen(false), [buttonRef]);

    return (
      <div className={`filter-btn`} style={{ position: 'relative' }}>
        <button ref={buttonRef} onClick={toggleDropdown} title="Filter options">
          <FilterIcon color={`${active ? pageConst.filterActive : pageConst.filterDeActive}`} />
        </button>

        {isDropdownOpen && (
          <div className="dropdown-panel" ref={dropdownRef} style={dropdownStyle}>
            <div className="dropdown-header">
              <div className="dropdown-title">
                <h4 style={{ margin: 0 }}>Filter</h4>
                <span>{getAppliedFilterCount()}</span>
              </div>
              <button className="reset-btn" onClick={resetFilters} title="Refresh">
                <div ref={iconRef}>
                  <ResetIcon />
                </div>
              </button>
            </div>

            <div className="dropdown-body">
              {Object.entries(filtersData).map(([category, options]) => (
                <div key={category} className="filter-group">
                  <h6>{category}</h6>
                  <div>
                    {options.map((option) => (
                      <label
                        key={option}
                        className={`option-list ${
                          (tempFilters[category] || []).includes(option) ? 'active' : ''
                        }`}
                      >
                        <CheckBoxInput
                          checked={(tempFilters[category] || []).includes(option)}
                          onChange={() => handleCheckboxChange(category, option)}
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="dropdown-footer">
              <Button label="Cancel" variant="secondary" onClick={() => setDropdownOpen(false)} />
              <Button label="Apply" onClick={applyFilters} />
            </div>
          </div>
        )}
      </div>
    );
  },
);

export default Filter;
