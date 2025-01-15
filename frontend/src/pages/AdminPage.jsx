import { useEffect, useState } from "react";
import axios from "axios";
import CheckRequest from "../components/CheckRequest";

export default function HomePage() {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [checkReqPage, setCheckReqPage] = useState(false);
  const [checkRequest, setCheckRequest] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:3000/user-requests/all-requests", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log(response.data);
        const pending_req = [];
        response.data.forEach((request) => {
          if (request.status === "pending") {
            pending_req.push(request);
          }
        });
        setPendingRequests(pending_req);
      })
      .catch((error) => {
        console.error("Error fetching user requests:", error);
      });
  }, [refresh]);

  const denyRequest = (request) => {
    const updated_req = { req_id: request._id, status: "denied" };
    axios
      .patch("http://localhost:3000/user-requests/deny-request", updated_req)
      .then((response) => {
        console.log(response.data);
        setRefresh(!refresh);
      });
  };

  const checkReq = (request) => {
    setCheckRequest(request);
    setCheckReqPage(true);
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

  return (
    <div>
      {!checkReqPage ? (
        <div className="pages">
          <h1>Admin Page</h1>
          <p>Welcome to administration page.</p>
          <p>
            Here you can see currently pending requests. You can either deny
            them or asign available cars.
          </p>
          <h2>Pending Requests</h2>
          {pendingRequests.length > 0 ? (
            <div className="requests-container">
              {pendingRequests.map((request) => (
                <div key={request._id} className="request-div-pending">
                  <p>
                    <strong>Employee name:</strong> {request.name}
                  </p>
                  <p>
                    <strong>Employee email:</strong> {request.email}
                  </p>
                  <p>
                    <strong>Car type: </strong>
                    {request.carType}
                  </p>
                  <p>
                    <strong>Reason:</strong> {request.reason}
                  </p>
                  <p>
                    <strong>Start Date:</strong>{" "}
                    {formatDateTime(request.startDate)}
                  </p>
                  <p>
                    <strong>End Date:</strong> {formatDateTime(request.endDate)}
                  </p>
                  <br />
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <button
                      style={{ marginRight: "30px" }}
                      onClick={() => checkReq(request)}
                    >
                      Check Avialibility
                    </button>
                    <button onClick={() => denyRequest(request)}>Deny</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No pending requests</p>
          )}
        </div>
      ) : (
        <div>
          <CheckRequest
            setCheckReqPage={setCheckReqPage}
            checkRequest={checkRequest}
          />
        </div>
      )}
    </div>
  );
}
