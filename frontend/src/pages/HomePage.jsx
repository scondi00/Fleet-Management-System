import { useState } from "react";
import Register from "../components/Register";
import AdminSignIn from "../components/AdminSignIn";
import SignIn from "../components/SignIn";

export default function HomePage() {
  const [signIn, setSignIn] = useState(false);
  const [register, setRegister] = useState(false);
  const [admin, setAdmin] = useState(false);

  return (
    <div>
      <div
        className="cover-img"
        style={{
          backgroundImage: "url('src/assets/background.jpg')",
        }}
      >
        <h1 style={{ textAlign: "center" }}>Welcome to the Car Park</h1>
      </div>

      <p style={{ textAlign: "center" }}>Please sign in or register!</p>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "20px",
          gap: "10px",
        }}
      >
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
            setRegister(true);
            setAdmin(false);
          }}
        >
          Register
        </button>
        <button
          onClick={() => {
            setSignIn(false);
            setRegister(false);
            setAdmin(true);
          }}
        >
          Admin Sign in
        </button>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        {signIn && <SignIn />}
        {register && <Register />}
        {admin && <AdminSignIn />}
      </div>
    </div>
  );
}
