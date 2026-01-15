import { useContext } from "react";
import Context from "../Config/Context";
import {
  UserCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";

export default function StudentList() {
  const {
    data,
    search,
    setSearch,
    selectedStudent,
    setSelectedStudentId,
    setData,
  } = useContext(Context);

  const handleDelete = (e, id) => {
    e.stopPropagation(); // ✅ prevent selecting student

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );
    if (!confirmDelete) return;

    setData((prev) => prev.filter((stu) => stu.id !== id));

    // ✅ clear selection if deleted student was selected
    if (selectedStudent?.id === id) {
      setSelectedStudentId(null);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow w-full md:w-1/3 flex flex-col h-[600px]">
      <h2 className="text-lg font-semibold mb-4">Students</h2>

      {/* Search */}
      <input
        type="text"
        className="border p-2 rounded w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Search by Name or Roll No"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Student List */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {data.length === 0 ? (
          <p className="text-gray-500 text-sm text-center mt-6">
            No students found
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {data.map((student) => (
              <div
                key={student.id}
                onClick={() => setSelectedStudentId(student.id)}
                className={`flex items-center justify-between p-3 rounded cursor-pointer transition
                  ${
                    selectedStudent?.id === student.id
                      ? "bg-blue-100 border border-blue-500"
                      : "hover:bg-gray-100"
                  }`}
              >
                {/* Left */}
                <div className="flex items-center gap-3">
                  <UserCircleIcon className="h-10 w-10 text-blue-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold">{student.name}</h3>
                    <p className="text-sm text-gray-500">{student.id}</p>
                  </div>
                </div>

                {/* Delete Icon */}
                <TrashIcon
                  onClick={(e) => handleDelete(e, student.id)}
                  className="h-5 w-5 text-red-500 hover:text-red-700 cursor-pointer"
                  title="Delete Student"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
