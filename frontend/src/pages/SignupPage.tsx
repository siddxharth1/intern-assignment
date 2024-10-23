import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SignupImage from "./../assets/LoginImg.png";
import Cookies from "js-cookie";
import { setToken } from "../store/authSlice";
import { useDispatch } from "react-redux";

const SignupPage: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    const savedToken = Cookies.get("token");
    if (savedToken) {
      dispatch(setToken(savedToken));
      navigate("/");
    }
  }, [dispatch, navigate]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        "https://intern-assignment-bpz2.onrender.com/api/auth/register",
        {
          name,
          email,
          password,
        }
      );
      navigate("/login");
    } catch (error) {
      console.error("Signup failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-[#141414] min-h-[calc(100vh-66px)]">
      <div className="w-0 sm:w-[45%] flex items-center justify-center">
        <img
          src={SignupImage}
          alt="Signup"
          className="hidden sm:block h-[80vh] object-cover rounded-r-3xl"
        />
      </div>

      <div className="w-full sm:w-[55%] flex items-center px-10">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-3">
              Create an Account
            </h1>
            <p className="text-gray-400">Sign up to start your journey!</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="block font-medium text-white">
                Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full p-3 rounded-lg bg-[#1F1F1F] border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-[#CCF575]"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block font-medium text-white">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter Email ID"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 rounded-lg bg-[#1F1F1F] border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-[#CCF575]"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block font-medium text-white"
              >
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 rounded-lg bg-[#1F1F1F] border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-[#CCF575]"
              />
            </div>

            <div className="flex items-center pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#CCF575] text-black font-semibold rounded-lg hover:bg-opacity-90 transition-colors"
              >
                {loading ? "Signing up..." : "Signup"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
