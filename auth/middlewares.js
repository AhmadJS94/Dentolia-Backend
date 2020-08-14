const express = require('express');
const jwt = require('jsonwebtoken');

const respondError403 = (res, next) => {
  const err = new Error('Please Login to view this page');
  res.status(403);
  next(err);
};
const checkTokenSetUser = (req, res, next) => {
  const authHeader = req.get('authorization');
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    if (token) {
      jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) {
          console.log(err);
          respondError403(res, next);
        }
        req.user = user;
        console.log(req.user);

        next();
      });
    } else {
      respondError403(res, next);
    }
  } else {
    respondError403(res, next);
  }
};

module.exports = { checkTokenSetUser };
