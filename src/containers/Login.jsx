//Change the color
//Terms and conditions, privacy policy 
//Name , Password (CHanged)
//Backbutton
//EMail or id while logging in 
//Forgot password
//restricted , paid or free
//Internal and external posting in Jobs (own employees and public jobs)
//Jobs should be approved by super admin
//Change job status array(Active, Inactive, Pending, Rejected)
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { endpoint } from "../apis/endpoint";
import ChauwkLogo from "../assets/ChauwkLogo/ROUND_LOGO.png"; 
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { saveAuthToken } from "../store/actions/authActions";
import { saveUserId } from "../store/actions/saveUserId";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${endpoint.BASE_URL_STAGING}${endpoint.LOGIN}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      setLoading(false);
      if (data.success) {
        setMessage("");
        
        dispatch(saveAuthToken(data.accessToken));
        dispatch(saveUserId(data.user._id));
        console.log(data.user._id);
        
        
        toast('🥷 Complete Registration in profile!', {
          position: "top-right",
          autoClose: 9000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          style: { color: "blue" },
          theme: "light",
          });
        toast.success("Login Success");


        setTimeout(() => navigate("/dashboard"), 1500); 
      } else {
        setMessage(data.msg || "Invalid credentials");
      }
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
      setMessage("Server error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row justify-center items-center bg-blue-50">
      {/* Logo Section */}
      <div className="flex justify-center items-center lg:w-1/2">
        <img src={ChauwkLogo} className="h-72 w-72 lg:h-96 lg:w-96 object-cover" alt="Chauwk Logo" />
      </div>
      
      {/* Form Section */}
      <div className="flex justify-center items-center lg:w-1/2 w-full">
        <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
          <h2 className="text-3xl font-bold text-blue-600 mb-8 text-center">Login</h2>

          {message && (
            <div className="mb-4 text-center text-red-500 font-semibold">
              {message}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
            className="space-y-6"
          >
            <div>
              <label className="block text-gray-700 font-medium mb-1">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className={`w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Loading..." : "Login"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Dont have an account?{" "}
              <button
                className="text-blue-600 font-semibold hover:underline transition duration-150"
                onClick={() => navigate("/register")}
              >
                Register here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
