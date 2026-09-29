import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {

    event.preventDefault();

    setError("");
    setLoading(true);

    try {

      const response = await fetch(
        "http://localhost:3000/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            email,
            password
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Save JWT token
      localStorage.setItem("token", data.data.token);

      // Save user information
      localStorage.setItem(
        "user",
        JSON.stringify(data.data.user)
      );

      // Go to dashboard
      navigate("/dashboard");

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


      {/* Login Section */}
      <section className="min-h-[calc(100vh-72px)] flex items-center justify-center px-5">

        <div className="w-full max-w-4xl flex flex-col md:flex-row items-center justify-center gap-12">

          {/* Image */}
          <div className="hidden md:block w-1/2">
            <img
              src="public\images\landing.png"
              alt="Login"
              className="w-full max-w-md mx-auto"
            />
          </div>


          {/* Form */}
          <div className="w-full md:w-[380px] bg-white p-8">

            <h1 className="text-2xl font-bold">
              Welcome Back
            </h1>

            <p className="text-[10px] text-gray-500 mt-1">
              Sign in to continue to ImageForge
            </p>


            <form
              className="mt-6"
              onSubmit={handleLogin}
            >

              {/* Email */}
              <div className="mb-4">

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

              </div>


              {/* Password */}
              <div className="mb-2">

                <label className="block text-xs font-medium mb-2">
                  Password
                </label>

                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full border border-gray-200 rounded-md px-3 py-3 text-xs outline-none focus:border-indigo-500"
                />

              </div>


              <div className="text-right mb-5">

                <Link
                  to="/forgot-password"
                  className="text-[10px] text-indigo-500"
                >
                  Forgot Password?
                </Link>

              </div>


              {/* Error */}
              {error && (
                <p className="text-[10px] text-red-500 mb-4">
                  {error}
                </p>
              )}


              {/* Login button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-500 to-cyan-400 text-white py-3 rounded-md text-xs font-semibold"
              >
                {loading ? "Logging in..." : "Login →"}
              </button>

            </form>


            <div className="flex items-center gap-3 my-5">

              <div className="h-px bg-gray-200 flex-1"></div>

              <span className="text-[10px] text-gray-400">
                OR
              </span>

              <div className="h-px bg-gray-200 flex-1"></div>

            </div>


            {/* Social login */}
            <div className="flex gap-3">

              <button className="flex-1 border border-gray-200 rounded-md py-2 text-[10px]">
                Continue with Google
              </button>

              <button className="flex-1 border border-gray-200 rounded-md py-2 text-[10px]">
                Continue with Apple
              </button>

            </div>


            <p className="text-center text-[10px] text-gray-500 mt-6">
              Don't have an account?

              <Link
                to="/signup"
                className="text-indigo-500 ml-1"
              >
                Sign Up
              </Link>

            </p>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Login;