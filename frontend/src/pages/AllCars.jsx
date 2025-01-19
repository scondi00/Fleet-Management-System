import { useEffect, useState } from "react";
import axios from "axios";
import Calendar from "react-calendar"; // Install using `npm install react-calendar`
import ReactModal from "react-modal";
import "../CalendarStyles.css";

ReactModal.setAppElement("#root"); // Set app element for accessibility

export default function AllCars() {
  const [allCars, setAllCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [actionModal, setActionModal] = useState(false);
  const [actionType, setActionType] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:3000/cars", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setAllCars(res.data);
      });
  }, []);

  const handleCarClick = (car) => {
    setSelectedCar(car);
  };

  const handleActionConfirm = () => {
    const token = localStorage.getItem("token");
    const isAvailable = actionType === "make-available";
    axios
      .patch(
        `http://localhost:3000/cars/${selectedCar._id}`,
        {
          aviability: isAvailable,
          damageReport: description,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        setActionModal(false);
        window.location.reload(); // Reload the page
      })
      .catch((err) => {
        console.error("Error updating car availability:", err);
      });
  };

  return (
    <div className="pages">
      <h1>All Cars</h1>

      {/* Horizontal List */}
      <div className="car-list">
        {allCars.map((car) => (
          <div
            key={car._id}
            className="car-item"
            onClick={() => handleCarClick(car)}
          >
            <h3>{car.brand}</h3>
          </div>
        ))}
      </div>

      {/* Car Details */}
      <br />
      <hr />
      {selectedCar && (
        <div className="car-details">
          <h2>{selectedCar.brand}</h2>
          <p>
            <strong>Type:</strong> {selectedCar.carType} <strong>Fuel: </strong>
            {selectedCar.fuel} <strong>Transmission:</strong>{" "}
            {selectedCar.MA_transmission}
          </p>
          <p>
            <strong>Reported damage:</strong>{" "}
            {selectedCar.damaged ? "Yes" : "No"}
          </p>
          <p>
            <strong>Available:</strong> {selectedCar.aviability ? "Yes" : "No"}
          </p>
          {selectedCar.aviability ? (
            ""
          ) : (
            <div>
              <p>
                <strong>Report:</strong>
                <p>{selectedCar.damageReport}</p>
              </p>
            </div>
          )}

          {/* Button to Toggle Availability */}
          {selectedCar.aviability ? (
            <button
              onClick={() => {
                setActionType("make-unavailable");
                setActionModal(true);
              }}
            >
              Make Car Unavailable
            </button>
          ) : (
            <button
              onClick={() => {
                setActionType("make-available");
                setActionModal(true);
                setDescription("");
              }}
            >
              Make Car Available
            </button>
          )}

          {/* Calendar with Reservations */}
          <h3>Reservations:</h3>
          <Calendar
            tileContent={({ date }) => {
              const formattedDate = date.toISOString().split("T")[0];
              const reservation = selectedCar.reservations.find(
                (r) =>
                  new Date(r.startDate).toISOString().split("T")[0] <=
                    formattedDate &&
                  formattedDate <=
                    new Date(r.endDate).toISOString().split("T")[0]
              );
              return reservation ? (
                <span className="reserved">Reserved</span>
              ) : null;
            }}
          />
        </div>
      )}

      <ReactModal
        isOpen={actionModal}
        onRequestClose={() => setActionModal(false)}
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h2>
          {actionType === "make-unavailable"
            ? "Make Car Unavailable"
            : "Make Car Available"}
        </h2>
        <p>
          Are you sure you want to{" "}
          {actionType === "make-unavailable"
            ? "make this car unavailable"
            : "make this car available"}
          ?
        </p>
        <p>
          {" "}
          {actionType === "make-unavailable" ? (
            <div>
              <p>Please enter reason for making the car unavailable:</p>
              <div style={{ marginBottom: "15px" }}>
                <label htmlFor="description">Description</label>
                <br />
                <textarea
                  id="description"
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the issue in detail"
                  required
                  style={{
                    width: "90%",
                    padding: "10px",
                    marginTop: "5px",
                    height: "100px",
                    resize: "vertical",
                  }}
                />
              </div>
            </div>
          ) : (
            ""
          )}
        </p>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={handleActionConfirm}>Confirm</button>
          <button onClick={() => setActionModal(false)}>Cancel</button>
        </div>
      </ReactModal>
    </div>
  );
}
