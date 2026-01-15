import { useContext, useEffect, useState } from "react";
import Context from "../Config/Context";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

export default function StudentDetails() {
  const { selectedStudent, setSelectedStudent, data, setData } =
    useContext(Context);

  const [activeTab, setActiveTab] = useState("semester");
  const [marksData, setMarksData] = useState({});
  const [feeData, setFeeData] = useState({});
  const [fineData, setFineData] = useState(0);
  const [message, setMessage] = useState(""); // ✅ success message

  /* ================= INIT DATA ================= */
  useEffect(() => {
    if (!selectedStudent) return;

    const semesters = Object.keys(selectedStudent)
      .filter((key) => key.startsWith("semester_"))
      .reduce((acc, key) => {
        acc[key] = selectedStudent[key];
        return acc;
      }, {});

    setMarksData(semesters);
    setFeeData(selectedStudent.Fee || {});
    setFineData(selectedStudent.Fine || 0);
  }, [selectedStudent]);

  if (!selectedStudent) {
    return (
      <div className="bg-white p-6 rounded shadow flex-1 flex items-center justify-center text-gray-500">
        Select a student to view records
      </div>
    );
  }

  /* ================= HANDLERS ================= */
  const handleMarkChange = (sem, subject, value) => {
    setMarksData((prev) => ({
      ...prev,
      [sem]: {
        ...prev[sem],
        [subject]: Number(value),
      },
    }));
  };

  const toggleFee = (sem) => {
    setFeeData((prev) => ({ ...prev, [sem]: !prev[sem] }));
  };

  /* ================= SAVE FUNCTIONS ================= */
  const updateStudent = (updatedFields, msg) => {
    setData((prev) =>
      prev.map((stu) =>
        stu.id === selectedStudent.id ? { ...stu, ...updatedFields } : stu
      )
    );

    setSelectedStudent((prev) => ({ ...prev, ...updatedFields }));

    // ✅ show success message for 2 seconds
    setMessage(msg);
    setTimeout(() => setMessage(""), 2000);
  };

  const saveMarks = () => updateStudent(marksData, "Student marks updated successfully!");
  const saveFee = () => updateStudent({ Fee: feeData }, "Student fee updated successfully!");
  const saveFine = () => updateStudent({ Fine: fineData }, "Student fine updated successfully!");

  /* ================= UI ================= */
  return (
    <div className="bg-white p-6 rounded shadow flex-1 overflow-hidden relative">
      <h2 className="text-lg font-semibold mb-4">
        {selectedStudent.name} ({selectedStudent.id})
      </h2>

      {/* Success message */}
      {message && (
        <div className="absolute top-4 right-4 bg-green-100 text-green-800 px-4 py-2 rounded shadow">
          {message}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-3 mb-4 border-b pb-2 flex-wrap">
        {["semester", "fee", "fine"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded font-medium capitalize transition
              ${
                activeTab === tab
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Scroll Area */}
      <div className="max-h-[500px] overflow-y-auto no-scrollbar pr-2">
        {/* ================= SEMESTERS ================= */}
        {activeTab === "semester" && (
          <>
            {Object.entries(marksData).map(([semester, subjects], idx, arr) => (
              <div key={semester} className="mb-6">
                <h3 className="font-bold text-lg mb-3 capitalize">
                  {semester.replace("_", " ")}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(subjects).map(([subject, marks]) => (
                    <div
                      key={subject}
                      className={`flex justify-between items-center border p-3 rounded
                        ${marks < 50 ? "bg-red-50 border-red-400" : "border-gray-200"}`}
                    >
                      <span>{subject}</span>

                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={marks}
                          onChange={(e) =>
                            handleMarkChange(semester, subject, e.target.value)
                          }
                          className="w-16 border rounded text-center"
                        />
                        {marks < 50 && (
                          <span className="text-red-600 font-semibold">FAIL</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {idx < arr.length - 1 && <hr className="mt-4 border-black" />}
              </div>
            ))}

            <button
              onClick={saveMarks}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Update Marks
            </button>
          </>
        )}

        {/* ================= FEE ================= */}
        {activeTab === "fee" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(feeData).map(([sem, status]) => (
                <div
                  key={sem}
                  className="flex justify-between items-center border p-3 rounded"
                >
                  <span className="capitalize">{sem.replace("_", " ")}</span>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={status}
                      onChange={() => toggleFee(sem)}
                    />
                    {status && (
                      <CheckCircleIcon className="h-5 w-5 text-green-600" />
                    )}
                    <span
                      className={`font-semibold ${
                        status ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {status ? "Paid" : "Unpaid"}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={saveFee}
              className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
            >
              Update Fee
            </button>
          </>
        )}

        {/* ================= FINE ================= */}
        {activeTab === "fine" && (
          <>
            <div className="border p-4 rounded flex items-center gap-4 mb-4">
              <span>Total Fine:</span>
              <input
                type="number"
                value={fineData}
                onChange={(e) => setFineData(Number(e.target.value))}
                className="border rounded w-24 text-center"
              />
              <span className="text-red-600 font-semibold">Rs</span>
            </div>

            <button
              onClick={saveFine}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Update Fine
            </button>
          </>
        )}
      </div>
    </div>
  );
}
