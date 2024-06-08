import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import "../css/Form.css";
import {
  db,
  collection,
  setDoc,
  getDocs,
  updateDoc,
  doc,
} from "../back-end/config";
import useCustomIDGenerator from "../hooks/useCustomIDGenerator ";

const Form = ({ editingItemId, setEditingItemId }) => {
  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm({});
  const [items, setItems] = useState([]);
  const generateCustomID = useCustomIDGenerator();
  const [isEditing, setIsEditing] = useState(!!editingItemId);

  const onSubmit = async (data) => {
    if (editingItemId) {
      const confirmUpdate = window.confirm(
        "Are you sure you want to update this item?"
      );
      if (confirmUpdate) {
        await saveItem(data);
        resetForm();
      }
    } else {
      await saveItem(data);
      resetForm();
    }
  };

  const saveItem = async (data) => {
    try {
      data.price = parseFloat(data.price).toFixed(2);
      data.cost = parseFloat(data.cost).toFixed(2);

      if (!editingItemId) {
        const customId = `${generateCustomID(data.category)}`;
        const itemDoc = doc(db, "items", customId);
        await setDoc(itemDoc, data);
      } else {
        const itemDoc = doc(db, "items", editingItemId);
        await updateDoc(itemDoc, data);
        setEditingItemId(null);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error adding/updating document: ", error);
    }
  };

  const fetchItems = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "items"));
      const itemsList = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setItems(itemsList);

      if (editingItemId) {
        const editingItem = itemsList.find((item) => item.id === editingItemId);
        if (editingItem) {
          setValue("category", editingItem.category);
          setValue("name", editingItem.name);
          setValue("price", editingItem.price);
          setValue("cost", editingItem.cost);
          setValue("amountStock", editingItem.amountStock);
          setValue("remainingStock", editingItem.remainingStock);
          if (editingItem.category) {
            setValue("size", editingItem.size);
          }
          setIsEditing(true);
        }
      }
    } catch (error) {
      console.error("Error fetching items: ", error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [editingItemId]);

  const category = watch("category");
  const amountStock = watch("amountStock");
  const remainingStock = watch("remainingStock");

  const sizeOptions = {
    Appetizers: ["Small Plate", "Regular Plate", "Large Plate"],
    "Main Course": ["Half Portion", "Regular Portion", "Family Size"],
    Desserts: ["Single Serving", "Shareable", "Large (for group)"],
    Beverages: ["Regular", "Medium", "Large"],
  };

  const handleCancel = () => {
    const confirmCancel = window.confirm(
      isEditing
        ? "Are you sure you want to cancel editing this item?"
        : "Are you sure you want to cancel adding this item?"
    );
    if (confirmCancel) {
      resetForm();
    }
  };

  const resetForm = () => {
    reset();
    setIsEditing(false);
    setEditingItemId(null);
  };

  return (
    <>
      <section className="form-container">
        <div className="header">
          <h2>{isEditing ? "Edit Item" : "Add Item"}</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="input-group-form">
            <label htmlFor="category">Category</label>
            <select {...register("category")} id="category">
              <option value="" disabled hidden>
                -Select Category-
              </option>
              <option value="Appetizers">Appetizers</option>
              <option value="Main Course">Main Course</option>
              <option value="Desserts">Desserts</option>
              <option value="Beverages">Beverages</option>
            </select>
          </div>

          <div className="input-group-form">
            <label htmlFor="name">Name</label>
            <input {...register("name")} id="name" />
          </div>

          {category && (
            <div className="input-group-form">
              <label htmlFor="size">Size</label>
              <select {...register("size")} id="size">
                <option value="" disabled hidden>
                  -Select Size-
                </option>
                {sizeOptions[category].map((size, index) => (
                  <option key={index} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="input-group-form">
            <label htmlFor="price">Price</label>
            <input type="number" step="0.01" {...register("price")} id="price" />
          </div>

          <div className="input-group-form">
            <label htmlFor="cost">Cost</label>
            <input type="number" step="0.01" {...register("cost")} id="cost" />
          </div>

          <div className="input-group-form">
            <label htmlFor="amountStock">Amount of Stock</label>
            <input
              type="number"
              {...register("amountStock", {
                validate: value => parseInt(value) >= parseInt(remainingStock) || "Amount of stock cannot be less than remaining stock"
              })}
              id="amountStock"
            />
            {errors.amountStock && <p className="error">{errors.amountStock.message}</p>}
          </div>

          <div className="input-group-form">
            <label htmlFor="remainingStock">Remaining Stock</label>
            <input
              type="number"
              {...register("remainingStock", {
                validate: value => parseInt(value) <= parseInt(amountStock) || "Remaining stock cannot be greater than amount of stock"
              })}
              id="remainingStock"
            />
            {errors.remainingStock && <p className="error">{errors.remainingStock.message}</p>}
          </div>

          <div className="button-group">
            <button type="submit" className="primary-btn">
              Submit
            </button>
            <button
              type="button"
              className="secondary-btn"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </section>
    </>
  );
};

export default Form;
