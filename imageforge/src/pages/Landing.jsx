import { useNavigate } from "react-router-dom";

function Landing() {

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f7fbfc] text-gray-900">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 bg-white">
        <div className="flex items-center gap-2">
          <img
            src="public\images\logo.png"
            alt="ImageForge"
            className="w-8 h-8"
          />
          <span className="font-bold text-sm">ImageForge</span>
        </div>

        <div className="hidden md:flex gap-8 text-xs text-gray-600">
          <a href="#" className="hover:text-blue-600">Features</a>
          <a href="#" className="hover:text-blue-600">AI Tools</a>
          <a href="#" className="hover:text-blue-600">About</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-[calc(100vh-72px)] flex items-center justify-center px-8">

        <div className="max-w-6xl w-full flex flex-col md:flex-row items-center justify-between gap-12">

          {/* Left side */}
          <div className="w-full md:w-1/2">

            <p className="text-[10px] font-semibold text-indigo-600 tracking-wide mb-4">
              AI IMAGE PROCESSING PLATFORM
            </p>

            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Transform Images
              <br />
              with <span className="text-indigo-500">AI</span>
            </h1>

            <p className="text-gray-500 text-sm mt-5 max-w-md leading-6">
              Process, enhance and analyze your images
              using powerful AI tools.
            </p>

            <button
              onClick={() => navigate("/signup")}
              className="mt-6 bg-gradient-to-r from-indigo-500 to-cyan-400 text-white text-xs font-semibold px-7 py-3 rounded-full hover:opacity-90"
            >
              Get Started →
            </button>

          </div>

          {/* Right side */}
          <div className="w-full md:w-1/2 flex justify-center">

            <div className="relative">

              <img
                src="public\images\landing.png"
                alt="Image processing"
                className="w-80 md:w-96"
              />

            </div>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Landing;