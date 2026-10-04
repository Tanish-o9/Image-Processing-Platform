import { useNavigate } from "react-router-dom";

function Reset() {

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f7fbfc]">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 bg-white">

        <div className="flex items-center gap-2">

          <img
            src="public\images\logo.png"
            alt="Image Rise"
            className="w-8 h-8"
          />

          <span className="font-bold text-sm">
            Image Rise
          </span>

        </div>

        <div className="hidden md:flex gap-8 text-xs text-gray-600">
          <a href="#">Features</a>
          <a href="#">AI Tools</a>
          <a href="#">About</a>
        </div>

      </nav>


      {/* Success Section */}
      <section className="min-h-[calc(100vh-72px)] flex items-center justify-center px-5">

        <div className="w-full max-w-md bg-white p-10 text-center">

          {/* Success icon */}
          <div className="flex justify-center mb-6">

            <img
              src="public\images\resetSuccess.png"
              alt="Password updated"
              className="w-24 h-24 object-contain"
            />

          </div>


          <h1 className="text-2xl font-bold">
            Password Updated Successfully!
          </h1>


          <p className="text-[10px] text-gray-500 mt-3 leading-5">
            Your password has been successfully updated.
            You can now login with your new password.
          </p>


          <button
            onClick={() => navigate("/login")}
            className="w-full mt-7 bg-gradient-to-r from-indigo-500 to-cyan-400 text-white py-3 rounded-md text-xs font-semibold"
          >
            Login Now →
          </button>

        </div>

      </section>

    </div>
  );
}

export default Reset;