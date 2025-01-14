import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/HomePage";
import NotFound from "./pages/NotFoundPage";
import UserPage from "./pages/UserPage";
import UserRequestForm from "./pages/UserRequestForm";
import Navbar from "./components/Navbar";
import Admin from "./pages/AdminPage";
import AdminNavbar from "./components/AdminNavbar";
import AddNewCar from "./pages/AddNewCar";
import UserHistoryPage from "./pages/UserHistoryPage";
import DamageReports from "./pages/DamageReportsPage";
import UnavailableCars from "./pages/UnavailableCars";
import AllCars from "./pages/AllCars";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/user" element={<Navbar />}>
        <Route index element={<UserPage />} />
        <Route path="request-form" element={<UserRequestForm />} />
        <Route path="history" element={<UserHistoryPage />} />
      </Route>
      <Route path="/admin" element={<AdminNavbar />}>
        <Route index element={<Admin />} />
        <Route path="add-new-car" element={<AddNewCar />} />
        <Route path="damage-reports" element={<DamageReports />} />
        <Route path="unavailable-cars" element={<UnavailableCars />} />
        <Route path="cars" element={<AllCars />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
