import { createContext, useContext, useState } from "react";

const FilterContext = createContext();

export const FilterProvider = ({ children }) => {
  const [search, setSearch] = useState("");

  // Empty means no category filter selected
  const [category, setCategory] = useState("");

  return (
    <FilterContext.Provider
      value={{
        search,
        setSearch,
        category,
        setCategory,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => {
  return useContext(FilterContext);
};
