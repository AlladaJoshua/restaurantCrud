import { useState } from "react";

const useTableSelection = (initialData, setData) => {
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    const newData = initialData.map((item) => ({
      ...item,
      selected: newSelectAll,
    }));
    setData(newData);
  };

  const handleSelectItem = (id) => {
    const newData = initialData.map((item) =>
      item.id === id ? { ...item, selected: !item.selected } : item
    );
    setData(newData);
  };

  return { selectAll, handleSelectAll, handleSelectItem };
};

export default useTableSelection;
