import { AcademicCapIcon } from "@heroicons/react/24/solid";
import { useClerk, useUser, UserProfile } from "@clerk/clerk-react";
import { useState } from "react";
import { Link, Routes, Route } from "react-router-dom";

export default function Header() {
  const { signOut } = useClerk();
  const { user } = useUser();

  const handleLogout = async () => {
    await signOut();
    window.location.href = "/login";
  };

  return (
    <>
      <header className="h-25 w-full bg-blue-700 text-white px-6 py-4 flex justify-between items-center">
        {/* Logo + Portal Name */}
        <Link to='/'>
        <div className="flex items-center gap-2" >
          <AcademicCapIcon className="h-7 w-7" />
          <h1 className="text-xl font-semibold">
            Student Management Portal
          </h1>
        </div>
        </Link>

        {/* User Info + Actions */}
        <div className="flex items-center gap-4">
          {user && (
            <span className="text-white font-medium">
              {user.firstName ? `Hello, ${user.firstName}` : `Hello, ${user.username}`}
            </span>
          )}

          {/* Change Password Button */}
          <Link
            to="/account"
            className="h-10 w-28 flex items-center justify-center cursor-pointer hover:bg-yellow-300 duration-150 bg-yellow-400 px-4 py-1 rounded"
          >
            Setting
          </Link>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="h-10 w-24 cursor-pointer hover:bg-blue-500 duration-150 bg-blue-600 px-4 py-1 rounded"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Define Routes for the Account Page */}
      <Routes>
        <Route
          path="/account"
          element={
            <div className="min-h-screen bg-gray-100 flex justify-center items-start p-10">
              <UserProfile
                path="/account"
                routing="path"
                appearance={{
                  variables: { colorPrimary: "#2563EB" },
                }}
              />
            </div>
          }
        />
      </Routes>
    </>
  );
}
