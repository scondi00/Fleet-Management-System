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

  return (
    <div>
      {!checkReqPage ? (
        <div className="user-page">
          <h1>Admin Page</h1>
          <p>Welcome Admin dude</p>
          <h2>Pending Requests</h2>
          {pendingRequests.length > 0 ? (
            <div className="requests-container">
              {pendingRequests.map((request) => (
                <div key={request._id} className="request-div-pending">
                  <p>Employee name: {request.name}</p>
                  <p>Employee email: {request.email}</p>
                  <p>Car type: {request.carType}</p>
                  <p>Reason: {request.reason}</p>
                  <p>Start Date: {request.startDate}</p>
                  <p>End Date: {request.endDate}</p>
                  <br />
                  <button onClick={() => checkReq(request)}>
                    Check Avialibility
                  </button>
                  <button onClick={() => denyRequest(request)}>Deny</button>
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
