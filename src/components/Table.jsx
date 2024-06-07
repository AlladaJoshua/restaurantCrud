import React, { useState, useEffect } from "react";
import "../css/Table.css";
import useFetchData from "../hooks/useFetchData";
import useTableSelection from "../hooks/useTableSelection";
import useTableSort from "../hooks/useTableSort";
import Pagination from "./Pagination ";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import {
  db,
  collection,
  getDocs,
  deleteDoc,
  doc,
  onSnapshot,
} from "../back-end/config";

const Table = ({ onEditItem }) => {
  const { data, setData } = useFetchData();
  const { selectAll, handleSelectAll, handleSelectItem } = useTableSelection(
    data,
    setData
  );
  const { sortDirection, handleSort } = useTableSort({
    name: null,
    size: null,
    category: null,
    cost: null,
    amountStock: null,
    remainingStock: null,
    price: null,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingItemId, setEditingItemId] = useState(null);
  const itemsPerPage = 10;

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "items"), () => {
      fetchData();
    });

    return () => unsubscribe();
  }, []);

  const fetchData = async () => {
    const querySnapshot = await getDocs(collection(db, "items"));
    const itemsList = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
      selected: false,
    }));
    setData(itemsList);
  };

  const handleDelete = async (id) => {
    const item = data.find((item) => item.id === id);
    const confirmDelete = window.confirm(
      `Do you want to delete this item?\nID: ${item.id}\nName: ${item.name}`
    );
    if (confirmDelete) {
      await deleteDoc(doc(db, "items", id));
      fetchData();
    }
  };

  const handleBulkDelete = async () => {
    const selectedItems = data.filter((item) => item.selected);
    const confirmBulkDelete = window.confirm(
      `Do you want to delete these ${selectedItems.length} items?`
    );
    if (confirmBulkDelete) {
      const deletePromises = selectedItems.map((item) =>
        deleteDoc(doc(db, "items", item.id))
      );
      await Promise.all(deletePromises);
      fetchData();
    }
  };

  const handleEdit = (id) => {
    const item = data.find((item) => item.id === id);
    if (item) {
      onEditItem(id, item);
    }
  };

  const filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.size.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredData.slice(startIndex, endIndex);

  const totalSales = data.reduce((acc, item) => {
    const soldQuantity = item.amountStock - item.remainingStock;
    const itemSales = soldQuantity * item.price;
    return acc + itemSales;
  }, 0);

  return (
    <>
      <section className="table-container">
        <div className="header-table">
          <h2>Menu List</h2>
        </div>
        <div className="search-bar-container">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-bar"
          />
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
        </div>
        <div className="table">
          <table>
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                </th>
                <th onClick={() => handleSort("id", data, setData)}>
                  ID {sortDirection.id === "asc" ? "▲" : "▼"}
                </th>
                <th onClick={() => handleSort("category", data, setData)}>
                  Category {sortDirection.category === "asc" ? "▲" : "▼"}
                </th>
                <th onClick={() => handleSort("name", data, setData)}>
                  Name {sortDirection.name === "asc" ? "▲" : "▼"}
                </th>
                <th onClick={() => handleSort("size", data, setData)}>
                  Size {sortDirection.size === "asc" ? "▲" : "▼"}
                </th>
                <th onClick={() => handleSort("cost", data, setData)}>
                  Cost {sortDirection.cost === "asc" ? "▲" : "▼"}
                </th>
                <th onClick={() => handleSort("amountStock", data, setData)}>
                  Amount of Stock{" "}
                  {sortDirection.amountStock === "asc" ? "▲" : "▼"}
                </th>
                <th onClick={() => handleSort("remainingStock", data, setData)}>
                  Remaining Stock{" "}
                  {sortDirection.remainingStock === "asc" ? "▲" : "▼"}
                </th>
                <th onClick={() => handleSort("price", data, setData)}>
                  Price {sortDirection.price === "asc" ? "▲" : "▼"}
                </th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={item.selected}
                        onChange={() => handleSelectItem(item.id)}
                      />
                    </td>
                    <td>{item.id}</td>
                    <td>{item.category}</td>
                    <td>{item.name}</td>
                    <td>{item.size}</td>
                    <td>&#x20B1;{parseFloat(item.cost).toFixed(2)}</td>
                    <td>{item.amountStock}</td>
                    <td>{item.remainingStock}</td>
                    <td>&#x20B1;{parseFloat(item.price).toFixed(2)}</td>
                    <td className="action">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="action-btn delete-btn"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                      <button
                        onClick={() => {
                          handleEdit(item.id);
                        }}
                        className="action-btn edit-btn"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="no-data">
                    No data available
                  </td>
                </tr>
              )}
              {currentItems.length > 0 && (
                <tr>
                  <td colSpan="8" className="total-row">
                    Total Sales
                  </td>
                  <td className="total-row">
                    &#x20B1;
                    {totalSales.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td>
                    <button
                      onClick={handleBulkDelete}
                      className="action-btn delete-btn"
                    >
                      Bulk Delete
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </section>
    </>
  );
};

export default Table;
