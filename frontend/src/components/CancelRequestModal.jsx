import axios from "axios";
import { useState } from "react";

export default function CancelRequestModal({ setModal, cancelReq }) {
  const [successMsg, setSuccessMessage] = useState(null);
  const cancelPendingRequest = () => {
    axios
      .delete(`http://localhost:3000/cars/delete-pending-req`, {
        data: {
          reservation_id: cancelReq._id,
        },
      })
      .then((response) => {
        console.log("Reservation cancelled:", response.data);
      })
      .catch((error) => {
        console.error("Error cancelling reservation:", error);
      });
  };

  const cancelApprovedRequest = () => {
    axios
      .delete(`http://localhost:3000/cars/delete-approved-req`, {
        data: {
          car_id: cancelReq.assigned_car_id,
          reservation_id: cancelReq._id,
        },
      })
      .then((response) => {
        console.log("Reservation cancelled:", response.data);
        setSuccessMessage("Reservation was succesfully deleted.");
      })
      .catch((error) => {
        console.error("Error cancelling reservation:", error);
        setSuccessMessage(
          "An error ocurred while trying to delete the reservation, please try again."
        );
      });
  };

  const checkReqStatus = () => {
    if (cancelReq.status === "approved") {
      cancelApprovedRequest();
    } else if (cancelReq.status === "pending") {
      cancelPendingRequest();
    }
  };
  return (
    <div className="modal-background">
      <div className="modal-container">
        <button className="exit-modal" onClick={() => setModal(false)}>
          X
        </button>
        <h3>Cancel request</h3>
        {!successMsg ? (
          <div>
            <p>Are you sure you want to cancel the requests?</p>
            <button onClick={() => checkReqStatus()}>Yes, cancel.</button>
          </div>
        ) : (
          <div>
            <p style={{ color: "purple" }}>{successMsg}</p>
          </div>
        )}
      </div>
    </div>
  );
}
