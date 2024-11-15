const express = require('express');
const pool = require('../config/db');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// Add a car
router.post('/', authenticateToken, async (req, res) => {
  const { car_name, car_type, dealer_name, fuel_type, description, images } = req.body;
  const userId = req.user.userId;

  try {
    const imageUrls = Array(10).fill(null).map((_, idx) => images[idx] || null);
    const query = `
      INSERT INTO cars (user_id, car_name, car_type, dealer_name, fuel_type, description, ${imageUrls.map((_, idx) => `image_url_${idx + 1}`).join(', ')})
      VALUES (?, ?, ?, ?, ?, ?, ${imageUrls.map(() => '?').join(', ')})
    `;
    await pool.query(query, [userId, car_name, car_type, dealer_name, fuel_type, description, ...imageUrls]);
    res.status(201).json({ message: 'Car added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add car' });
  }
});

// List all cars for a user
router.get('/', authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  try {
    const [cars] = await pool.query('SELECT * FROM cars WHERE user_id = ?', [userId]);
    res.status(200).json(cars);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cars' });
  }
});

// Fetch details of a particular car
router.get('/:carId', authenticateToken, async (req, res) => {
  const { carId } = req.params;
  try {
    const [car] = await pool.query('SELECT * FROM cars WHERE car_id = ?', [carId]);
    if (!car.length) return res.status(404).json({ error: 'Car not found' });
    res.status(200).json(car[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch car details' });
  }
});

// Update a car
router.put('/:carId', authenticateToken, async (req, res) => {
  const { carId } = req.params;
  const { car_name, car_type, dealer_name, fuel_type, description, images } = req.body;
  try {
    const imageUrls = Array(10).fill(null).map((_, idx) => images[idx] || null);
    const query = `
      UPDATE cars SET car_name = ?, car_type = ?, dealer_name = ?, fuel_type = ?, description = ?, ${imageUrls.map((_, idx) => `image_url_${idx + 1} = ?`).join(', ')}
      WHERE car_id = ? AND user_id = ?
    `;
    await pool.query(query, [car_name, car_type, dealer_name, fuel_type, description, ...imageUrls, carId, req.user.userId]);
    res.status(200).json({ message: 'Car updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update car' });
  }
});

// Delete a car
router.delete('/:carId', authenticateToken, async (req, res) => {
  const { carId } = req.params;
  try {
    await pool.query('DELETE FROM cars WHERE car_id = ? AND user_id = ?', [carId, req.user.userId]);
    res.status(200).json({ message: 'Car deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete car' });
  }
});

module.exports = router;
