const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Joi = require('@hapi/joi');
const jwt = require('jsonwebtoken');
const { createTokenSendResponse } = require('../auth/tokenFunctions');

const emailReg = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const passReg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
const officeReg = /^[a-zA-Z\s]{0,25}$/;
const schema = Joi.object({
  email: Joi.string().trim().regex(emailReg).required(),
  password: Joi.string().trim().regex(passReg).required(),
  officeName: Joi.string().trim().regex(officeReg).required(),
});
// const Users = require('../models/users/UserModel');
const User = require('../models/users/UserModel');

const respondError403 = (res, next) => {
  const err = new Error('Please Login to view this page');
  res.status(403);
  next(err);
};

router.post('/', (req, res, next) => {
  let { email, password, officeName } = req.body;
  email = email.toLowerCase();
  console.log(req.body);
  //validate the Data !
  const { error, value } = schema.validate({ email, password, officeName });

  console.log('error is ' + error);
  //if no error
  if (!error) {
    //check if email is unique;
    User.findOne({ email: email }).then(user => {
      if (user) {
        //duplicated email, create an error and send it to the handler;
        const err = new Error('This Email is already registered');
        res.statusCode = 409;
        next(err);
      } else {
        //hash the password, then save it to the db;
        bcrypt.hash(password, 12).then(hash => {
          const newUser = new User({ email, password, officeName });
          newUser.password = hash;

          newUser.save().then(user => createTokenSendResponse(user, res, next));
        });
      }
    });
  } else {
    res.statusCode = 406;
    error.message = 'Invalid credentials';
    next(error);
  }
});

module.exports = router;
