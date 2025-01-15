import { NavLink, Outlet } from "react-router-dom";
import "../Navbar.css";

const AdminNavbar = () => {
  return (
    <div className="navbar-container">
      {/* Sidebar */}
      <nav className="sidebar">
        <NavLink to="/admin" className="nav-link">
          Admin Page
        </NavLink>
        <NavLink to="/admin/add-new-car" className="nav-link">
          Add New Car
        </NavLink>
        <NavLink to="/admin/damage-reports" className="nav-link">
          Damage Reports
        </NavLink>
        <NavLink to="/admin/unavailable-cars" className="nav-link">
          Unavailable Cars
        </NavLink>
        <NavLink to="/admin/cars" className="nav-link">
          All Cars
        </NavLink>
        <NavLink to="/" className="nav-link">
          Log out
        </NavLink>
      </nav>

      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminNavbar;
