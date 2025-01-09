import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import CancelRequestModal from "../components/CancelRequestModal";

export default function UserPage() {
  const [user, setUser] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [currentlyRenting, setCurrentlyRentinge] = useState([]);
  const [modal, setModal] = useState(false);
  const [cancelReq, setCancelReq] = useState(null);

  const checkIfCurrentlyRenting = (startDate, endDate) => {
    // Get the current date
    const currentDate = new Date();

    // Convert startDate and endDate to Date objects
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Check if the current date is between startDate and endDate (inclusive)
    return currentDate >= start && currentDate <= end;
  };

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
        const pending = [];
        const approved = [];
        const renting = [];
        response.data.forEach((request) => {
          if (
            request.status === "pending" &&
            !checkIfCurrentlyRenting(request.startDate, request.endDate)
          ) {
            pending.push(request);
          } else if (
            request.status === "approved" &&
            !checkIfCurrentlyRenting(request.startDate, request.endDate)
          ) {
            approved.push(request);
            console.log(request);
          } else if (
            request.status === "approved" &&
            checkIfCurrentlyRenting(request.startDate, request.endDate)
          ) {
            renting.push(request);
          }
        });
        // Update state once with the collected data
        setPendingRequests(pending);
        setApprovedRequests(approved);
        setCurrentlyRentinge(renting);

        console.log("Approved requests:", approved);
      })
      .catch((error) => {
        console.error("Error fetching user requests:", error);
      });
  }, []);

  if (!user) {
    return <p>Loading...</p>;
  }

  const openModal = (request) => {
    setCancelReq(request);
    setModal(true);
  };

  return (
    <div className="user-page">
      <h1>User Page</h1>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
      <hr />
      <h3>Currently renting:</h3>
      {currentlyRenting.length > 0 ? (
        <div className="requests-container">
          {currentlyRenting.map((request) => (
            <div key={request.id} className="request-div-renting">
              <p>Car type: {request.carType}</p>
              <p>
                Duration: {request.startDate} to {request.endDate}
              </p>
              <p>Reason: {request.reason}</p>
              <p>Request status: {request.status}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>Currently not renting anything</p>
      )}
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
              <button onClick={() => openModal(request)}>Cancel request</button>
            </div>
          ))}
        </div>
      ) : (
        <p>No pending requests</p>
      )}
      <hr />
      <h4>Upcoming approved:</h4>
      {approvedRequests.length > 0 ? (
        <div className="requests-container">
          {approvedRequests.map((request) => (
            <div key={request.id} className="request-div-approved">
              <p>Car type: {request.carType}</p>
              <p>
                Duration: {request.startDate} to {request.endDate}
              </p>
              <p>Reason: {request.reason}</p>
              <p>Request status: {request.status}</p>
              <button onClick={() => openModal(request)}>Cancel request</button>
            </div>
          ))}
        </div>
      ) : (
        <p>No denied requests</p>
      )}
      {modal && (
        <CancelRequestModal setModal={setModal} cancelReq={cancelReq} />
      )}
    </div>
  );
}
