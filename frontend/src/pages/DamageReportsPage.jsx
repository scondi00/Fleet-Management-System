import { useEffect, useState } from "react";
import axios from "axios";
import CarAviabilityModal from "../components/CarAviabilityModal";
import DeleteReportModal from "../components/DeleteReportModal";
import FixProblemModal from "../components/modals/FixProblemModal";

export default function DamageReports() {
  const [damageReports, setDamageReports] = useState(null);
  const [deleteReportModal, setDeleteReportModal] = useState(false);
  const [deleteReport, setDeleteReport] = useState(null);
  const [unavailableCar, setUnavailableCar] = useState(null);
  const [unavailableCarModal, setUnavailableCarModal] = useState(false);
  const [fixProblemModal, setFixProblemModal] = useState(false);
  const [fixProblem, setFixProblem] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3000/issue-reports")
      .then((result) => {
        setDamageReports(result.data);

        // For each report fetch additional data for person that made the report and for which car
        result.data.forEach((report, index) => {
          // First car details
          axios
            .get(`http://localhost:3000/cars/${report.carId}`)
            .then((res) => {
              console.log(res.data);
              const brand = res.data.brand;
              const damaged = res.data.damaged;
              const available = res.data.aviability.isAvailable;

              setDamageReports((prevReports) => {
                const updatedReports = [...prevReports];
                updatedReports[index] = {
                  ...updatedReports[index],
                  carBrand: brand,
                  damaged: damaged,
                  available: available,
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

          axios
            .get(`http://localhost:3000/user/${report.submissioner_id}`)
            .then((userRes) => {
              const userName = userRes.data.name;
              setDamageReports((prevReports) => {
                const updatedReports = [...prevReports];
                updatedReports[index] = {
                  ...updatedReports[index],
                  userName: userName,
                };
                return updatedReports;
              });
            })
            .catch((err) =>
              console.error(
                `Error fetching user data for submissioner_id ${report.submissioner_id}:`,
                err
              )
            );
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [unavailableCarModal]);

  return (
    <div className="user-page">
      <h1>Damage Reports</h1>
      <h2>Pending reports:</h2>
      {damageReports ? (
        <div>
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
                <p>
                  <strong>Reported by:</strong> {report.userName}
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
                  Fix problem
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
          <div>
            {damageReports
              .filter((report) => report.status === "resolved")
              .map((report) => (
                <div key={report.id} className="damage-report">
                  <p>Car: {report.carBrand}</p>
                  <p>Damage report: {report.issueType}</p>
                  <p>Description: {report.description}</p>
                  <p>
                    Aviability:{" "}
                    {report.damaged ? "Currently available " : "Not aviable"}
                  </p>
                  <p>Created at: {report.createdAt}</p>
                  <p>Reported by: {report.userName}</p>
                  <button
                    onClick={() => {
                      setDeleteReportModal(true);
                      setDeleteReport(report);
                    }}
                  >
                    Delete report
                  </button>
                </div>
              ))}
          </div>
        ) : (
          <p>No solved reports</p>
        )}
      </div>
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
