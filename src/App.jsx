import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Table from "./components/Table";
import Form from "./components/Form";

function App() {
  const [editingItemId, setEditingItemId] = useState(null);

  const handleEditItem = (id) => {
    setEditingItemId(id);
  };

  return (
    <>
      <header>
        <Navbar />
      </header>
      <main>
        <Form
          key={editingItemId}
          editingItemId={editingItemId}
          setEditingItemId={setEditingItemId}
        />
        <Table onEditItem={handleEditItem} />
      </main>
    </>
  );
}

export default App;
