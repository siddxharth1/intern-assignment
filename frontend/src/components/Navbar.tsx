import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import Logo from "./../assets/Logo.svg";
import { RootState } from "../store/store";
import { clearToken } from "../store/authSlice"; // Make sure to create this action

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => !!state.auth.token);

  const handleLogout = () => {
    // Clear the token from cookies
    Cookies.remove("token");
    // Clear the token from Redux store
    dispatch(clearToken());
    // Redirect to login page
    navigate("/login");
  };

  const renderButtons = () => {
    switch (location.pathname) {
      case "/login":
        return (
          <>
            <button
              onClick={() => navigate("/signup")}
              className="border border-[#CCF575] text-[#CCF575] p-2 px-5 rounded-md font-bold"
            >
              Connecting People With Technology
            </button>
          </>
        );

      case "/signup":
        return (
          <>
            <button
              onClick={() => navigate("/login")}
              className="bg-[#CCF575] p-2 px-5 text-black rounded-md font-bold mr-4"
            >
              Login
            </button>
          </>
        );

      case "/":
        return isAuthenticated ? (
          <>
            <button
              onClick={handleLogout}
              className="bg-[#CCF575] p-2 px-5 text-black rounded-md font-bold"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate("/login")}
              className="bg-[#CCF575] p-2 px-5 text-black rounded-md font-bold"
            >
              Login
            </button>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex justify-between items-center p-2 px-[4%] bg-[#1F1F1F] border-b border-neutral-600">
      <img
        src={Logo}
        alt="Logo"
        className="cursor-pointer"
        onClick={() => navigate("/")}
      />
      <div>{renderButtons()}</div>
    </div>
  );
};

export default Navbar;
