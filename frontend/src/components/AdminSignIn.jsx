import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
export default function AdminSignIn() {
  const [admin, setAdmin] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const submitUser = (event) => {
    event.preventDefault();
    const { email, password } = admin;
    const newErrors = {};
    if (!email) newErrors.email = true;
    if (!password) newErrors.password = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    try {
      axios.post("http://localhost:3000/login", admin).then((response) => {
        localStorage.setItem("token", response.data);
        const decodedToken = jwtDecode(response.data);
        const { email, role } = decodedToken;
        if (role !== "admin") {
          alert("You are not an admin");
          return;
        } else {
          navigate("/admin");
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  const changeInput = (event) => {
    const { name, value } = event.target;
    setAdmin({ ...admin, [name]: value });
    setErrors({ ...errors, [name]: false });
  };

  return (
    <div>
      <h2>Sign In Admin</h2>
      <form onSubmit={submitUser}>
        <label htmlFor="email">Admin Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={admin.email}
          onChange={changeInput}
          style={{ borderColor: errors.email ? "red" : "" }}
        />
        <label htmlFor="password">Admin Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={admin.password}
          onChange={changeInput}
          style={{ borderColor: errors.password ? "red" : "" }}
        />
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}
