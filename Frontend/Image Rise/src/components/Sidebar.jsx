import { NavLink } from "react-router-dom";
import ProCard from "./ProCard";
import { BACKEND_URL, getToken } from "../api";

function Sidebar({
  isSidebarOpen,
  setIsSidebarOpen
}) {

  return (
    <>
      {/* Dark background when sidebar is open on mobile */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
        ></div>
      )}


      {/* Sidebar */}
      <aside
        className={`
          w-44 min-h-screen bg-white border-r border-gray-200 flex flex-col

          fixed md:static
          top-0 left-0
          z-50

          transform transition-transform duration-300

          ${isSidebarOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
          }
        `}
      >

        {/* Logo */}
        <div className="flex items-center gap-0 px-5 py-5 border-b border-gray-100">

          <img
            src="/images/logo.png"
            className="w-12 h-12 object-cover"
            alt="ImageForge"
          />

          <span className="font-bold text-sm">
            Image Rise
          </span>

        </div>


        {/* Close button - mobile only */}
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="md:hidden absolute top-5 right-4 text-gray-500 text-lg"
        >
          ×
        </button>


        {/* Navigation */}
        <nav className="flex-1 px-3 py-5 space-y-2">

          {/* Home */}
          <NavLink
            to="/dashboard"
            end
            onClick={() => setIsSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm ${isActive
                ? "bg-purple-200 text-gray-900 font-semibold"
                : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            <span>⌂</span>
            Home
          </NavLink>


          {/* Upload */}
          <NavLink
            to="/dashboard/upload"
            end
            onClick={() => setIsSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm ${isActive
                ? "bg-purple-200 text-gray-900 font-semibold"
                : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            <span>↥</span>
            Upload
          </NavLink>


          {/* AI Analysis */}
          <NavLink
            to="/dashboard/ai-analysis"
            end
            onClick={() => setIsSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm ${isActive
                ? "bg-purple-200 text-gray-900 font-semibold"
                : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            <span>▧</span>
            AI Analysis
          </NavLink>


          {/* History */}
          <NavLink
            to="/dashboard/history"
            end
            onClick={() => setIsSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm ${isActive
                ? "bg-purple-200 text-gray-900 font-semibold"
                : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            <span>◷</span>
            History
          </NavLink>


          {/* Settings */}
          <NavLink
            to="/dashboard/settings"
            end
            onClick={() => setIsSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm ${isActive
                ? "bg-purple-200 text-gray-900 font-semibold"
                : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            <span>⚙</span>
            Settings
          </NavLink>


          <button
            onClick={async () => {
              const imageId = sessionStorage.getItem("imageId");

              if (!imageId) {
                alert("No uploaded image found.");
                return;
              }

              try {
                const response = await fetch(
                  `${BACKEND_URL}/api/images/export/${imageId}`,
                  {
                    method: "POST",
                    headers: {
                      Authorization: `Bearer ${getToken()}`
                    }
                  }
                );

                const data = await response.json();

                if (!response.ok) {
                  throw new Error(
                    data.message || "Export failed"
                  );
                }

                // Open the URL returned by the backend
                window.open(data.data.url, "_blank");

                // Close mobile sidebar
                setIsSidebarOpen(false);

              } catch (error) {
                alert(error.message || "Export failed");
              }
            }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 w-full text-left"
          >
            <span>⇩</span>
            Save & Export
          </button>
        </nav>


        {/* Pro Card */}
        <ProCard />

      </aside>
    </>
  );
}

export default Sidebar;