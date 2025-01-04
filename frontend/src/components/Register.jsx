import { useState } from "react";
import axios from "axios";
export default function Register() {
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const [errors, setErrors] = useState({});

  const submitUser = (event) => {
    event.preventDefault();
    const { name, email, password, role } = newUser;
    const newErrors = {};
    if (!name) newErrors.name = true;
    if (!email) newErrors.email = true;
    if (!password) newErrors.password = true;
    if (!role) newErrors.role = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    try {
      axios.post("http://localhost:3000/register", newUser).then((response) => {
        console.log(response.data);
      });
    } catch (error) {
      console.error(error);
    }
  };

  const changeInput = (event) => {
    const { name, value } = event.target;
    setNewUser({ ...newUser, [name]: value });
    setErrors({ ...errors, [name]: false });
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={submitUser}>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={newUser.name}
          onChange={changeInput}
          style={{ borderColor: errors.name ? "red" : "" }}
        />

        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={newUser.email}
          onChange={changeInput}
          style={{ borderColor: errors.email ? "red" : "" }}
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={newUser.password}
          onChange={changeInput}
          style={{ borderColor: errors.password ? "red" : "" }}
        />

        <label>Role</label>
        <div>
          <input
            type="radio"
            id="admin"
            name="role"
            value="admin"
            checked={newUser.role === "admin"}
            onChange={changeInput}
          />
          <label htmlFor="admin">Administrator</label>
        </div>
        <div>
          <input
            type="radio"
            id="user"
            name="role"
            value="user"
            checked={newUser.role === "user"}
            onChange={changeInput}
          />
          <label htmlFor="user">Employee</label>
        </div>

        <button type="submit">Register</button>
      </form>
    </div>
  );
}
