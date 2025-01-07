const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const { Schema } = mongoose;

const CarSchema = new Schema({
  brand: { type: String, required: true },
  carType: { type: String, required: true },
  fuel: { type: String, required: true },
  MA_transmission: { type: String, required: true },
  reservations: [
    {
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true },
      requester_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    },
  ],
});
const Car = mongoose.model("Car", CarSchema, "cars");

// filter cars by type and start and end time
router.get("/available", async (req, res) => {
  const { carType, startDate, endDate } = req.query;

  if (!carType || !startDate || !endDate) {
    return res.status(400).json({ message: "Missing required parameters." });
  }

  try {
    // first find cars by car type
    const cars = await Car.find({ carType });

    if (cars.length === 0) {
      console.log(`No cars with car type: ${carType}`);
      return res
        .status(200)
        .json({ message: "No cars available for selected car type." });
    } else {
      // if car type exists then check dates
      const availableCars = cars.filter((car) => {
        const overlappingReservation = car.reservations.some((reservation) => {
          return (
            new Date(startDate) < reservation.endDate &&
            new Date(endDate) > reservation.startDate
          );
        });

        return !overlappingReservation; // Include cars with no overlap
      });
      if (availableCars.length === 0) {
        res
          .status(200)
          .json({ message: "No cars available for the selected dates." });
      } else {
        res.status(200).json({ availableCars });
      }
    }
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "An error occurred while fetching available cars." });
  }
});

router.patch("/approve", async (req, res) => {
  const { startDate, endDate, requester_id, car_id } = req.body;
  try {
    const car = await Car.findById(car_id);
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    const newReservation = {
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      requester_id: requester_id,
    };
    car.reservations.push(newReservation);
    await car.save();
    res.status(200).json({ message: "Reservation added successfully", car });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred while adding the reservation" });
  }
});

router.post("/", async (req, res) => {
  try {
    const newCar = new Car(req.body);
    await newCar.save();
    res.status(201).send("Car successfully added to database");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
