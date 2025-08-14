import axios from "axios";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

export const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const [data, setData] = useState([]);

  const fetchAllProducts = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/product");
      const productsData = res.data.products || res.data; // adjust if API returns directly
      console.log(productsData);
      setData(productsData);
    } catch (error) {
      console.error("❌ Error fetching products:", error);
    }
  };

  // Memoize category/brand lists — update only when `data` changes
  const getUniqueValues = (data, key) => {
    const values = data?.map(item => item[key]);
    return ["All", ...new Set(values)];
  };

  const categoryOnlyData = useMemo(() => getUniqueValues(data, "category"), [data]);
  const brandOnlyData = useMemo(() => getUniqueValues(data, "brand"), [data]);

  // Optional: fetch on mount
  useEffect(() => {
    fetchAllProducts();
  }, []);

  return (
    <DataContext.Provider value={{ data, setData, fetchAllProducts, categoryOnlyData, brandOnlyData }}>
      {children}
    </DataContext.Provider>
  );
};

export const getData = () => useContext(DataContext);
