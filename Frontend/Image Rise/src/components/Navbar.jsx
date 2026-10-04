import { useEffect, useState } from "react";

function NavBar({ setIsSidebarOpen }) {

  const [firstLetter, setFirstLetter] =
    useState("U");


  useEffect(() => {

    const savedUser =
      localStorage.getItem("user");

    if (savedUser) {

      try {

        const user =
          JSON.parse(savedUser);

        const name =
          user.name || "User";

        setFirstLetter(
          name.charAt(0).toUpperCase()
        );

      } catch (error) {

        console.error(
          "Could not read user information:",
          error
        );

      }

    }

  }, []);


  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-5 md:px-6">

      {/* Left side */}
      <div className="flex items-center gap-3 min-w-0">

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="md:hidden text-xl text-gray-600"
        >
          ☰
        </button>


        {/* Search */}
        <div className="w-[180px] sm:w-60 md:w-72">

          <input
            type="text"
            placeholder="Search anything..."
            className="w-full bg-purple-50 rounded-full px-4 py-2 text-xs outline-none"
          />

        </div>

      </div>


      {/* Right side */}
      <div className="flex items-center gap-3 sm:gap-5 ml-3">

        <span className="text-gray-500 text-sm">
          ♧
        </span>

        <div className="w-7 h-7 rounded-full bg-yellow-400 flex items-center justify-center text-xs flex-shrink-0">
          {firstLetter}
        </div>

      </div>

    </header>
  );
}

export default NavBar;