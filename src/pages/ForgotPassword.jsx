function ForgotPassword() {
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


            <form className="mt-7">

              <label className="block text-xs font-medium mb-2">
                Email
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                className="w-full border border-gray-200 rounded-md px-3 py-3 text-xs outline-none focus:border-indigo-500"
              />


              <button
                type="submit"
                className="w-full mt-5 bg-gradient-to-r from-indigo-500 to-cyan-400 text-white py-3 rounded-md text-xs font-semibold"
              >
                Send Reset Link →
              </button>

            </form>


            <p className="text-center text-[10px] text-gray-500 mt-6">

              Remember your password?

              <a
                href="#"
                className="text-indigo-500 ml-1"
              >
                Login
              </a>

            </p>

          </div>

        </div>

      </section>

    </div>
  );
}

export default ForgotPassword;