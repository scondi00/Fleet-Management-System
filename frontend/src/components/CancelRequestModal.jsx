import axios from "axios";

export default function CancelRequestModal({ setModal, cancelReq }) {
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
      })
      .catch((error) => {
        console.error("Error cancelling reservation:", error);
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
        <p>Are you sure you want to cancel the requests?</p>
        <button onClick={() => checkReqStatus()}>Yes, cancel.</button>
      </div>
    </div>
  );
}
