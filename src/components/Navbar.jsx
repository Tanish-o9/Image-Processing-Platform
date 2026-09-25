function NavBar() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">

      {/* Search */}
      <div className="w-72">

        <input
          type="text"
          placeholder="Search anything..."
          className="w-full bg-purple-50 rounded-lg px-4 py-2 text-xs outline-none"
        />

      </div>


      {/* Right side */}
      <div className="flex items-center gap-5">

        <span className="text-gray-500 text-sm">
          ♧
        </span>

        <div className="w-7 h-7 rounded-full bg-yellow-400 flex items-center justify-center text-xs">
          N
        </div>

      </div>

    </header>
  );
}

export default NavBar;