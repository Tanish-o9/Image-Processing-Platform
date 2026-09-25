import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import NavBar from "./Navbar";

function AppLayout() {
  return (
    <div className="flex min-h-screen bg-[#f8fbfc]">

      <Sidebar />

      <div className="flex-1">

        <NavBar />

        <main className="p-6">
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default AppLayout;