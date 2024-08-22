import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { endpoint } from "../apis/endpoint";
import ChauwkLogo from "../assets/ChauwkLogo/ROUND_LOGO.png";

export default function Register() {
  //Add a tick box for the user to agree to the terms and conditions
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${endpoint.BASE_URL_STAGING}${endpoint.REGISTER}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();
      setLoading(false);

      if (data.success) {
        setMessage("Registration Successful! Redirecting...");
          setTimeout(() => navigate("/login"));
  
      } else {
        setMessage(data.msg || "Invalid credentials");
      }
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
      setMessage("Server error. Please try again.");
    }
  };
  const [agree, setAgree] = useState(false);
  const checkboxHandler = () => {
    setAgree(!agree);
  };

  return (
    
    <div className="min-h-screen flex flex-col lg:flex-row justify-center items-center bg-blue-50">
      {/* Logo Section */}
      <div className="flex justify-center items-center lg:w-1/2">
        <img
          src={ChauwkLogo}
          className="h-72 w-72 lg:h-96 lg:w-96 object-cover"
          alt="Chauwk Logo"
        />
      </div>

      {/* Form Section */}
      <div className="flex justify-center items-center lg:w-1/2 w-full">
        <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
          <h2 className="text-3xl font-bold text-blue-600 mb-8 text-center">
          Register Here
          </h2>

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
              <label className="block text-gray-700 font-medium mb-1">
                Email
              </label>
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
              <label className="block text-gray-700 font-medium mb-1">
                Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="agree"
                checked={agree}
                onChange={checkboxHandler}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <label htmlFor="agree" className="ml-2 text-gray-700">
                I agree to <button className="text-sky-600" onClick={()=>{navigate('/agreement')}}>terms and conditions</button>
              </label>
            </div>  
            <button
              type="submit"
              className={`w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200
                ${
                  agree ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
                }
                
                ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Loading..." : "Register"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Have an account?{" "}
              <button
                className="text-blue-600 font-semibold hover:underline transition duration-150"
                onClick={() => navigate("/")}
              >
                Login here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
