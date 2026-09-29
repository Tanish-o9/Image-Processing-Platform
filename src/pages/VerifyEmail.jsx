function VerifyEmail() {
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


      {/* Verification */}
      <section className="min-h-[calc(100vh-72px)] flex items-center justify-center px-5">

        <div className="w-full max-w-3xl flex items-center justify-center gap-10">

          {/* Illustration */}
          <div className="hidden md:block w-1/2">

            <img
              src="public\images\verifyEmail.png"
              alt="Verify email"
              className="w-full max-w-sm mx-auto"
            />

          </div>


          {/* Form */}
          <div className="w-full md:w-[380px] bg-white p-8 text-center">

            <h1 className="text-2xl font-bold">
              Verify Your Email
            </h1>

            <p className="text-[10px] text-gray-500 mt-2">
              Enter the verification code sent to your email.
            </p>


            {/* OTP boxes */}
            <div className="flex justify-center gap-2 mt-7">

              <input
                type="text"
                maxLength="1"
                className="w-10 h-10 text-center border border-gray-200 rounded-md outline-none focus:border-indigo-500"
              />

              <input
                type="text"
                maxLength="1"
                className="w-10 h-10 text-center border border-gray-200 rounded-md outline-none focus:border-indigo-500"
              />

              <input
                type="text"
                maxLength="1"
                className="w-10 h-10 text-center border border-gray-200 rounded-md outline-none focus:border-indigo-500"
              />

              <input
                type="text"
                maxLength="1"
                className="w-10 h-10 text-center border border-gray-200 rounded-md outline-none focus:border-indigo-500"
              />

              <input
                type="text"
                maxLength="1"
                className="w-10 h-10 text-center border border-gray-200 rounded-md outline-none focus:border-indigo-500"
              />

              <input
                type="text"
                maxLength="1"
                className="w-10 h-10 text-center border border-gray-200 rounded-md outline-none focus:border-indigo-500"
              />

            </div>


            <p className="text-[10px] text-gray-400 mt-4">
              Didn't receive the code?
              <button className="text-indigo-500 ml-1">
                Resend Code
              </button>
            </p>


            <button
              className="w-full mt-5 bg-gradient-to-r from-indigo-500 to-cyan-400 text-white py-3 rounded-md text-xs font-semibold"
            >
              Verify →
            </button>


            <button
              className="mt-4 text-[10px] text-gray-500 hover:text-indigo-500"
            >
              Change Email
            </button>

          </div>

        </div>

      </section>

    </div>
  );
}

export default VerifyEmail;