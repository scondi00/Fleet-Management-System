import { NavLink, Outlet } from "react-router-dom";
import "../Navbar.css";
import { RiAdminLine } from "react-icons/ri";
import { IoIosAddCircleOutline } from "react-icons/io";
import { FaCarBurst } from "react-icons/fa6";
import { BiSolidCarMechanic } from "react-icons/bi";
import { BiSolidCarGarage } from "react-icons/bi";
import { MdOutlineLogout } from "react-icons/md";
const AdminNavbar = () => {
  return (
    <div className="navbar-container">
      {/* Sidebar */}
      <nav className="sidebar">
        <NavLink to="/admin" className="nav-link">
          Admin Page
          <RiAdminLine />
        </NavLink>
        <NavLink to="/admin/add-new-car" className="nav-link">
          Add New Car
          <IoIosAddCircleOutline />
        </NavLink>
        <NavLink to="/admin/damage-reports" className="nav-link">
          Damage Reports
          <FaCarBurst />
        </NavLink>
        <NavLink to="/admin/unavailable-cars" className="nav-link">
          Unavailable Cars
          <BiSolidCarMechanic />
        </NavLink>
        <NavLink to="/admin/cars" className="nav-link">
          All Cars
          <BiSolidCarGarage />
        </NavLink>
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

export default AdminNavbar;
