const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();

const respondError403 = (res, next) => {
  const err = new Error('Please Login to view this page');
  res.status(403);
  next(err);
};
router.get('/', (req, res, next) => {
  // console.log(req.user);
  if (req.user) {
    const message = 'Verified';
    res.json(message);
  } else {
    respondError403(res, next);
  }
});

module.exports = router;
