function SignUp() {
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


      {/* Sign Up */}
      <section className="min-h-[calc(100vh-72px)] flex items-center justify-center px-5">

        <div className="w-full max-w-4xl flex items-center justify-center gap-12">

          {/* Image */}
          <div className="hidden md:block w-1/2">

            <img
              src="public\images\landing.png"
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
              Sign up to start using ImageForge
            </p>


            <form className="mt-5">

              {/* Name */}
              <div className="mb-3">

                <label className="block text-xs font-medium mb-1">
                  Name
                </label>

                <input
                  type="text"
                  placeholder="Enter your name"
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
                  className="w-full border border-gray-200 rounded-md px-3 py-2.5 text-xs outline-none focus:border-indigo-500"
                />

              </div>


              <div className="flex items-center gap-2 mb-4">

                <input type="checkbox" />

                <p className="text-[9px] text-gray-500">
                  I agree to the Terms & Conditions and Privacy Policy.
                </p>

              </div>


              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-500 to-cyan-400 text-white py-3 rounded-md text-xs font-semibold"
              >
                Create Account →
              </button>

            </form>


            <div className="flex items-center gap-3 my-4">

              <div className="h-px bg-gray-200 flex-1"></div>

              <span className="text-[10px] text-gray-400">
                OR
              </span>

              <div className="h-px bg-gray-200 flex-1"></div>

            </div>


            <div className="flex gap-3">

              <button className="flex-1 border border-gray-200 rounded-md py-2 text-[10px]">
                Continue with Google
              </button>

              <button className="flex-1 border border-gray-200 rounded-md py-2 text-[10px]">
                Continue with Apple
              </button>

            </div>


            <p className="text-center text-[10px] text-gray-500 mt-5">
              Already have an account?
              <a href="#" className="text-indigo-500 ml-1">
                Login
              </a>
            </p>

          </div>

        </div>

      </section>

    </div>
  );
}

export default SignUp;