import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Settings() {

  const navigate = useNavigate();

  const [userName, setUserName] =
    useState("User");

  const [userEmail, setUserEmail] =
    useState("");

  const [firstLetter, setFirstLetter] =
    useState("U");

  const [imagesProcessed, setImagesProcessed] =
    useState(0);

  const [aiAnalyses, setAiAnalyses] =
    useState(0);


  useEffect(() => {

    // Get logged-in user information
    const savedUser =
      localStorage.getItem("user");

    if (savedUser) {

      try {

        const user =
          JSON.parse(savedUser);

        const name =
          user.name || "User";

        const email =
          user.email || "";

        setUserName(name);
        setUserEmail(email);

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


    // Get image statistics
    const getStats = async () => {

      try {

        const token =
          localStorage.getItem("token");

        if (!token) {
          return;
        }

        const response =
          await fetch(
            "http://localhost:3000/api/images/stats",
            {
              method: "GET",
              headers: {
                Authorization:
                  `Bearer ${token}`
              }
            }
          );

        const data =
          await response.json();

        if (response.ok && data.success) {

          setImagesProcessed(
            data.data.imagesProcessed
          );

          setAiAnalyses(
            data.data.aiAnalyses
          );

        }

      } catch (error) {

        console.error(
          "Could not get image statistics:",
          error
        );

      }
    };


    getStats();

  }, []);


  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };


  return (
    <div>

      {/* Heading */}
      <div className="mb-5">

        <h1 className="text-2xl font-bold">
          Profile & Settings
        </h1>

        <p className="text-xs text-gray-500">
          Manage your account, preferences and app settings.
        </p>

      </div>


      {/* Profile */}
      <div className="bg-white border border-gray-100 rounded-lg p-5 flex items-center justify-between">

        <div className="flex items-center gap-4">

          <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
            {firstLetter}
          </div>

          <div>

            <h2 className="text-sm font-bold">
              {userName}
            </h2>

            <p className="text-xs text-gray-500">
              {userEmail}
            </p>

          </div>

        </div>

        <button className="bg-purple-200 text-purple-700 text-[10px] px-4 py-2 rounded-md">
          Edit Profile
        </button>

      </div>


      {/* Statistics */}
      <div className="grid grid-cols-2 gap-4 mt-5">

        <StatCard
          number={imagesProcessed}
          title="Images Processed"
        />

        <StatCard
          number={aiAnalyses}
          title="Images analysed by AI"
        />

      </div>


      {/* Preferences */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">

        <div className="bg-white border border-gray-100 rounded-lg p-5">

          <h2 className="text-lg font-bold mb-4">
            Preferences
          </h2>

          <SettingRow
            title="Appearance"
            value="Light"
          />

          <SettingRow
            title="Language"
            value="English"
          />

          <SettingRow
            title="Help & Support"
            value=""
          />

          <SettingRow
            title="Terms of Services"
            value=""
          />

        </div>


        {/* Account */}
        <div className="bg-white border border-gray-100 rounded-lg p-5">

          <h2 className="text-lg font-bold mb-4">
            Account & Support
          </h2>

          <SettingRow
            title="Profile Information"
            value=""
          />

          <SettingRow
            title="Notifications"
            value=""
          />

          <SettingRow
            title="Privacy Policy"
            value=""
          />

          <SettingRow
            title="Help & Support"
            value=""
          />

          <SettingRow
            title="Change Password"
            value=""
          />

        </div>

      </div>


      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full mt-5 border border-red-300 bg-red-100 text-red-500 py-3 rounded-lg text-xs"
      >
        ⇥ Logout
      </button>

    </div>
  );
}


function StatCard({ number, title }) {

  return (
    <div className="bg-white border border-gray-100 rounded-lg p-5 text-center">

      <p className="text-xl font-bold text-purple-600">
        {number}
      </p>

      <p className="text-[10px] text-gray-500 mt-1">
        {title}
      </p>

    </div>
  );
}


function SettingRow({ title, value }) {

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100">

      <span className="text-xs">
        {title}
      </span>

      <span className="text-[10px] text-gray-500">
        {value} →
      </span>

    </div>
  );
}


export default Settings;