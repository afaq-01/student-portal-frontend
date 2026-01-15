import { useState, useEffect } from "react";
import Header from "./Header";
import Stats from "./State_Action";
import StudentList from "./Studen_List";
import StudentDetails from "./Student_Detail";
import Footer from "./Footer";
import Context from "../Config/Context";

const initialData = [
  
  {
    name: "Ali",
    id: "cs-2025-01",
    semester_1: { English: 39, Maths: 72, Physics: 78, Chemistry: 65, Urdu: 85 },
    semester_2: { English: 39, Maths: 72, Physics: 78, Chemistry: 65, Urdu: 85 },
    Fee: { semester_1: true, semester_2: true, semester_3: false, semester_4: false },
    Fine: 200,
  },
  {
    name: "Ahmad",
    id: "cs-2025-02",
    semester_1: { English: 45, Maths: 50, Physics: 48, Chemistry: 65, Urdu: 70 },
    semester_2: { Loop: 55, Calculas: 60, Automata: 58, Management: 65, Communication: 85 },
    Fee: { semester_1: true, semester_2: false, semester_3: false, semester_4: false },
    Fine: 100,
  },
];

const Dash_Board = () => {
  
  const [search, setSearch] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  // Load from localStorage
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem("studentData");
    return saved ? JSON.parse(saved) : initialData;
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem("studentData", JSON.stringify(data));
  }, [data]);

  // Derived selected student (SAFE)
  const selectedStudent = data.find((s) => s.id === selectedStudentId) || null;

  // Filtered list
  const filteredData = data.filter(
    (student) =>
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.id.toLowerCase().includes(search.toLowerCase())
  );

  // Context value
  const value = {
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
    <>
    
  
    <Context.Provider value={value}>
      <div className="bg-gray-100 min-h-screen flex flex-col">

        <main className="px-4 md:px-6 flex-1">
          <Stats />

          <div className="flex flex-col md:flex-row gap-6 mt-4">
            <StudentList />
            <StudentDetails />
          </div>
        </main>

        <Footer />
      </div>
    </Context.Provider>
    
  </>

  );
};

export default Dash_Board;
