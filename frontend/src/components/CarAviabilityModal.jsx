import axios from "axios";
import { useState } from "react";

export default function CarAviabilityModal({
  setUnavailableCarModal,
  unavailableCar,
}) {
  const [damageReport, setDamageReport] = useState("");
  const makeCarUnavailable = () => {
    const token = localStorage.getItem("token");
    axios
      .patch(
        `http://localhost:3000/cars/${unavailableCar.carId}`,
        {
          aviability: false,
          damaged: true,
          damageReport: damageReport,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        console.log(res.data);
        setUnavailableCarModal(false);
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className="modal-background">
      <div className="modal-container">
        <button
          className="exit-modal"
          onClick={() => setUnavailableCarModal(false)}
        >
          X
        </button>
        <h3>Make the {unavailableCar.carBrand} unavailable</h3>
        <p>Please write the reason for making the car unavailable.</p>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="description">Description</label>
          <br />
          <textarea
            id="description"
            name="description"
            value={damageReport}
            onChange={(e) => setDamageReport(e.target.value)}
            placeholder="Describe the issue in detail"
            required
            style={{
              width: "480px",
              padding: "10px",
              marginTop: "5px",
              height: "100px",
              resize: "vertical",
            }}
          />
        </div>
        <button onClick={() => makeCarUnavailable()}>Make unavailable.</button>
      </div>
    </div>
  );
}
