import { useEffect, useState } from "react";
import axios from "axios";
import ReactModal from "react-modal"; // Import React Modal
import CarAviabilityModal from "../components/CarAviabilityModal";
import DeleteReportModal from "../components/DeleteReportModal";
import FixProblemModal from "../components/modals/FixProblemModal";

ReactModal.setAppElement("#root"); // Set the app element for accessibility

export default function DamageReports() {
  const [damageReports, setDamageReports] = useState(null);
  const [deleteReportModal, setDeleteReportModal] = useState(false);
  const [deleteReport, setDeleteReport] = useState(null);
  const [unavailableCar, setUnavailableCar] = useState(null);
  const [unavailableCarModal, setUnavailableCarModal] = useState(false);
  const [fixProblemModal, setFixProblemModal] = useState(false);
  const [fixProblem, setFixProblem] = useState(null);
  const [makeCarAvailableModal, setMakeCarAvailableModal] = useState(false); // Modal state
  const [carToMakeAvailable, setCarToMakeAvailable] = useState(null); // Selected car

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:3000/issue-reports", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((result) => {
        setDamageReports(result.data);

        result.data.forEach((report, index) => {
          axios
            .get(`http://localhost:3000/cars/${report.carId}`, {
              headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
              const { brand, damaged, aviability } = res.data;
              setDamageReports((prevReports) => {
                const updatedReports = [...prevReports];
                updatedReports[index] = {
                  ...updatedReports[index],
                  carBrand: brand,
                  damaged: damaged,
                  available: aviability,
                };
                return updatedReports;
              });
            })
            .catch((err) =>
              console.error(
                `Error fetching car data for carId ${report.carId}:`,
                err
              )
            );
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [
    unavailableCarModal,
    makeCarAvailableModal,
    fixProblemModal,
    deleteReportModal,
  ]);

  const handleMakeCarAvailable = () => {
    const token = localStorage.getItem("token");
    axios
      .patch(
        `http://localhost:3000/cars/${carToMakeAvailable.carId}`,
        {
          aviability: true,
          damageReport: "",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        setMakeCarAvailableModal(false);
        setDamageReports((prevReports) =>
          prevReports.map((report) =>
            report.carId === carToMakeAvailable.carId
              ? { ...report, available: true }
              : report
          )
        );
      })
      .catch((err) => console.error("Error making car available:", err));
  };

  return (
    <div className="pages">
      <h1>Damage Reports</h1>
      <p style={{ marginRight: "100px" }}>
        Here you will see pending and solved reports posted by employees. If the
        cars is actually damaged please report it as unavailable. If the problem
        was fixed, asign the report as fixed.
      </p>
      <p style={{ marginRight: "100px" }}>
        {" "}
        After the report is resolved, you can either delete the report, asign
        car as available again, or both. You can also make the car available
        again in the category <i>Unavailable cars</i>{" "}
      </p>
      <h2>Unsolved reports:</h2>
      {damageReports ? (
        <div className="damage-report-container">
          {damageReports
            .filter((report) => report.status === "pending")
            .map((report) => (
              <div key={report.id} className="damage-report">
                <p>
                  <strong>Car:</strong> {report.carBrand}
                </p>
                <p>
                  <strong>Damage report:</strong> {report.issueType}
                </p>
                <p>
                  <strong>Description:</strong> {report.description}
                </p>
                <p>
                  <strong>Aviability:</strong>{" "}
                  {report.available ? "Currently available " : "Not available"}
                </p>
                <p>
                  <strong>Created at:</strong> {report.createdAt}
                </p>

                {report.available && (
                  <button
                    onClick={() => {
                      setUnavailableCarModal(true);
                      setUnavailableCar(report);
                    }}
                  >
                    Confirm damage
                  </button>
                )}

                <button
                  style={{ marginLeft: "10px" }}
                  onClick={() => {
                    setFixProblemModal(true);
                    setFixProblem(report);
                  }}
                >
                  Damage fixed
                </button>
              </div>
            ))}
        </div>
      ) : (
        <p>No damage reports available</p>
      )}
      <hr />
      <h2>Solved reports:</h2>
      <div>
        {damageReports ? (
          <div className="damage-report-container">
            {damageReports
              .filter((report) => report.status === "resolved")
              .map((report) => (
                <div key={report.id} className="damage-report">
                  <p>Car: {report.carBrand}</p>
                  <p>Damage report: {report.issueType}</p>
                  <p>Description: {report.description}</p>
                  <p>
                    Availability:{" "}
                    {report.available ? "Currently available" : "Not available"}
                  </p>
                  <p>Created at: {report.createdAt}</p>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      onClick={() => {
                        setDeleteReportModal(true);
                        setDeleteReport(report);
                      }}
                    >
                      Delete report
                    </button>
                    {!report.available && (
                      <button
                        onClick={() => {
                          setMakeCarAvailableModal(true);
                          setCarToMakeAvailable(report);
                        }}
                      >
                        Make car available
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <p>No solved reports</p>
        )}
      </div>
      {/* React Modal for Making Car Available */}
      <ReactModal
        isOpen={makeCarAvailableModal}
        onRequestClose={() => setMakeCarAvailableModal(false)}
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h2>Confirm Action</h2>
        <p style={{ color: "black" }}>
          Are you sure you want to make the car <strong>available</strong>{" "}
          again?
        </p>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={handleMakeCarAvailable}>Yes</button>
          <button onClick={() => setMakeCarAvailableModal(false)}>No</button>
        </div>
      </ReactModal>
      {unavailableCarModal && (
        <CarAviabilityModal
          setUnavailableCarModal={setUnavailableCarModal}
          unavailableCar={unavailableCar}
        />
      )}
      {deleteReportModal && (
        <DeleteReportModal
          setDeleteReportModal={setDeleteReportModal}
          deleteReport={deleteReport}
        />
      )}
      {fixProblemModal && (
        <FixProblemModal
          setFixProblemModal={setFixProblemModal}
          fixProblem={fixProblem}
        />
      )}
    </div>
  );
}
