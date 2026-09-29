import { NavLink } from "react-router-dom";
import ProCard from "./ProCard";

function Sidebar() {
  return (
    <aside className="w-44 min-h-screen bg-white border-r border-gray-200 flex flex-col">

      {/* Logo */}
      <div className="flex items-center gap-2 px-5 py-5 border-b border-gray-100">
        <div className="w-7 h-7 bg-gradient-to-br from-blue-600 to-purple-600 rounded-md flex items-center justify-center text-white text-xs">
          ✦
        </div>

        <span className="font-bold text-sm">
          ImageForge
        </span>
      </div>


      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-2">

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg text-xs ${
              isActive
                ? "bg-purple-200 text-gray-900 font-semibold"
                : "text-gray-600 hover:bg-gray-100"
            }`
          }
        >
          <span>⌂</span>
          Home
        </NavLink>


        <NavLink
          to="/dashboard/upload"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-gray-600 hover:bg-gray-100"
        >
          <span>↥</span>
          Upload
        </NavLink>


        <NavLink
          to="/dashboard/ai-analysis"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg text-xs ${
              isActive
                ? "bg-purple-200 text-gray-900 font-semibold"
                : "text-gray-600 hover:bg-gray-100"
            }`
          }
        >
          <span>▧</span>
          AI Analysis
        </NavLink>


        <NavLink
          to="/dashboard/projects"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-gray-600 hover:bg-gray-100"
        >
          <span>▦</span>
          Projects
        </NavLink>


        <NavLink
          to="/dashboard/history"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-gray-600 hover:bg-gray-100"
        >
          <span>◷</span>
          History
        </NavLink>


        <NavLink
          to="/dashboard/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg text-xs ${
              isActive
                ? "bg-purple-200 text-gray-900 font-semibold"
                : "text-gray-600 hover:bg-gray-100"
            }`
          }
        >
          <span>⚙</span>
          Settings
        </NavLink>

      </nav>


      {/* Pro Card */}
      <ProCard />

    </aside>
  );
}

export default Sidebar;