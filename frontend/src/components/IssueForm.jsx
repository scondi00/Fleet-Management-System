import { useEffect, useState } from "react";
import axios from "axios";

export default function IssueForm({ setModal, problemReq }) {
  const [car, setCar] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    submissioner_id: "",
    carId: "",
    issueType: "",
    description: "",
  });

  useEffect(() => {
    axios
      .get("http://localhost:3000/cars", {
        params: { carId: problemReq.assigned_car_id },
      })
      .then((res) => {
        setCar(res.data);
        setFormData({
          ...formData,
          carId: res.data._id,
          submissioner_id: problemReq.requester,
        });
      });
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:3000/issue-reports", formData).then((res) => {
      if (res.data === "Report successfully added to database") {
        setSuccessMessage("Issue reported successfully!");
      }
    });
  };

  return (
    <div className="modal-background">
      <div className="modal-container">
        <button className="exit-modal" onClick={() => setModal(false)}>
          X
        </button>
        <h3>Report a Car Issue</h3>
        <h4>Car: {car.brand}</h4>
        {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "15px" }}>
            <label htmlFor="issueType">Issue Type</label>
            <select
              id="issueType"
              name="issueType"
              value={formData.issueType}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "10px", marginTop: "5px" }}
            >
              <option value="" disabled>
                Select an issue type
              </option>
              <option value="Engine">Engine</option>
              <option value="Brakes">Brakes</option>
              <option value="Electrical">Electrical</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the issue in detail"
              required
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "5px",
                height: "100px",
              }}
            />
          </div>
          <button type="submit">Submit Report</button>
        </form>
      </div>
    </div>
  );
}
