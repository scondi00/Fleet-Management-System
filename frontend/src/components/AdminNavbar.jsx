import { NavLink, Outlet } from "react-router-dom";
import "../Navbar.css";

const AdminNavbar = () => {
  return (
    <div className="navbar-container">
      {/* Sidebar */}
      <nav className="sidebar">
        <NavLink to="/" className="nav-link">
          Home Page
        </NavLink>
        <NavLink to="/admin" className="nav-link">
          Admin Page
        </NavLink>
        <NavLink to="/admin/requests" className="nav-link">
          Admin Requests
        </NavLink>
      </nav>

      {/* Main Content */}
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminNavbar;
