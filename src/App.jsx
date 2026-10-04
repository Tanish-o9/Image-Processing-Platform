import ProtectedRoute from "./components/ProtectedRoute"; 
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import AppLayout from "./components/AppLayout";
import AuthLayout from "./components/AuthLayout";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyEmail from "./pages/VerifyEmail";
import ResetSuccess from "./pages/ResetSuccess";

import Home from "./pages/dashboard/Home";
import AIAnalysis from "./pages/dashboard/AIAnalysis";
import Settings from "./pages/dashboard/Settings";

import Upload from "./pages/dashboard/Upload";
import EditImage from "./pages/dashboard/EditImage";
import Analysis from "./pages/dashboard/Analysis";
import Recommendations from "./pages/dashboard/Recommendations";
import History from "./pages/dashboard/History";
import ExportImage from "./pages/dashboard/ExportImage";


function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* Landing */}

        <Route
          path="/"
          element={<Landing />}
        />


        {/* Authentication */}

        <Route element={<AuthLayout />}>

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/signup"
            element={<Signup />}
          />

          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />

          <Route
            path="/verify-email"
            element={<VerifyEmail />}
          />

          <Route
            path="/reset"
            element={<ResetSuccess />}
          />

        </Route>

{/* Dashboard - Protected */}

<Route element={<ProtectedRoute />}>

  <Route
    path="/dashboard"
    element={<AppLayout />}
  >

    <Route
      index
      element={<Home />}
    />

    <Route
      path="upload"
      element={<Upload />}
    />

    <Route
      path="edit"
      element={<EditImage />}
    />

    <Route
      path="analysis"
      element={<Analysis />}
    />

    <Route
      path="recommendations"
      element={<Recommendations />}
    />

    <Route
      path="history"
      element={<History />}
    />

    <Route
      path="export"
      element={<ExportImage />}
    />

    <Route
      path="ai-analysis"
      element={<AIAnalysis />}
    />

    <Route
      path="settings"
      element={<Settings />}
    />

  </Route>

</Route>

      </Routes>

    </BrowserRouter>

  );
}

export default App;