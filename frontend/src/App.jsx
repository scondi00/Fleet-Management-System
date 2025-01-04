import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/HomePage";
import NotFound from "./pages/NotFoundPage";
import User from "./pages/UserPage";
import UserRequest from "./pages/UserRequests";
import Navbar from "./components/Navbar";
import Admin from "./pages/AdminPage";
import AdminNavbar from "./components/AdminNavbar";
import AdminRequests from "./pages/AdminRequestPage";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/user" element={<Navbar />}>
        <Route index element={<User />} />
        <Route path="requests" element={<UserRequest />} />
      </Route>
      <Route path="/admin" element={<AdminNavbar />}>
        <Route index element={<Admin />} />
        <Route path="requests" element={<AdminRequests />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
