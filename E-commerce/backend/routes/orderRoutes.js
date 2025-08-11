const express = require('express');
const router = express.Router();

router.post('/place', (req, res) => {
  try {
    const order = req.body;
    console.log('Received order:', order);
    res.status(200).json({ message: 'Order placed successfully' });
  } catch (err) {
    console.error('Error placing order:', err);
    res.status(500).json({ message: 'Failed to place order' });
  }
});

module.exports = router;
