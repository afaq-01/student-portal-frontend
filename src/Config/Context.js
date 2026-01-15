import { createContext } from "react";

const Context = createContext({
  data: [],
  setData: () => {},
  search: "",
  setSearch: () => {},
  selectedStudent: null,
  setSelectedStudentId: () => {},
  Total: 0,
});

export default Context;
