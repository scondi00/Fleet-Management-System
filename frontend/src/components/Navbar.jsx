import { NavLink, Outlet } from "react-router-dom";
import "../Navbar.css";

import { MdOutlineLogout } from "react-icons/md";
import { AiOutlineForm } from "react-icons/ai";
import { FaCarSide } from "react-icons/fa";
import { FaHistory } from "react-icons/fa";
const Navbar = () => {
  return (
    <div className="navbar-container">
      {/* Sidebar */}
      <nav className="sidebar">
        <div className="nav-links">
          <NavLink to="/user" className="nav-link">
            My requests
            <FaCarSide />
          </NavLink>
          <NavLink to="/user/request-form" className="nav-link">
            Request Form
            <AiOutlineForm />
          </NavLink>
          <NavLink to="/user/history" className="nav-link">
            Denied and Previous requests
            <FaHistory />
          </NavLink>
        </div>
        <NavLink to="/" className="nav-link-log-out">
          Log out
          <MdOutlineLogout />
        </NavLink>
      </nav>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default Navbar;
