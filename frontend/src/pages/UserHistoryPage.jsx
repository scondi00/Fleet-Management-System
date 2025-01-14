import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import IssueForm from "../components/IssueForm";

export default function UserHistoryPage() {
  const [deniedRequests, setDeniedRequests] = useState([]);
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [user, setUser] = useState(null);
  const [modal, setModal] = useState(false);
  const [problemReq, setProblemReq] = useState(null);

  const checkIfPastRequests = (endDate) => {
    // Get the current date
    const currentDate = new Date();

    // Convert startDate and endDate to Date objects

    const end = new Date(endDate);

    // Check if the current date after endDate (inclusive)
    return currentDate >= end;
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
        const approved = [];
        const denied = [];
        response.data.forEach((request) => {
          if (
            request.status === "approved" &&
            checkIfPastRequests(request.endDate)
          ) {
            approved.push(request);
          } else if (request.status === "denied") {
            denied.push(request);
          }
        });
        // Update state once with the collected data
        setApprovedRequests(approved);
        setDeniedRequests(denied);

        console.log("Approved requests:", approved);
      })
      .catch((error) => {
        console.error("Error fetching user requests:", error);
      });
  }, []);

  if (!user) {
    return <p>Loading...</p>;
  }
  return (
    <div className="pages">
      <h1>My history:</h1>
      <h2>Past approved requests:</h2>
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
              <br />
              <button
                onClick={() => {
                  setModal(true);
                  setProblemReq(request);
                }}
              >
                Report Car Issue
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No past approved requests</p>
      )}
      <hr />
      <h2>Denied requests:</h2>
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
      {modal && <IssueForm setModal={setModal} problemReq={problemReq} />}
    </div>
  );
}
