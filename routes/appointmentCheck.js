const express = require('express');
const User = require('../models/users/UserModel');
const router = express.Router();
const moment = require('moment');
const respondError403 = (res, next) => {
  const err = new Error('Please Login to view this page');
  res.status(403);
  next(err);
};

//Checking appointments availability and making sure that it doesn't conflict with others
router.post('/check', (req, res, next) => {
  //check user auth state
  if (req.user) {
    const { _id } = req.user;
    console.log(req.body);
    //grab appointment info
    const { day, hour, date, duration } = req.body;

    //convert it to a moment object for comparison
    const currentAppointment = moment(`${date} ${hour}`, 'DD-MM-YYYY HH:mm');

    //query for existing appointments matching on the same day
    User.findOne(
      {
        _id: _id,
        'patients.appointments': {
          $elemMatch: {
            date: date,
          },
        },
      },
      'patients.appointments patients.personalInfo'
    ).then(user => {
      //initialize the matched and conflicted appointments arrays
      let matchedDates = [];
      let conflictedAppointments = [];
      //if there are any Users with matching appointments on the same day
      if (user) {
        //grab all the appointments from all patients
        user.patients.forEach(patient => {
          const { firstName, lastName } = patient.personalInfo;

          patient.appointments.forEach(appointment => {
            //if an appointment matches the same day
            if (appointment.date === date) {
              //attach the patient name to the matching appointment to display it on the front end
              //creating a new object with a name prop
              let withName = JSON.parse(JSON.stringify(appointment));

              withName.name = `${firstName} ${lastName}`;

              matchedDates.push(withName);
            }
          });
        });
        //if no matches

        //initialize the response message assuming everything is okay
        let message = 'All set';
        //loop through each matching appointment
        matchedDates.forEach(appointment => {
          //convert is to a moment object for comparison
          const matchedAppointment = moment(
            `${appointment.date} ${appointment.hour}`,
            'DD-MM-YYYY HH:mm'
          );
          //if it collides with the original appointment
          if (hour === appointment.hour) {
            message = `Error : Collides with ${appointment.name}`;
            conflictedAppointments.push(appointment);
          } else if (
            //else if the original appointment is earlier than the matched appointment
            currentAppointment.diff(matchedAppointment, 'minutes') <= 0
          ) {
            //add duration to the original appointment
            const currentWithDuration = currentAppointment
              .clone()
              .add(duration, 'minutes');
            //and make sure it doesn't collide with the matched one
            if (currentWithDuration.diff(matchedAppointment, 'minutes') <= 0) {
              console.log(`ok`);
            } else {
              console.log(`Can't place appointment`);
              message = `Error : Collides with ${appointment.name}`;
              conflictedAppointments.push(appointment);
            }
            //else if the original appointment is after than the matched appointment
          } else if (
            currentAppointment.diff(matchedAppointment, 'minutes') >= 0
          ) {
            //add duration to the matched appointment
            const existedWithDuration = matchedAppointment
              .clone()
              .add(appointment.duration, 'minutes');
            //and make sure it doesn't collide with the original one
            if (currentAppointment.diff(existedWithDuration, 'minutes') >= 0) {
              console.log(`ok`);
            } else {
              console.log(`Can't place appointment`);
              message = `Error : Collides with ${appointment.name}`;
              conflictedAppointments.push(appointment);
            }
          }
        });
        //send response with the message and conflicted appointments
        res.json({ message, conflictedAppointments });
      } else {
        res.json({ message: 'All set', conflictedAppointments: [] });
      }
    });
  } else {
    respondError403(res, next);
  }
});

module.exports = router;
