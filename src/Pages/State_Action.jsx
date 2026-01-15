import { UsersIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import { useContext } from "react";
import { Link } from "react-router-dom";
import Context from "../Config/Context";

export default function Stats() {
  const { Total } = useContext(Context);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
      
      {/* Banner - FIRST */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-lg shadow flex flex-col justify-center items-start hover:scale-102 transition-transform">
        <h2 className="text-xl md:text-2xl font-bold mb-2">
          Welcome to Student Dashboard
        </h2>
        <p className="text-sm md:text-base opacity-90">
          Manage students, track marks, fees, and fines easily.
        </p>
        <span className="mt-4 bg-white text-blue-600 px-3 py-1 rounded font-semibold text-sm">
          Dashboard Info
        </span>
      </div>

      {/* Total Students - SECOND */}
      <div className="bg-white p-6 rounded-lg shadow flex gap-4 items-center hover:scale-102 transition-transform">
        <UsersIcon className="h-10 w-10 text-blue-600" />
        <div>
          <p className="text-gray-500 text-sm">Total Students</p>
          <h2 className="text-3xl font-bold">{Total}</h2>
        </div>
      </div>

      {/* Create Student - THIRD */}
      <div className="bg-white p-6 rounded-lg shadow flex justify-between items-center hover:scale-102 transition-transform">
        <div className="flex gap-2 items-center text-gray-600">
          <UserPlusIcon className="h-8 w-8 text-blue-600" />
          <span className="text-sm font-medium">Create Student</span>
        </div>

        <Link to="/new-student">
          <button className="bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-2 rounded text-sm">
            Create
          </button>
        </Link>
      </div>
    </div>
  );
}
