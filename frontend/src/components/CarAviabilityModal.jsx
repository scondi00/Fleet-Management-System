import axios from "axios";

export default function CarAviabilityModal({
  setUnavailableCarModal,
  unavailableCar,
}) {
  const makeCarUnavailable = () => {
    axios
      .patch(`http://localhost:3000/cars/${unavailableCar.carId}`, {
        aviability: {
          isAvailable: false,
        },
        damaged: true,
      })
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
        <p>Are you sure you want to report car as damaged and unavailable?</p>
        <button onClick={() => makeCarUnavailable()}>Yes.</button>
      </div>
    </div>
  );
}
