const express = require('express');
const router = express.Router();
const moment = require('moment');
const User = require('../models/users/UserModel');
const Patient = require('../models/patient/PatientModel');

const respondError403 = (res, next) => {
  const err = new Error('Please Login to view this page');
  res.statusCode = 403;
  next(err);
};

// all patient's api
router.get('/patients/all', (req, res, next) => {
  if (req.user) {
    const { _id } = req.user;

    User.findOne({ _id: _id }).then(user => {
      console.log(user);
      //EDIT : DO NOT SEND ALL THE INFO
      res.json(user.patients);
    });
  } else {
    respondError403(res, next);
  }
});

//get single patient info

router.get('/patients/:id', (req, res, next) => {
  if (req.user) {
    const { _id } = req.user;
    const patientId = req.params.id;

    User.findOne(
      {
        _id: _id,
        patients: {
          $elemMatch: {
            _id: patientId,
          },
        },
      },
      {
        patients: {
          $elemMatch: {
            _id: patientId,
          },
        },
      }
    )
      .then(user => {
        console.log(user);
        const { personalInfo, medicalInfo } = user.patients[0];
        res.json({ personalInfo, medicalInfo });
      })
      .catch(err => console.log(err));
  } else {
    respondError403(res, next);
  }
});
// add new patient
router.post('/patients/new', (req, res, next) => {
  if (req.user) {
    const { _id } = req.user;
    console.log(_id);

    const { personalInfo, medicalInfo } = req.body;

    console.log(req.body);
    User.findOne({ _id: _id }).then(user => {
      console.log(user + ' is user');
      const newPatient = {
        personalInfo: {
          ...personalInfo,
        },
        medicalInfo: {
          ...medicalInfo,
        },
      };
      console.log(newPatient);

      user.patients.push(newPatient);

      user
        .save()
        .then(result => console.log('patient added' + result))
        .catch(err => console.log(err));
    });
  } else {
    respondError403(res, next);
  }
});

//edit patient Info

router.post('/patients/:_id/edit/:section', (req, res, next) => {
  if (req.user) {
    const { _id } = req.user;
    const patientId = req.params._id;
    const section = req.params.section;

    User.findOne(
      { _id: _id, patients: { $elemMatch: { _id: patientId } } },
      {
        patients: {
          $elemMatch: {
            _id: patientId,
          },
        },
      }
    )
      .then(user => {
        console.log(user, 'is user');
        const {
          firstName,
          lastName,
          age,
          gender,
          occupation,
          address,
          phoneNumber,
        } = req.body;

        user.patients[0][section] = req.body;

        user.save().then(result => {
          res.json({ message: 'Patient Data has been successfully Updated' });
        });
      })
      .catch(err => console.log(err));
  } else {
    respondError403(res, next);
  }
});
//add an appointment
router.post('/patients/:_id/appointments', (req, res, next) => {
  console.log(req.params, `is req params`);
  let patientId = req.params._id;

  console.log(patientId);
  console.log(req.body);
  if (req.user) {
    const { _id } = req.user;
    User.findOne(
      {
        _id: _id,
        patients: {
          $elemMatch: {
            _id: patientId,
          },
        },
      },
      {
        patients: {
          $elemMatch: {
            _id: patientId,
          },
        },
      }
    )
      .then(user => {
        user.patients[0].appointments.push(req.body);
        user.save().then(result =>
          res.json({
            message: `Appointment created successfully ${user.patients[0].appointments}`,
          })
        );
      })
      .catch(err => console.log(err));
  } else {
    respondError403(res, next);
  }
});

//all appointments

router.get('/appointments/all', (req, res, next) => {
  //check user auth

  if (req.user) {
    const { _id } = req.user;
    // console.log(_id);

    User.findOne({ _id: _id }, 'patients.appointments patients.personalInfo')
      .then(user => {
        let appointments = [];

        user.patients.forEach(patient => {
          const { firstName, lastName } = patient.personalInfo;
          patient.appointments.forEach(appointment => {
            if (appointment.length !== 0) {
              let withName = JSON.parse(JSON.stringify(appointment));

              withName.name = `${firstName} ${lastName}`;
              appointments.push(withName);
            }
          });
        });
        res.json(appointments);
      })
      .catch(err => console.log(err));
  } else {
    respondError403(res, next);
  }
});

//today appointments
router.get('/appointments/:date', (req, res, next) => {
  //check user auth
  if (req.user) {
    const { date } = req.params;
    console.log(date);
    const { _id } = req.user;
    // console.log(_id);

    User.findOne(
      { _id: _id, 'patients.appointments': { $elemMatch: { date: date } } },
      'patients.appointments patients.personalInfo'
    )
      .then(user => {
        let appointments = [];
        if (user) {
          user.patients.forEach(patient => {
            const { firstName, lastName } = patient.personalInfo;
            patient.appointments.forEach(appointment => {
              if (appointment.length !== 0) {
                let withName = JSON.parse(JSON.stringify(appointment));

                withName.name = `${firstName} ${lastName}`;
                appointments.push(withName);
              }
            });
          });
          res.json(appointments);
        } else {
          res.json(appointments);
        }
      })
      .catch(err => console.log(err));
  } else {
    respondError403(res, next);
  }
});

module.exports = router;
