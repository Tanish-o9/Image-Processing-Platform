import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function SignUp() {

  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (event) => {

    event.preventDefault();

    setError("");

    // Check password confirmation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            name,
            email,
            password
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Store email temporarily for OTP verification
      sessionStorage.setItem(
        "verificationEmail",
        email
      );

      // Go to verification screen
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
            src="/images/logo.png"
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

      {/* Sign Up */}
      <section className="min-h-[calc(100vh-72px)] flex items-center justify-center px-5">

        <div className="w-full max-w-4xl flex items-center justify-center gap-12">

          {/* Image */}
          <div className="hidden md:block w-1/2">

            <img
              src="/images/landing.png"
              alt="Create account"
              className="w-full max-w-md mx-auto"
            />

          </div>

          {/* Form */}
          <div className="w-full md:w-[380px] bg-white p-8">

            <h1 className="text-2xl font-bold">
              Create Your Account
            </h1>

            <p className="text-[10px] text-gray-500 mt-1">
              Sign up to start using Image Rise
            </p>

            <form
              className="mt-5"
              onSubmit={handleSignup}
            >

              {/* Name */}
              <div className="mb-3">

                <label className="block text-xs font-medium mb-1">
                  Name
                </label>

                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="w-full border border-gray-200 rounded-md px-3 py-2.5 text-xs outline-none focus:border-indigo-500"
                />

              </div>

              {/* Email */}
              <div className="mb-3">

                <label className="block text-xs font-medium mb-1">
                  Email
                </label>

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full border border-gray-200 rounded-md px-3 py-2.5 text-xs outline-none focus:border-indigo-500"
                />

              </div>

              {/* Password */}
              <div className="mb-3">

                <label className="block text-xs font-medium mb-1">
                  Password
                </label>

                <input
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full border border-gray-200 rounded-md px-3 py-2.5 text-xs outline-none focus:border-indigo-500"
                />

              </div>

              {/* Confirm Password */}
              <div className="mb-4">

                <label className="block text-xs font-medium mb-1">
                  Confirm Password
                </label>

                <input
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="w-full border border-gray-200 rounded-md px-3 py-2.5 text-xs outline-none focus:border-indigo-500"
                />

              </div>

              {/* Error */}
              {error && (
                <p className="text-[10px] text-red-500 mb-4">
                  {error}
                </p>
              )}

              {/* Create Account Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-500 to-cyan-400 text-white py-3 rounded-md text-xs font-semibold"
              >
                {loading
                  ? "Creating Account..."
                  : "Create Account →"}
              </button>

            </form>

            {/* Login */}
            <p className="text-center text-[10px] text-gray-500 mt-5">

              Already have an account?

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

export default SignUp;
