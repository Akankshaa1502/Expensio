import { HiOutlineSearch } from 'react-icons/hi';

export default function SearchBar({ value, onChange }) {
  return (
    <div className="search-wrapper">
      <HiOutlineSearch className="search-icon" />
      <input
        id="search-transactions"
        className="search-input"
        type="text"
        placeholder="Search by title or notes..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
