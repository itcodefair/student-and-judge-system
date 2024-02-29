const filterRow = (rows: any[], selectedYear, query, selectedFilter) => {
  if (selectedYear) {
    const year = parseInt(selectedYear, 10);
    rows = rows.filter((item) => {
      return new Date(item.createdDate).getFullYear() === year;
    });
  }
  if (query.trim() === "") {
    return rows;
  }
  return rows.filter((item) => {
    if (!selectedFilter) {
      for (const key in item) {
        if (key !== "_id" && item.hasOwnProperty(key)) {
          const columnValue = item[key];
          if (typeof columnValue === "string" && columnValue.includes(query)) {
            return true;
          }
        }
      }
      return false;
    } else {
      const columnValue = item[selectedFilter];
      return columnValue.includes(query);
    }
  });
};

export default filterRow;
