const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Users = require('../models/users/UserModel');

router.route('/').get((req, res) => {
  Users.find({})
    .then(Users => {
      res.status(200).json(Users);
    })
    .catch(err => console.log(err));
});

router.route('/').post((req, res) => {
  console.log(req.body);
  const { firstName, dateOfBirth } = req.body;
  Users.create(req.body)
    .then(Users => {
      console.log(`User ${Users} created successfully`);
      res.status(200).json(Users);
    })
    .catch(err => console.log(err));
});

module.exports = router;
