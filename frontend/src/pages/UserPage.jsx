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
  const checkIfDateIsPassed = (endDate) => {
    // Get the current date
    const currentDate = new Date();

    const end = new Date(endDate);

    // Check if the current date is after the endDate
    return currentDate >= end;
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:3000/users", {
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
          if (request.status === "pending") {
            pending.push(request);
          } else if (
            request.status === "approved" &&
            !checkIfCurrentlyRenting(request.startDate, request.endDate) &&
            !checkIfDateIsPassed(request.endDate)
          ) {
            approved.push(request);
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
      })
      .catch((error) => {
        console.error("Error fetching user requests:", error);
      });
  }, [modal]);

  if (!user) {
    return <p>Loading...</p>;
  }

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const openModal = (request) => {
    setCancelReq(request);
    setModal(true);
  };

  return (
    <div className="pages">
      <h1>Welcome {user.name}</h1>
      <p>Email: {user.email}</p>
      <hr />
      <h3>Currently renting:</h3>
      {currentlyRenting.length > 0 ? (
        <div className="requests-container">
          {currentlyRenting.map((request) => (
            <div key={request.id} className="request-div-renting">
              <p>
                <strong>Car type:</strong> {request.carType}
              </p>
              <p>
                <strong>Start Date: </strong>
                {formatDateTime(request.startDate)}
              </p>
              <p>
                <strong>End Date:</strong> {formatDateTime(request.endDate)}
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
      <div className="scrollable-container">
        {pendingRequests.length > 0 ? (
          <div className="scrollable-content">
            {pendingRequests.map((request) => (
              <div key={request.id} className="card">
                <p>
                  <strong>Car type:</strong> {request.carType}
                </p>
                <p>
                  <strong>Reason: </strong>
                  {request.reason}
                </p>
                <p>
                  <strong>Start Date: </strong>
                  {formatDateTime(request.startDate)}
                </p>
                <p>
                  <strong>End Date:</strong> {formatDateTime(request.endDate)}
                </p>
                <p>
                  <strong>Status:</strong> {request.status}
                </p>
                <button onClick={() => openModal(request)}>
                  Cancel request
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>No pending requests</p>
        )}
      </div>
      <hr />
      <h4>Upcoming approved:</h4>
      {approvedRequests.length > 0 ? (
        <div className="requests-container">
          {approvedRequests.map((request) => (
            <div key={request.id} className="request-div-approved">
              <p>
                <strong>Car type:</strong> {request.carType}
              </p>
              <p>
                <strong>Start Date: </strong>
                {formatDateTime(request.startDate)}
              </p>
              <p>
                <strong>End Date:</strong> {formatDateTime(request.endDate)}
              </p>
              <p>
                <strong>Reason:</strong> {request.reason}
              </p>
              <p>
                <strong>Request status:</strong> {request.status}
              </p>
              <button onClick={() => openModal(request)}>Cancel request</button>
            </div>
          ))}
        </div>
      ) : (
        <p>No upcoming reservations</p>
      )}
      {modal && (
        <CancelRequestModal setModal={setModal} cancelReq={cancelReq} />
      )}
    </div>
  );
}
