import { useState } from "react";
import { useNavigate } from "react-router-dom";

function VerifyEmail() {

  const navigate = useNavigate();

  const [otp, setOtp] = useState([
    "",
    "",
    "",
    "",
    "",
    ""
  ]);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const verificationMode =
    sessionStorage.getItem("verificationMode") || "signup";

  const email =
    verificationMode === "reset"
      ? sessionStorage.getItem("resetEmail")
      : sessionStorage.getItem("verificationEmail");


  const handleOtpChange = (index, value) => {

    if (!/^\d?$/.test(value)) {
      return;
    }

    const newOtp = [...otp];

    newOtp[index] = value;

    setOtp(newOtp);
  };


  const handleVerify = async () => {

    setError("");

    const completeOtp = otp.join("");

    if (completeOtp.length !== 6) {
      setError("Please enter the complete 6 digit code.");
      return;
    }

    if (!email) {
      setError("Email information is missing.");
      return;
    }

    /*
     * PASSWORD RESET
     */
    if (verificationMode === "reset") {

      if (!newPassword) {
        setError("Please enter your new password.");
        return;
      }

      if (newPassword.length < 8) {
        setError("Password must be at least 8 characters.");
        return;
      }

      if (newPassword !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }

    setLoading(true);

    try {

      /*
       * SIGNUP EMAIL VERIFICATION
       */
      if (verificationMode === "signup") {

        const response = await fetch(
          "http://localhost:3000/api/auth/verify-email",
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json"
            },

            body: JSON.stringify({
              email,
              otp: completeOtp
            })
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Email verification failed"
          );
        }

        sessionStorage.removeItem("verificationEmail");
        sessionStorage.removeItem("verificationMode");

        navigate("/login");
      }

      /*
       * PASSWORD RESET
       */
      else {

        const response = await fetch(
          "http://localhost:3000/api/auth/reset-password",
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json"
            },

            body: JSON.stringify({
              email,
              otp: completeOtp,
              newPassword
            })
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Password reset failed"
          );
        }

        sessionStorage.removeItem("resetEmail");
        sessionStorage.removeItem("verificationMode");

        navigate("/reset");
      }

    } catch (error) {

      setError(error.message);

    } finally {

      setLoading(false);

    }
  };


  const handleResend = async () => {

    setError("");

    if (!email) {
      setError("Email information is missing.");
      return;
    }

    try {

      /*
       * PASSWORD RESET OTP
       */
      if (verificationMode === "reset") {

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
          throw new Error(
            data.message || "Could not resend code"
          );
        }

        setError("");
        return;
      }


      /*
       * SIGNUP VERIFICATION OTP
       */
      const response = await fetch(
        "http://localhost:3000/api/auth/resend-verification",
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
        throw new Error(
          data.message || "Could not resend code"
        );
      }

    } catch (error) {

      setError(error.message);

    }
  };


  const handleChangeEmail = () => {

    if (verificationMode === "reset") {
      navigate("/forgot-password");
    } else {
      navigate("/signup");
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

              {otp.map((value, index) => (

                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={value}
                  onChange={(event) =>
                    handleOtpChange(
                      index,
                      event.target.value
                    )
                  }
                  className="w-10 h-10 text-center border border-gray-200 rounded-md outline-none focus:border-indigo-500"
                />

              ))}

            </div>


            {/* New password fields only for reset */}
            {verificationMode === "reset" && (

              <div className="mt-5 text-left">

                <label className="block text-xs font-medium mb-1">
                  New Password
                </label>

                <input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(event) =>
                    setNewPassword(event.target.value)
                  }
                  className="w-full border border-gray-200 rounded-md px-3 py-2.5 text-xs outline-none focus:border-indigo-500"
                />

                <label className="block text-xs font-medium mb-1 mt-3">
                  Confirm Password
                </label>

                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  className="w-full border border-gray-200 rounded-md px-3 py-2.5 text-xs outline-none focus:border-indigo-500"
                />

              </div>

            )}


            {error && (
              <p className="text-[10px] text-red-500 mt-4">
                {error}
              </p>
            )}


            <p className="text-[10px] text-gray-400 mt-4">
              Didn't receive the code?

              <button
                onClick={handleResend}
                className="text-indigo-500 ml-1"
              >
                Resend Code
              </button>
            </p>


            <button
              onClick={handleVerify}
              disabled={loading}
              className="w-full mt-5 bg-gradient-to-r from-indigo-500 to-cyan-400 text-white py-3 rounded-md text-xs font-semibold"
            >
              {loading ? "Verifying..." : "Verify →"}
            </button>


            <button
              onClick={handleChangeEmail}
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