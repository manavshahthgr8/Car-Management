const express = require("express");
const db = require("../config/db");
const jwt = require("jsonwebtoken");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to Authenticate
const authenticate = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).send("Access Denied");

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).send("Invalid Token");
    req.user = decoded;
    next();
  });
};

// Add a Car
router.post("/", authenticate, (req, res) => {
  const { name, car_type, dealer_name, fuel_type, description, image_urls } = req.body;
  const userId = req.user.id;

  db.query(
    "INSERT INTO cars (user_id, name, car_type, dealer_name, fuel_type, description, image_urls) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [userId, name, car_type, dealer_name, fuel_type, description, JSON.stringify(image_urls)],
    (err) => {
      if (err) return res.status(500).send("Server error");
      res.status(201).send("Car added successfully");
    }
  );
});

// Get All Cars for User
router.get("/", authenticate, (req, res) => {
  const userId = req.user.id;

  db.query("SELECT * FROM cars WHERE user_id = ?", [userId], (err, results) => {
    if (err) return res.status(500).send("Server error");
    res.json(results);
  });
});

// Get Specific Car
router.get("/:id", authenticate, (req, res) => {
  const userId = req.user.id;
  const carId = req.params.id;

  db.query("SELECT * FROM cars WHERE id = ? AND user_id = ?", [carId, userId], (err, results) => {
    if (err) return res.status(500).send("Server error");
    if (!results.length) return res.status(404).send("Car not found");
    res.json(results[0]);
  });
});

// Delete Car
router.delete("/:id", authenticate, (req, res) => {
  const userId = req.user.id;
  const carId = req.params.id;

  db.query("DELETE FROM cars WHERE id = ? AND user_id = ?", [carId, userId], (err, results) => {
    if (err) return res.status(500).send("Server error");
    if (results.affectedRows === 0) return res.status(404).send("Car not found");
    res.send("Car deleted successfully");
  });
});

module.exports = router;
