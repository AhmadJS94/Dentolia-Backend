const User = require('../models/users/UserModel');
const router = require('express').Router();
const Joi = require('@hapi/joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createTokenSendResponse } = require('../auth/tokenFunctions');

const emailReg = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const passReg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

const schema = Joi.object({
  email: Joi.string().trim().regex(emailReg).required(),
  password: Joi.string().trim().regex(passReg).required(),
});
const respondError422 = (res, next) => {
  const err = new Error('Invalid credentials');
  res.status(409);
  next(err);
};
router.post('/', (req, res, next) => {
  let { email, password } = req.body;
  email = email.toLowerCase();
  const { error, value } = schema.validate({ email, password });
  if (!error) {
    User.findOne({ email: email })
      .then(user => {
        if (!user) {
          respondError422(res, next);
        } else {
          bcrypt.compare(password, user.password).then(result => {
            if (!result) {
              respondError422(res, next);
            } else {
              // they sent the right password// generate JWT

              createTokenSendResponse(user, res, next);
            }
          });
        }
      })
      .catch(err => console.log(err));
  } else {
    respondError422(res, next);
  }
});

module.exports = router;
