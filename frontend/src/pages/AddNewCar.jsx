import { useState } from "react";
import axios from "axios";
import Modal from "react-modal";

// Set app element for accessibility
Modal.setAppElement("#root");

export default function AddNewCar() {
  const [newCar, setNewCar] = useState({
    brand: "",
    carType: "standard",
    fuel: "Diesel",
    MA_transmission: "Manual",
  });

  const [successModal, setSuccessModal] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCar({ ...newCar, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3000/cars", newCar)
      .then((res) => {
        console.log(res);
        setSuccessModal(true); // Show success modal
      })
      .catch((err) => console.error("Error adding car:", err));
  };

  const handleCloseModal = () => {
    setSuccessModal(false); // Close the modal
    window.location.reload(); // Reload the page
  };

  return (
    <div className="user-page">
      <h1>Add New Car</h1>
      <form onSubmit={handleSubmit}>
        {/* Brand Input */}
        <div>
          <label>
            <strong>Brand:</strong>
          </label>
          <input
            type="text"
            id="brand"
            name="brand"
            value={newCar.brand}
            onChange={handleInputChange}
            required
            style={{ width: "200px", height: "20px", marginLeft: "10px" }}
          />
        </div>

        {/* Car Type Radio Buttons */}
        <div className="radio-buttons-container">
          <label>
            <strong>Car Type:</strong>
          </label>
          <div>
            <label>
              <input
                type="radio"
                name="carType"
                value="standard"
                checked={newCar.carType === "standard"}
                onChange={handleInputChange}
              />
              Standard
            </label>
          </div>
          <div>
            <label>
              <input
                type="radio"
                name="carType"
                value="minivan"
                checked={newCar.carType === "minivan"}
                onChange={handleInputChange}
              />
              Minivan
            </label>
          </div>
          <div>
            <label>
              <input
                type="radio"
                name="carType"
                value="mini"
                checked={newCar.carType === "mini"}
                onChange={handleInputChange}
              />
              Mini
            </label>
          </div>
        </div>

        {/* Fuel Type Radio Buttons */}
        <div className="radio-buttons-container">
          <label>
            <strong>Fuel:</strong>
          </label>
          <div>
            <label>
              <input
                type="radio"
                name="fuel"
                value="Diesel"
                checked={newCar.fuel === "Diesel"}
                onChange={handleInputChange}
              />
              Diesel
            </label>
          </div>
          <div>
            <label>
              <input
                type="radio"
                name="fuel"
                value="Petrol"
                checked={newCar.fuel === "Petrol"}
                onChange={handleInputChange}
              />
              Petrol
            </label>
          </div>
        </div>

        {/* Transmission Type Radio Buttons */}
        <div className="radio-buttons-container">
          <label>
            <strong>Transmission:</strong>
          </label>
          <div>
            <label>
              <input
                type="radio"
                name="MA_transmission"
                value="Manual"
                checked={newCar.MA_transmission === "Manual"}
                onChange={handleInputChange}
              />
              Manual
            </label>
          </div>
          <div>
            <label>
              <input
                type="radio"
                name="MA_transmission"
                value="Automatic"
                checked={newCar.MA_transmission === "Automatic"}
                onChange={handleInputChange}
              />
              Automatic
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button type="submit">Add Car</button>
        </div>
      </form>

      {/* Success Modal */}
      <Modal
        isOpen={successModal}
        onRequestClose={handleCloseModal}
        contentLabel="Success Modal"
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            color: "black",
          },
        }}
      >
        <h2>Car Added Successfully!</h2>
        <button onClick={handleCloseModal} style={{ marginTop: "20px" }}>
          OK
        </button>
      </Modal>
    </div>
  );
}
