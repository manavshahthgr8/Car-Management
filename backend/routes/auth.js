const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
require('dotenv').config();

const router = express.Router();  // Declare router once

// User login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user.user_id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({ token, userId: user.user_id, name: user.name });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// User signup route
// User signup route
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  try {
    // Check if the email already exists in the database
    const [existingUser] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'Email is already registered' });
    }

    // Proceed with user registration
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = `user_${Date.now()}`;
    await pool.query('INSERT INTO users (user_id, name, email, password) VALUES (?, ?, ?, ?)', [
      userId, name, email, hashedPassword,
    ]);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});


const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');



// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, uuidv4() + path.extname(file.originalname)); // Generate unique filenames
    },
});
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
}).array('car-images', 10); // Allow up to 10 images

// POST route to handle car submission
router.post('/add-car', (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: 'Image upload failed', details: err.message });
        }

        const { user_id, car_name, car_type, dealer_name, fuel_type, description } = req.body;
        if (!user_id || !car_name || !car_type || !dealer_name || !fuel_type || !description) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const imageUrls = req.files.map((file) => `/uploads/${file.filename}`);

        // Prepare the SQL query
        const query = `
            INSERT INTO cars 
            (user_id, car_name, car_type, dealer_name, fuel_type, description, 
            image_url_1, image_url_2, image_url_3, image_url_4, image_url_5, 
            image_url_6, image_url_7, image_url_8, image_url_9, image_url_10)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            user_id,
            car_name,
            car_type,
            dealer_name,
            fuel_type,
            description,
            imageUrls[0] || null,
            imageUrls[1] || null,
            imageUrls[2] || null,
            imageUrls[3] || null,
            imageUrls[4] || null,
            imageUrls[5] || null,
            imageUrls[6] || null,
            imageUrls[7] || null,
            imageUrls[8] || null,
            imageUrls[9] || null,
        ];

        try {
            await pool.execute(query, values);
            res.status(200).json({ message: 'Car added successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Database error', details: error.message });
        }
    });
});

// Fetch cars by user_id
router.get('/cars', async (req, res) => {
  try {
    // Extract the user_id from query or token (if using authentication)
    const user_id = req.query.user_id;

    if (!user_id) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const [rows] = await pool.query('SELECT * FROM cars WHERE user_id = ?', [user_id]);
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch cars' });
  }
});





module.exports = router;  // Export the router