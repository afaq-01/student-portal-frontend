import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";
import axios from "axios";

export default function NewStudent() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();

  /* ---------- Access Control ---------- */
  if (!user || user.publicMetadata.role !== "admin") {
    return (
      <div className="h-screen flex items-center justify-center text-xl font-semibold">
        Access Denied
      </div>
    );
  }

  /* ---------- Basic Info ---------- */
  const [name, setName] = useState("");
  const [rollId, setRollId] = useState("");
  const [email, setEmail] = useState("");
  const [photo, setPhoto] = useState(null);

  /* ---------- Academic Data ---------- */
  const [semesters, setSemesters] = useState([
    {
      name: "semester_1",
      subjects: [{ name: "English", marks: 0 }],
    },
  ]);

  /* ---------- Fee Status (OBJECT) ---------- */
  const [fee, setFee] = useState({
    semester_1: false,
  });

  /* ---------- Photo Upload ---------- */
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result);
    reader.readAsDataURL(file);
  };

  /* ---------- Semester Logic ---------- */
  const addSemester = () => {
    const semName = `semester_${semesters.length + 1}`;

    setSemesters((prev) => [
      ...prev,
      { name: semName, subjects: [] },
    ]);

    setFee((prev) => ({
      ...prev,
      [semName]: false,
    }));
  };

  const addSubject = (semIndex) => {
    setSemesters((prev) => {
      const updated = [...prev];
      updated[semIndex].subjects.push({ name: "", marks: 0 });
      return updated;
    });
  };

  const updateSubject = (semIndex, subIndex, key, value) => {
    setSemesters((prev) => {
      const updated = [...prev];
      updated[semIndex].subjects[subIndex][key] =
        key === "marks" ? Number(value) : value;
      return updated;
    });
  };

  const toggleFee = (semName) => {
    setFee((prev) => ({
      ...prev,
      [semName]: !prev[semName],
    }));
  };

  /* ---------- Submit ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = await getToken();

      const payload = {
        name,
        rollId,
        email,
        photo,
        fee,
        semesters: semesters.map((sem) => ({
          name: sem.name,
          subjects: sem.subjects.map((sub) => ({
            name: sub.name,
            marks: Number(sub.marks) || 0,
          })),
        })),
      };

      await axios.post("https://student-portal-five-drab.vercel.app/api/admin/create-student", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Student created successfully");
      navigate("/");
    } catch (err) {
      console.error(err.response?.data || err);
      alert("Failed to create student");
    }
  };

  /* ---------- UI ---------- */
  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-blue-600">
          Create New Student
        </h2>

        {/* Photo */}
        <div className="flex flex-col items-center gap-3">
          {photo ? (
            <img
              src={photo}
              alt="Student"
              className="w-32 h-32 rounded-full object-cover"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
              Photo
            </div>
          )}
          <input type="file" accept="image/*" onChange={handlePhotoUpload} />
        </div>

        {/* Basic Info */}
        <div className="grid md:grid-cols-2 gap-4">
          <input
            required
            placeholder="Student Name"
            className="border p-3 rounded-lg"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            required
            placeholder="Roll ID"
            className="border p-3 rounded-lg"
            value={rollId}
            onChange={(e) => setRollId(e.target.value)}
          />
          <input
            required
            type="email"
            placeholder="Student Email"
            className="border p-3 rounded-lg md:col-span-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Semesters */}
        {semesters.map((sem, semIndex) => (
          <div key={sem.name} className="border rounded-xl p-4">
            <div className="flex justify-between mb-2">
              <h3 className="font-semibold">
                {sem.name.replace("_", " ").toUpperCase()}
              </h3>
              <button
                type="button"
                onClick={() => addSubject(semIndex)}
                className="text-blue-600 text-sm font-semibold"
              >
                + Add Subject
              </button>
            </div>

            {sem.subjects.map((sub, subIndex) => (
              <div key={subIndex} className="flex gap-2 mb-2">
                <input
                  placeholder="Subject Name"
                  className="border p-2 rounded flex-1"
                  value={sub.name}
                  onChange={(e) =>
                    updateSubject(
                      semIndex,
                      subIndex,
                      "name",
                      e.target.value
                    )
                  }
                />
                <input
                  type="number"
                  placeholder="Marks"
                  className="border p-2 rounded w-24"
                  value={sub.marks}
                  onChange={(e) =>
                    updateSubject(
                      semIndex,
                      subIndex,
                      "marks",
                      e.target.value
                    )
                  }
                />
              </div>
            ))}

            <label className="flex items-center gap-2 mt-3">
              <input
                type="checkbox"
                checked={fee[sem.name] || false}
                onChange={() => toggleFee(sem.name)}
              />
              <span className="font-medium">Fee Paid</span>
            </label>
          </div>
        ))}

        {/* Actions */}
        <div className="flex justify-between gap-4">
          <button
            type="button"
            onClick={addSemester}
            className="bg-gray-200 px-4 py-2 rounded-lg font-semibold"
          >
            + Add Semester
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold"
          >
            Create Student
          </button>
        </div>
      </form>
    </div>
  );
}
