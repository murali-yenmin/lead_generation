import { SearchProps } from '../interfaces/components';
import SearchIcon from './Images/Search';

export const Search = ({ onChange, placeholder = 'search', value }: SearchProps) => {
  return (
    <div className="search-field">
      <input
        type="text"
        className="search"
        value={value}
        placeholder={placeholder}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          onChange(e);
        }}
      />
      <div className="icon">
        <SearchIcon />
      </div>
    </div>
  );
};
