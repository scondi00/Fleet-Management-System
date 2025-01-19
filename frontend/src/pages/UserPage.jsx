import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import CancelRequestModal from "../components/CancelRequestModal";

export default function UserPage() {
  const [user, setUser] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [currentlyRenting, setCurrentlyRenting] = useState([]);
  const [modal, setModal] = useState(false);
  const [cancelReq, setCancelReq] = useState(null);

  const checkIfCurrentlyRenting = (startDate, endDate) => {
    const currentDate = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    return currentDate >= start && currentDate <= end;
  };

  const checkIfDateIsPassed = (endDate) => {
    const currentDate = new Date();
    const end = new Date(endDate);
    return currentDate >= end;
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found");
        return;
      }

      try {
        const decodedToken = jwtDecode(token);

        // Fetch user data
        const userResponse = await axios.get("http://localhost:3000/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userResponse.data);

        // Fetch user requests
        const requestsResponse = await axios.get(
          "http://localhost:3000/user-requests/my-requests",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const pending = [];
        const approvedWithoutCarDetails = [];
        const rentingWithoutCarDetails = [];

        requestsResponse.data.forEach((request) => {
          if (request.status === "pending") {
            pending.push(request);
          } else if (
            request.status === "approved" &&
            !checkIfCurrentlyRenting(request.startDate, request.endDate) &&
            !checkIfDateIsPassed(request.endDate)
          ) {
            approvedWithoutCarDetails.push(request);
          } else if (
            request.status === "approved" &&
            checkIfCurrentlyRenting(request.startDate, request.endDate)
          ) {
            rentingWithoutCarDetails.push(request);
          }
        });

        setPendingRequests(pending);

        // Fetch car details for approved requests
        const approvedWithCarDetails = await Promise.all(
          approvedWithoutCarDetails.map(async (request) => {
            const carResponse = await axios.get(
              `http://localhost:3000/cars/${request.assigned_car_id}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            return {
              ...request,
              brand: carResponse.data.brand,
              fuel: carResponse.data.fuel,
              MA_transmission: carResponse.data.MA_transmission,
            };
          })
        );

        setApprovedRequests(approvedWithCarDetails);

        // Fetch car details for currently renting requests
        const rentingWithCarDetails = await Promise.all(
          rentingWithoutCarDetails.map(async (request) => {
            const carResponse = await axios.get(
              `http://localhost:3000/cars/${request.assigned_car_id}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            return {
              ...request,
              brand: carResponse.data.brand,
              fuel: carResponse.data.fuel,
              MA_transmission: carResponse.data.MA_transmission,
            };
          })
        );

        setCurrentlyRenting(rentingWithCarDetails);
      } catch (error) {
        console.error("Error fetching user data or requests:", error);
      }
    };

    fetchUserData();
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
        <div className="requests">
          {currentlyRenting.map((request) => (
            <div key={request.id} className="request-div-renting">
              <p>
                <strong>Car:</strong> {request.brand}
              </p>
              <p>
                <strong>Fuel:</strong> {request.fuel}
              </p>
              <p>
                <strong>Transmission:</strong> {request.MA_transmission}
              </p>
              <p>
                <strong>Start Date: </strong>
                {formatDateTime(request.startDate)}
              </p>
              <p>
                <strong>End Date:</strong> {formatDateTime(request.endDate)}
              </p>

              <p>Request status: {request.status}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>Currently not renting anything</p>
      )}
      <hr />

      <h3>Pending requests:</h3>
      <div className="requests-pending-container">
        {pendingRequests.length > 0 ? (
          pendingRequests.map((request) => (
            <div key={request.id} className="request-div-pending">
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
              <button onClick={() => openModal(request)}>Cancel request</button>
            </div>
          ))
        ) : (
          <p>No pending requests</p>
        )}
      </div>

      <hr />

      <h4>Upcoming approved:</h4>
      {approvedRequests.length > 0 ? (
        <div className="requests">
          {approvedRequests.map((request) => (
            <div key={request.id} className="request-div-approved">
              <p>
                <strong>Car:</strong> {request.brand}
              </p>
              <p>
                <strong>Fuel:</strong> {request.fuel}
              </p>
              <p>
                <strong>Transmission:</strong> {request.MA_transmission}
              </p>
              <p>
                <strong>Start Date: </strong>
                {formatDateTime(request.startDate)}
              </p>
              <p>
                <strong>End Date:</strong> {formatDateTime(request.endDate)}
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
