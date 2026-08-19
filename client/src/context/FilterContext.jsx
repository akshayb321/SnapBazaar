import { createContext, useContext, useState } from "react";

const FilterContext = createContext();
export const FilterProvider = ({ children }) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  return (
    <FilterContext.Provider
      value={{ search, setSearch, category, setCategory }}
    >
      {children}
    </FilterContext.Provider>
  );
};
export const useFilter = () => {
  return useContext(FilterContext);
};
