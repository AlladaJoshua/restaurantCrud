import { useState, useEffect } from "react";
import { db, collection, getDocs, onSnapshot } from "../back-end/config";

const useFetchData = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "items"));
      const itemsList = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        selected: false,
      }));
      setData(itemsList);
    };

    fetchData();

    const unsubscribe = onSnapshot(collection(db, "items"), () => {
      fetchData();
    });

    return () => unsubscribe();
  }, []);

  return { data, setData };
};

export default useFetchData;
