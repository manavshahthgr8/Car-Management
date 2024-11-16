const authMiddleware = require('../middleware/auth');

router.get('/cars', authMiddleware, async (req, res) => {
  try {
    const user_id = req.user.userId; // Extract user_id from decoded token

    const [rows] = await pool.query('SELECT * FROM cars WHERE user_id = ?', [user_id]);
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch cars' });
  }
});