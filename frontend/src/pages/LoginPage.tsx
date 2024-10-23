import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { setToken } from "../store/authSlice";
import LoginImage from "./../assets/LoginImg.png";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const savedToken = Cookies.get("token");
    if (savedToken) {
      dispatch(setToken(savedToken));
      navigate("/");
    }
  }, [dispatch, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "https://intern-assignment-bpz2.onrender.com/api/auth/login",
        {
          email,
          password,
        },
        { withCredentials: true }
      );
      const { token } = response.data;
      Cookies.set("token", token, { sameSite: "lax", secure: false });
      dispatch(setToken(token));
      navigate("/");
    } catch (error) {
      console.error("Login failed", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex bg-[#141414] min-h-[calc(100vh-66px)]">
      <div className="w-0 sm:w-[45%] flex items-center justify-center">
        <img
          src={LoginImage}
          alt="Signup"
          className="hidden sm:block h-[80vh] object-cover rounded-r-3xl"
        />
      </div>

      <div className="w-full sm:w-[55%] flex items-center  px-10">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-3">
              Let the Journey Begin!
            </h1>
            <p className="text-gray-400">
              This is basic login page which is used for levitation assignment
              purpose.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block  font-medium text-white">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter Email ID"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 rounded-lg bg-[#1F1F1F] border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-[#CCF575]"
              />
              <div className="text-sm text-gray-400">
                This email will be displayed with your inquiry
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block font-medium text-white"
              >
                Current Password
              </label>
              <input
                type="password"
                placeholder="Enter the Password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 rounded-lg bg-[#1F1F1F] border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-[#CCF575]"
              />
            </div>

            <div className="flex items-center  pt-2 gap-10">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#CCF575] text-black font-semibold rounded-lg hover:bg-opacity-90 transition-colors"
              >
                {loading ? "Loading..." : "Login"}
              </button>
              <a
                href="#"
                className="text-gray-400 text-sm hover:text-[#CCF575] transition-colors"
              >
                Forgot password ?
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
