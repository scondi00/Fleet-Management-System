import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
export default function SignIn() {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const submitUser = (event) => {
    event.preventDefault();
    const { email, password } = user;
    const newErrors = {};
    if (!email) newErrors.email = true;
    if (!password) newErrors.password = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    try {
      axios.post("http://localhost:3000/login", user).then((response) => {
        localStorage.setItem("token", response.data.token);
        console.log(response);
        navigate("/user");
      });
    } catch (error) {
      console.error(error);
    }
  };

  const changeInput = (event) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
    setErrors({ ...errors, [name]: false });
  };

  return (
    <div>
      <h2>Sign In</h2>
      <form onSubmit={submitUser}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={user.email}
          onChange={changeInput}
          style={{ borderColor: errors.email ? "red" : "" }}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={user.password}
          onChange={changeInput}
          style={{ borderColor: errors.password ? "red" : "" }}
        />
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}
