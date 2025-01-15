import axios from "axios";

export default function FixProblemModal({ setFixProblemModal, fixProblem }) {
  const handleFixProblem = () => {
    axios
      .patch(`http://localhost:3000/cars/${fixProblem.carId}`, {
        damaged: false,
      })
      .then((res) => {
        console.log(res.data);
        return axios.patch(
          `http://localhost:3000/issue-reports/${fixProblem._id}`,
          {
            status: "resolved",
          }
        );
      })
      .then((res) => {
        console.log("Issue report updated:", res.data);
        setFixProblemModal(false);
      })
      .catch((err) => console.error("Error updating data:", err));
  };

  return (
    <div className="modal-background">
      <div className="modal-container">
        <button
          className="exit-modal"
          onClick={() => setFixProblemModal(false)}
        >
          X
        </button>
        <h3>Damaged was fixed </h3>
        <p>Was the reported car problem fixed ?</p>
        <button onClick={() => handleFixProblem()}>Yes.</button>
      </div>
    </div>
  );
}
