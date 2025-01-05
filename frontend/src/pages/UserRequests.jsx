import { useEffect, useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function UserRequestForm() {
  const [user, setUser] = useState(null);
  const [request, setRequest] = useState({
    name: "",
    email: "",
    carType: "",
    reason: "",
    startDate: null,
    endDate: null,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:3000/user", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setUser(response.data);
          setRequest((prev) => ({
            ...prev,
            name: response.data.name,
            email: response.data.email,
          }));
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!request.carType) {
      newErrors.carType = "Please select a car type.";
    }
    if (!request.reason) {
      newErrors.reason = "Please select a reason.";
    }
    if (!request.startDate) {
      newErrors.startDate = "Please select a start date.";
    }
    if (!request.endDate) {
      newErrors.endDate = "Please select an end date.";
    }
    return newErrors;
  };

  const submitRequest = async (e) => {
    e.preventDefault();

    // Validate the form inputs
    const validationErrors = validateForm();
    console.log("Validation Errors:", validationErrors); // Debugging: Log errors

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      console.log("Errors in form:", validationErrors); // Debugging: Log errors
      return;
    }

    // Clear errors if validation passes
    setErrors({});
    console.log("Form submitted successfully:", request);

    // Get the token from localStorage
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You are not authenticated. Please log in.");
      return;
    }

    try {
      // Send the request to the server
      const response = await axios.post(
        "http://localhost:3000/user-requests",
        request,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the headers
          },
        }
      );
      alert(response.data); // Success message from the server
    } catch (error) {
      console.error("Error submitting request:", error);
      alert(
        error.response?.data || "An error occurred while submitting the request"
      );
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRequest({ ...request, [name]: value });
    setErrors({ ...errors, [name]: false }); // Clear the error for this field
  };

  const handleStartDateChange = (date) => {
    setRequest({ ...request, startDate: date });
    setErrors({ ...errors, startDate: false }); // Clear the error for startDate
  };

  const handleEndDateChange = (date) => {
    setRequest({ ...request, endDate: date });
    setErrors({ ...errors, endDate: false }); // Clear the error for endDate
  };

  return (
    <div>
      <div className="user-page">
        <h1>Request form</h1>
        <p>Please enter the details to make the request for a car.</p>
      </div>
      <div className="request-form-div">
        <h3>Fill in the form:</h3>
        <form onSubmit={submitRequest}>
          <label>Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={user?.name || ""}
            readOnly
          />
          <label>Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={user?.email || ""}
            readOnly
          />
          <div>
            <h4>Select Car Size:</h4>
            <label>
              <input
                type="radio"
                name="carType"
                value="mini"
                checked={request.carType === "mini"}
                onChange={handleChange}
                style={{
                  borderColor: errors.carType ? "red" : "",
                }}
              />
              Mini Car (2 people + small luggage)
            </label>
            <br />
            <label>
              <input
                type="radio"
                name="carType"
                value="standard"
                checked={request.carType === "standard"}
                onChange={handleChange}
                style={{
                  borderColor: errors.carType ? "red" : "",
                }}
              />
              Standard Car (4-5 people + luggage)
            </label>
            <br />
            <label>
              <input
                type="radio"
                name="carType"
                value="minivan"
                checked={request.carType === "minivan"}
                onChange={handleChange}
                style={{
                  borderColor: errors.carType ? "red" : "",
                }}
              />
              Minivan (10 people + luggage)
            </label>
            {errors.carType && <p style={{ color: "red" }}>{errors.carType}</p>}
          </div>
          <div>
            <h4>Select reason for request:</h4>
            <label>
              <input
                type="radio"
                name="reason"
                value="leasure"
                checked={request.reason === "leasure"}
                onChange={handleChange}
                style={{
                  borderColor: errors.reason ? "red" : "",
                }}
              />
              Leasure
            </label>
            <label>
              <input
                type="radio"
                name="reason"
                value="business"
                checked={request.reason === "business"}
                onChange={handleChange}
                style={{
                  borderColor: errors.reason ? "red" : "",
                }}
              />
              Business
            </label>
            {errors.reason && <p style={{ color: "red" }}>{errors.reason}</p>}
          </div>
          <div>
            <h3>Select Start and End Time</h3>
            <div style={{ marginBottom: "20px" }}>
              <label>Start Time:</label>
              <DatePicker
                selected={request.startDate}
                onChange={handleStartDateChange}
                selectsStart
                startDate={request.startDate}
                endDate={request.endDate}
                showTimeSelect
                dateFormat="Pp"
                placeholderText="Select start time"
                style={{
                  borderColor: errors.startDate ? "red" : "",
                }}
              />
              {errors.startDate && (
                <p style={{ color: "red" }}>{errors.startDate}</p>
              )}
            </div>
            <div>
              <label>End Time:</label>
              <DatePicker
                selected={request.endDate}
                onChange={handleEndDateChange}
                selectsEnd
                startDate={request.startDate}
                endDate={request.endDate}
                minDate={request.startDate}
                showTimeSelect
                dateFormat="Pp"
                placeholderText="Select end time"
                style={{
                  borderColor: errors.endDate ? "red" : "",
                }}
              />
              {errors.endDate && (
                <p style={{ color: "red" }}>{errors.endDate}</p>
              )}
            </div>
          </div>
          <button type="submit">Submit Request</button>
        </form>
      </div>
    </div>
  );
}
