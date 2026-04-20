import { ALL_CATEGORIES } from '../../utils/categories';

export default function Filters({
  categoryFilter, setCategoryFilter,
  typeFilter, setTypeFilter,
  dateFrom, setDateFrom,
  dateTo, setDateTo,
  sortBy, setSortBy,
}) {
  return (
    <div className="toolbar" style={{ marginTop: 12 }}>
      <select
        id="filter-category"
        className="filter-select"
        value={categoryFilter}
        onChange={e => setCategoryFilter(e.target.value)}
      >
        <option value="all">All Categories</option>
        {ALL_CATEGORIES.map(c => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      <select
        id="filter-type"
        className="filter-select"
        value={typeFilter}
        onChange={e => setTypeFilter(e.target.value)}
      >
        <option value="all">All Types</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      <select
        id="sort-by"
        className="filter-select"
        value={sortBy}
        onChange={e => setSortBy(e.target.value)}
      >
        <option value="date">Sort by Date</option>
        <option value="amount">Sort by Amount</option>
        <option value="category">Sort by Category</option>
      </select>

      <input
        type="date"
        className="filter-select"
        value={dateFrom}
        onChange={e => setDateFrom(e.target.value)}
        placeholder="From"
      />
      <input
        type="date"
        className="filter-select"
        value={dateTo}
        onChange={e => setDateTo(e.target.value)}
        placeholder="To"
      />
    </div>
  );
}
