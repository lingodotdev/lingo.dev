import { useState } from 'react';

function DateFilter({ onFilterChange, onClearFilters }) {
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: ''
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Only apply filter if both dates are set or if we're clearing
    if (value === '' || (key === 'startDate' && filters.endDate) || (key === 'endDate' && filters.startDate)) {
      onFilterChange(newFilters);
    }
  };

  const handleClear = () => {
    const clearedFilters = { startDate: '', endDate: '' };
    setFilters(clearedFilters);
    onClearFilters();
  };

  const isFilterActive = filters.startDate || filters.endDate;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="flex flex-col md:flex-row md:items-end gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Filter by Date</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From Date
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To Date
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
        
        {isFilterActive && (
          <button
            onClick={handleClear}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors duration-200 whitespace-nowrap"
          >
            Clear Filters
          </button>
        )}
      </div>
      
      {isFilterActive && (
        <div className="mt-2 text-sm text-gray-600">
          Showing results from {filters.startDate || 'the beginning'} to {filters.endDate || 'now'}
        </div>
      )}
    </div>
  );
}

export default DateFilter;