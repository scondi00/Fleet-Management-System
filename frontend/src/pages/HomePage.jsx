//import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import SignIn from "../components/SignIn";
import Register from "../components/Register";
import AdminSignIn from "../components/AdminSignIn";
export default function HomePage() {
  const [signIn, setSignIn] = useState(false);
  const [register, setRegister] = useState(false);
  const [admin, setAdmin] = useState(false);
  return (
    <div>
      <h1>Welcome to the Car Park</h1>
      <p>Please sign in or register!</p>
      <button
        onClick={() => {
          setSignIn(true);
          setRegister(false);
          setAdmin(false);
        }}
      >
        Sign in
      </button>
      <button
        onClick={() => {
          setSignIn(false);
          setRegister(false);
          setAdmin(true);
        }}
      >
        Admin
      </button>
      <button
        onClick={() => {
          setRegister(true);
          setSignIn(false);
          setAdmin(false);
        }}
      >
        Register
      </button>
      {signIn && <SignIn />}
      {register && <Register />}
      {admin && <AdminSignIn />}
      <Outlet />
    </div>
  );
}
