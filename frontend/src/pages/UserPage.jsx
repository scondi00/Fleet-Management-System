import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function UserPage() {
  const [user, setUser] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [deniedRequests, setDeniedRequests] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:3000/user", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setUser(response.data);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
    const decodedToken = jwtDecode(token);
    const { id, role } = decodedToken;
    axios
      .get(`http://localhost:3000/user-requests/my-requests`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log(response.data);
        const pending = [];
        const approved = [];
        const denied = [];
        response.data.forEach((request) => {
          if (request.status === "pending") {
            pending.push(request);
          } else if (request.status === "approved") {
            approved.push(request);
          } else if (request.status === "denied") {
            denied.push(request);
          }
        });
        // Update state once with the collected data
        setPendingRequests(pending);
        setApprovedRequests(approved);
        setDeniedRequests(denied);

        console.log("Pending requests:", pending);
      })
      .catch((error) => {
        console.error("Error fetching user requests:", error);
      });
  }, []);

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="user-page">
      <h1>User Page</h1>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
      <hr />
      <h3>Pending requests:</h3>
      {pendingRequests.length > 0 ? (
        <div className="requests-container">
          {pendingRequests.map((request) => (
            <div key={request.id} className="request-div-pending">
              <p>Car type: {request.carType}</p>
              <p>Reason: {request.reason}</p>
              <p>Start Date: {request.startDate}</p>
              <p>End Date: {request.endDate}</p>
              <p>Status: {request.status}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No pending requests</p>
      )}
      <hr />
      <h4>Apporved</h4>
      <hr />
      <h4>Denied</h4>
      {deniedRequests.length > 0 ? (
        <div className="requests-container">
          {deniedRequests.map((request) => (
            <div key={request.id} className="request-div-denied">
              <p>Car type: {request.carType}</p>
              <p>Reason: {request.reason}</p>
              <p>Start Date: {request.startDate}</p>
              <p>End Date: {request.endDate}</p>
              <p>Status: {request.status}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No denied requests</p>
      )}
    </div>
  );
}
