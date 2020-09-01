const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();

const respondError403 = (res, next) => {
  const err = new Error(
    'You are not Authorized to View this page, Please login'
  );
  res.status(403);
  next(err);
};
router.get('/', (req, res, next) => {
  const authHeader = req.get('authorization');
  if (authHeader) {
    const token = authHeader.split(' ')[1];

    if (token) {
      jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) {
          respondError403(res, next);
        } else {
          res.json({ message: 'Verified' });
        }
      });
    } else {
      respondError403(res, next);
    }
  } else {
    respondError403(res, next);
  }
});

module.exports = router;
