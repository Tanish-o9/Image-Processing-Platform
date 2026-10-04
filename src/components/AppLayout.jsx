import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import NavBar from "./Navbar";

function AppLayout() {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#f8fbfc] overflow-x-hidden">

      {/* Sidebar */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Main Area */}
      <div className="flex-1 min-w-0">

        <NavBar
          setIsSidebarOpen={setIsSidebarOpen}
        />

        <main className="p-4 sm:p-5 md:p-6">
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default AppLayout;