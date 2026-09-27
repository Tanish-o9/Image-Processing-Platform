import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="min-h-screen">
      <Outlet />
    </div>
  );
}

export default AuthLayout;