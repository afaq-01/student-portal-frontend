// App.jsx
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import "./index.css";

import Context from "./Config/Context";
import Dash_Board from "./Pages/Dash_Board";
import NewStudent from "./Pages/New_student";
import Header from "./Pages/Header";
import Login from "./Pages/Login";

// Initial student data
const initialData = [
  {
    name: "Ali",
    id: "cs-2025-01",
    semester_1: { English: 39, Maths: 72 },
    Fee: { semester_1: true },
    Fine: 200,
  },
  {
    name: "Ahmad",
    id: "cs-2025-02",
    semester_1: { English: 45, Maths: 50 },
    Fee: { semester_1: false },
    Fine: 100,
  },
];

export default function App() {
  // Safe localStorage handling
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem("studentData");
      return saved ? JSON.parse(saved) : initialData;
    } catch (err) {
      console.warn("Invalid localStorage data, using initialData.");
      return initialData;
    }
  });

  const [search, setSearch] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem("studentData", JSON.stringify(data));
  }, [data]);

  // Currently selected student
  const selectedStudent = data.find((s) => s.id === selectedStudentId) || null;

  // Filtered data based on search
  const filteredData = data.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toLowerCase().includes(search.toLowerCase())
  );

  const contextValue = {
    data: filteredData,
    fullData: data,
    setData,
    search,
    setSearch,
    selectedStudent,
    setSelectedStudentId,
    Total: data.length,
  };

  return (
    <Context.Provider value={contextValue}>
      <BrowserRouter>
        {/* Signed-in layout */}
        <SignedIn>
          <Header />
          <Routes>
            <Route path="/" element={<Dash_Board />} />
            <Route path="/new-student" element={<NewStudent />} />
          </Routes>
        </SignedIn>

        {/* Signed-out layout */}
        <SignedOut>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<RedirectToSignIn />} />
          </Routes>
        </SignedOut>
      </BrowserRouter>
    </Context.Provider>
  );
}
