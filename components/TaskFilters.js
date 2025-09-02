export default function TaskFilters({ 
  status, 
  search, 
  onStatusChange, 
  onSearchChange 
}) {
  return (
    <div className="task-filters">
      <div className="filter-group">
        <label htmlFor="status-filter" className="filter-label">
          Filter by Status:
        </label>
        <select
          id="status-filter"
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Tasks</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="search-input" className="filter-label">
          Search Tasks:
        </label>
        <input
          id="search-input"
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search title or description..."
          className="search-input"
        />
      </div>

      <style jsx>{`
        .task-filters {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 2rem;
          padding: 1rem;
          background: #f8f9fa;
          border-radius: 8px;
          border: 1px solid #e9ecef;
          flex-wrap: wrap;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          min-width: 200px;
          flex: 1;
        }

        .filter-label {
          font-weight: 600;
          color: #495057;
          font-size: 0.9rem;
        }

        .filter-select,
        .search-input {
          padding: 0.5rem;
          border: 1px solid #ced4da;
          border-radius: 4px;
          font-size: 1rem;
          transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
        }

        .filter-select:focus,
        .search-input:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
        }

        .search-input {
          min-width: 250px;
        }

        @media (max-width: 768px) {
          .task-filters {
            flex-direction: column;
            gap: 1rem;
          }

          .filter-group {
            min-width: auto;
          }

          .search-input {
            min-width: auto;
          }
        }
      `}</style>
    </div>
  );
}
