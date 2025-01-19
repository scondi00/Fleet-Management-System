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

    const end = new Date(endDate);

    // Check if the current date after endDate (inclusive)
    return currentDate >= end;
  };

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
      .then(async (response) => {
        const denied = [];
        const approvedPromises = response.data.map(async (request) => {
          if (
            request.status === "approved" &&
            checkIfPastRequests(request.endDate)
          ) {
            const carResponse = await axios.get(
              `http://localhost:3000/cars/${request.assigned_car_id}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            return { ...request, brand: carResponse.data.brand };
          } else if (request.status === "denied") {
            denied.push(request);
          }
          return null;
        });

        const resolvedApproved = await Promise.all(approvedPromises);
        const filteredApproved = resolvedApproved.filter((req) => req !== null);

        setApprovedRequests(filteredApproved);
        setDeniedRequests(denied);
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
      {approvedRequests ? (
        <div className="requests-container-available">
          {approvedRequests.map((req) => (
            <div key={req.id} className="request-div-approved">
              <p>
                <strong>Car:</strong> {req.brand}
              </p>
              <p>
                <strong>Duration:</strong>{" "}
                <u>{formatDateTime(req.startDate)}</u> to{" "}
                <u>{formatDateTime(req.endDate)}</u>
              </p>
              <p>
                <strong>Reason:</strong> {req.reason}
              </p>
              <p>
                <strong>Request status:</strong> {req.status}
              </p>
              <br />
              <button
                onClick={() => {
                  setModal(true);
                  setProblemReq(req);
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
        <div className="requests-container-denied">
          {deniedRequests.map((request) => (
            <div key={request.id} className="request-div-denied">
              <p>
                <strong>Car type:</strong> {request.carType}
              </p>
              <p>
                <strong>Reason:</strong> {request.reason}
              </p>
              <p>
                <strong>Duration:</strong>{" "}
                <u>{formatDateTime(request.startDate)}</u> to{" "}
                <u>{formatDateTime(request.endDate)}</u>
              </p>
              <p>
                <strong>Status:</strong> {request.status}
              </p>
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
