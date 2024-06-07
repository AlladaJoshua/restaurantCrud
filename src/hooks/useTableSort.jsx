import { useState } from "react";

const useTableSort = (initialSortState) => {
  const [sortDirection, setSortDirection] = useState(initialSortState);

  const handleSort = (key, data, setData) => {
    const newSortDirection =
      sortDirection[key] === "asc" ? "desc" : "asc";
    setSortDirection({
      ...sortDirection,
      [key]: newSortDirection,
    });

    const sortedData = [...data].sort((a, b) => {
      const isNumericField = [
        "cost",
        "amountStock",
        "remainingStock",
        "price",
      ].includes(key);
      const aValue = isNumericField ? parseFloat(a[key]) : a[key];
      const bValue = isNumericField ? parseFloat(b[key]) : b[key];

      if (aValue < bValue) return newSortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return newSortDirection === "asc" ? 1 : -1;
      return 0;
    });

    setData(sortedData);
  };

  return { sortDirection, handleSort };
};

export default useTableSort;
