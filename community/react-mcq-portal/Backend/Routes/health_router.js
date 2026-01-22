const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  // ultra-lightweight response
  res.status(200).send('OK');
});

module.exports = router;