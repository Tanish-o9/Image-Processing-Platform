import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function ForgotPassword() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (event) => {

    event.preventDefault();

    setError("");
    setLoading(true);

    try {

      const response = await fetch(
        "http://localhost:3000/api/auth/forgot-password",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            email
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      // Store email for reset process
      sessionStorage.setItem(
        "resetEmail",
        email
      );

      // Tell VerifyEmail screen that this is a password reset
      sessionStorage.setItem(
        "verificationMode",
        "reset"
      );

      navigate("/verify-email");

    } catch (error) {

      setError(error.message);

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="min-h-screen bg-[#f7fbfc]">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 bg-white">

        <div className="flex items-center gap-2">

          <img
            src="public\images\logo.png"
            alt="ImageForge"
            className="w-8 h-8"
          />

          <span className="font-bold text-sm">
            ImageForge
          </span>

        </div>

        <div className="hidden md:flex gap-8 text-xs text-gray-600">
          <a href="#">Features</a>
          <a href="#">AI Tools</a>
          <a href="#">About</a>
        </div>

      </nav>


      {/* Forgot Password */}
      <section className="min-h-[calc(100vh-72px)] flex items-center justify-center px-5">

        <div className="w-full max-w-3xl flex items-center justify-center gap-10">

          {/* Illustration */}
          <div className="hidden md:block w-1/2">

            <img
              src="public\images\forgotPassword.png"
              alt="Forgot password"
              className="w-full max-w-sm mx-auto"
            />

          </div>


          {/* Form */}
          <div className="w-full md:w-[380px] bg-white p-8">

            <h1 className="text-2xl font-bold">
              Forgot Password
            </h1>

            <p className="text-[10px] text-gray-500 mt-2 leading-5">
              Enter your registered email address and
              we will send you a link to reset your password.
            </p>


            <form
              className="mt-7"
              onSubmit={handleForgotPassword}
            >

              <label className="block text-xs font-medium mb-2">
                Email
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full border border-gray-200 rounded-md px-3 py-3 text-xs outline-none focus:border-indigo-500"
              />

              {error && (
                <p className="text-[10px] text-red-500 mt-3">
                  {error}
                </p>
              )}


              <button
                type="submit"
                disabled={loading}
                className="w-full mt-5 bg-gradient-to-r from-indigo-500 to-cyan-400 text-white py-3 rounded-md text-xs font-semibold"
              >
                {loading ? "Sending..." : "Send Reset OTP →"}
              </button>

            </form>


            <p className="text-center text-[10px] text-gray-500 mt-6">

              Remember your password?

              <Link
                to="/login"
                className="text-indigo-500 ml-1"
              >
                Login
              </Link>

            </p>

          </div>

        </div>

      </section>

    </div>
  );
}

export default ForgotPassword;