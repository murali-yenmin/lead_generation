import React, { useState, useEffect, useRef } from 'react';
import Scrollbar from 'smooth-scrollbar';
import OutsideClick from '../utils/outsideClick';
import DownArrow from './Images/DownArrow';
import Search from './Images/Search';
import { SelectDropdownProps, SelectOption } from '../interfaces/formFields';
import { DateRangeInput } from './DateRangeInput';

export const SelectDropdown = ({
  disabled,
  options,
  selectedValues,
  searchable = false,
  multiselect = false,
  placeholder = 'Select option',
  onSelect,
  dateRangeValue,
  onDateRangeChange,
  enableDateRange = false,
  minDate,
  maxDate,
}: SelectDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const scrollbarRef = useRef<HTMLUListElement>(null);

  const toggleDropdown = () => !disabled && setIsOpen(!isOpen);

  useEffect(() => {
    OutsideClick({ wrapperRef, setIsOpen });
    setFilteredOptions(options);
  }, [options]);

  useEffect(() => {
    if (scrollbarRef.current) {
      const scrollbar = Scrollbar.init(scrollbarRef.current);
      return () => scrollbar.destroy();
    }
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);
    setFilteredOptions(options.filter((item) => item.label.toLowerCase().includes(query)));
  };

  const handleSelect = (option: SelectOption) => {
    onSelect(option);
    if (!multiselect) {
      toggleDropdown();
    }
  };

  return (
    <div ref={wrapperRef} className="select-dropdown">
      <button className="label" type="button" onClick={toggleDropdown} disabled={disabled}>
        <span>
          {multiselect
            ? (selectedValues as SelectOption[])?.map((item) => item.label).join(', ') ||
              placeholder
            : (selectedValues as SelectOption)?.label || placeholder}
        </span>
        <DownArrow />
      </button>

      {isOpen && (
        <div className="dropdown-list-wrapper">
          {searchable && (
            <label htmlFor="dropdown-search" className="search-wrapper">
              <input
                id="dropdown-search"
                type="text"
                placeholder="Search..."
                value={search}
                onChange={handleSearch}
                disabled={disabled}
              />
              <Search />
            </label>
          )}
          <ul ref={scrollbarRef}>
            {filteredOptions.map((option) => {
              const isSelected = multiselect
                ? (selectedValues as SelectOption[])?.some((item) => item.value === option.value)
                : (selectedValues as SelectOption)?.value === option.value;

              return (
                <li key={option.value}>
                  <button
                    type="button"
                    className={isSelected ? 'selected' : ''}
                    onClick={() => {
                      handleSelect(option);
                    }}
                  >
                    {multiselect &&
                    (selectedValues as SelectOption[])?.some((item) => item.value === option.value)
                      ? '✔ '
                      : ''}
                    {option.label}
                  </button>
                </li>
              );
            })}
            {enableDateRange && (
              <li className="date-range-li">
                <label className="date-range-label">Custom</label>
                <DateRangeInput
                  label="Select Date"
                  id="table-date"
                  value={dateRangeValue}
                  onChange={(date) => {
                    if (date) {
                      onDateRangeChange?.(date);
                      setIsOpen(false);
                    }
                  }}
                  dateFormat="YYYY-MM-DD"
                  maxDate={maxDate}
                  minDate={minDate}
                />
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
