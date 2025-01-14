import { NavLink, Outlet } from "react-router-dom";
import "../Navbar.css";

const Navbar = () => {
  return (
    <div className="navbar-container">
      {/* Sidebar */}
      <nav className="sidebar">
        <div className="nav-links">
          <NavLink to="/user" className="nav-link">
            My requests
          </NavLink>
          <NavLink to="/user/request-form" className="nav-link">
            Request Form
          </NavLink>
          <NavLink to="/user/history" className="nav-link">
            Denied and Previous requests
          </NavLink>
        </div>
        <NavLink to="/" className="nav-link-log-out">
          Log out
        </NavLink>
      </nav>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default Navbar;
