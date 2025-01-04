import { NavLink, Outlet } from "react-router-dom";
import "../Navbar.css";

const Navbar = () => {
  return (
    <div className="navbar-container">
      {/* Sidebar */}
      <nav className="sidebar">
        <NavLink to="/" className="nav-link">
          Home Page
        </NavLink>
        <NavLink to="/user" className="nav-link">
          User Page
        </NavLink>
        <NavLink to="/user/requests" className="nav-link">
          Requests
        </NavLink>
      </nav>

      {/* Main Content */}
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default Navbar;
