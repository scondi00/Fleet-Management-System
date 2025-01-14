import { useEffect, useState } from "react";
import axios from "axios";
import Calendar from "react-calendar"; // Install using `npm install react-calendar`
import "../CalendarStyles.css";

export default function AllCars() {
  const [allCars, setAllCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:3000/cars").then((res) => {
      setAllCars(res.data);
    });
  }, []);

  const handleCarClick = (car) => {
    setSelectedCar(car);
  };

  return (
    <div>
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
            <strong>Damaged:</strong> {selectedCar.damaged ? "Yes" : "No"}
            <p>
              <strong>Available:</strong>{" "}
              {selectedCar.aviability.isAvailable ? "Yes" : "No"}
            </p>
          </p>

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
    </div>
  );
}
