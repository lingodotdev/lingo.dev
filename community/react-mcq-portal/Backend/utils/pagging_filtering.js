class SimplePaginationFilteration {
  constructor(model, queryString, baseFilter = {}) {
    this.model = model;
    this.queryString = queryString;
    this.baseFilter = baseFilter;
    this.pagination = {};
    this.sortField = '';
  }

  // Build date filter for date-only (no time) filtering
  buildDateFilter(dateField = 'createdAt') {
    const { startDate, endDate } = this.queryString;
    const dateFilter = {};

    if (startDate || endDate) {
      dateFilter[dateField] = {};
      
      if (startDate) {
        // Start of the day for startDate
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        dateFilter[dateField].$gte = start;
      }
      
      if (endDate) {
        // End of the day for endDate
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        dateFilter[dateField].$lte = end;
      }
    }

    return dateFilter;
  }

  async paginate() {
    const page = parseInt(this.queryString.page, 10) || 1;
    const limit = parseInt(this.queryString.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Build final filter with base filter and date filter
    const dateFilter = this.buildDateFilter();
    const finalFilter = {
      ...this.baseFilter,
      ...dateFilter
    };

    // Get total count
    const total = await this.model.countDocuments(finalFilter);
    
    // Get paginated data
    const data = await this.model
      .find(finalFilter)
      .sort(this.sortField)
      .skip(skip)
      .limit(limit);

    // Set pagination info
    this.pagination = {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalResults: total,
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1,
      nextPage: page < Math.ceil(total / limit) ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
      limit
    };

    this.data = data;
    return this;
  }

  getPaginationInfo() {
    return this.pagination;
  }

  getData() {
    return this.data;
  }
}

module.exports = SimplePaginationFilteration;