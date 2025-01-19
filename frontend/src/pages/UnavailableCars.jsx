import axios from "axios";
import { useEffect, useState } from "react";
import ReactModal from "react-modal";

ReactModal.setAppElement("#root");

export default function UnavailableCars() {
  const [unavailableCars, setUnavailableCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [modal, setModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:3000/cars/unavailable", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log(res.data);
        setUnavailableCars(res.data);
      });
  }, []);

  const handleMakeAvailable = () => {
    if (!selectedCar) return;
    const token = localStorage.getItem("token");
    axios
      .patch(
        `http://localhost:3000/cars/${selectedCar._id}`,
        {
          aviability: true,
          damageReport: "",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        setModal(false);
        window.location.reload(); // Reload the page
      })
      .catch((err) => {
        console.error("Error making car available:", err);
      });
  };

  return (
    <div className="pages">
      <h1>Unavailable Cars:</h1>
      <div>
        {unavailableCars.length > 0 ? (
          <div style={{ display: "flex", gap: "10px" }}>
            {unavailableCars.map((car) => (
              <div key={car._id} className="unavailable-cars">
                <p>
                  <strong>{car.brand}</strong>
                </p>
                <p>
                  <strong>Report:</strong>
                  <p>{car.damageReport}</p>
                </p>
                <button
                  onClick={() => {
                    setSelectedCar(car);
                    setModal(true);
                  }}
                >
                  Make car available
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>No unavailable cars.</p>
        )}
      </div>

      {/* Modal for Confirming Action */}
      <ReactModal
        isOpen={modal}
        onRequestClose={() => setModal(false)}
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h2>Make Car Available</h2>
        <p>Are you sure you want to make this car available?</p>
        <p>If yes, the report will also be considered as resolved.</p>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={handleMakeAvailable}>Yes</button>
          <button onClick={() => setModal(false)}>No</button>
        </div>
      </ReactModal>
    </div>
  );
}
