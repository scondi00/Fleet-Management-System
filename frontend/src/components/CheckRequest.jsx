import { useEffect, useState } from "react";
import axios from "axios";

export default function CheckRequest({ setCheckReqPage, checkRequest }) {
  const [availableCars, setAvailableCars] = useState(null);
  const [message, setMessage] = useState(null);
  const [modal, setModal] = useState(false);
  const [modalMsg, setModalMsg] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3000/cars/available", {
        params: {
          carType: checkRequest.carType,
          startDate: checkRequest.startDate,
          endDate: checkRequest.endDate,
        },
      })
      .then((res) => {
        console.log(res.data);
        // Check if the response contains a message or availableCars
        if (res.data.message) {
          setMessage(res.data.message); // Set the no cars message
          setAvailableCars(null); // Ensure no cars are displayed
        } else if (res.data.availableCars) {
          setAvailableCars(res.data.availableCars); // Set the available cars
          setMessage(null); // Clear any previous message
        }
      })
      .catch((error) => {
        console.error("Error fetching available cars:", error);
        setMessage("An error occurred while fetching available cars.");
      });
  }, [checkRequest]);

  const approveRequest = (car) => {
    // First, add reservations to the car
    axios
      .patch("http://localhost:3000/cars/approve", {
        startDate: checkRequest.startDate,
        endDate: checkRequest.endDate,
        requester_id: checkRequest.requester,
        request_id: checkRequest._id,
        car_id: car._id,
      })
      .then((response) => {
        console.log("Car reservation successfully updated:", response.data);

        // Update the request status
        const payload = {
          req_id: checkRequest._id,
          status: "approved",
          car_id: car._id,
        };
        console.log("Payload for updating request status:", payload);

        axios
          .patch("http://localhost:3000/user-requests/approve-request", payload)
          .then((response) => {
            console.log("Request status successfully updated:", response.data);
            // Optionally, add any additional UI updates or state changes here
          })
          .catch((error) => {
            console.error(
              "Error updating request status:",
              error.response?.data || error.message
            );
          });
      })
      .catch((error) => {
        console.error(
          "Error approving car reservation:",
          error.response?.data || error.message
        );
      });
  };

  return (
    <div className="user-page">
      <button onClick={() => setCheckReqPage(false)}>
        Back to pending requests
      </button>
      <div>
        <h2>Check request for:</h2>
        <p>Employee name: {checkRequest.name}</p>
        <p>Employee email: {checkRequest.email}</p>
        <h2>Specific requests</h2>
        <p>Car type: {checkRequest.carType}</p>
        <p>Start Date: {checkRequest.startDate}</p>
        <p>End Date: {checkRequest.endDate}</p>
      </div>

      <h2>Available cars:</h2>
      <div>
        {message && <p>{message}</p>}{" "}
        {/* Display the message if there are no cars */}
        {availableCars && (
          <ul>
            {availableCars.map((car, index) => (
              <div key={index} className="available-cars-div">
                <h4>{car.brand}</h4>
                <p>{car.fuel}</p>
                <p>{car.MA_transmission}</p>
                <button onClick={() => approveRequest(car)}>
                  Approve request
                </button>
              </div>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
