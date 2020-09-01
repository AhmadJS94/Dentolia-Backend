const express = require('express');
const router = express.Router();
const moment = require('moment');
const User = require('../../models/users/UserModel');
const Patient = require('../../models/patient/PatientModel');
const {
  handleAddProcedure,
  handleAddCondition,
  getSingleToothInfo,
} = require('./dentalFunctions');
const { id } = require('monk');

const respondError403 = (res, next) => {
  const err = new Error('Please Login to view this page');
  res.statusCode = 403;
  next(err);
};
const respondError404 = (res, next) => {
  const err = new Error('Requested resource was not found');
  res.statusCode = 404;
  next(err);
};

// all patient's api
router.get('/patients/all', (req, res, next) => {
  const { _id } = req.user;

  User.findOne({ _id: _id }).then(user => {
    //EDIT : DO NOT SEND ALL THE INFO
    res.json(user.patients);
  });
});

//get single patient info

router.get('/patients/:id', (req, res, next) => {
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
      const { personalInfo, medicalInfo, medicalForms } = user.patients[0];
      res.json({ personalInfo, medicalInfo, medicalForms });
    })
    .catch(err => console.log(err));
});
// add new patient
router.post('/patients/new', (req, res, next) => {
  const { _id } = req.user;

  const { personalInfo, medicalInfo } = req.body;

  User.findOne({ _id: _id }).then(user => {
    const newPatient = {
      personalInfo: {
        ...personalInfo,
      },
      medicalInfo: {
        ...medicalInfo,
      },
    };

    user.patients.push(newPatient);

    user
      .save()
      .then(result =>
        res.json({
          message: 'Success',
        })
      )
      .catch(err => console.log(err));
  });
});
//delete patient

router.delete('/patients/delete/:_id', async (req, res, next) => {
  try {
    const { _id } = req.user;
    const patientId = req.params._id;
    let user = await User.findOne(
      { _id: _id, patients: { $elemMatch: { _id: patientId } } },

      'patients'
    );
    if (!user) {
      respondError404(res, next);
    } else {
      user.patients = user.patients.filter(
        patient => patient._id.toString() !== patientId
      );

      let result = await user.save();
      res.json(result);
    }
  } catch (error) {
    res.json(error);
  }
  // User.findOne(
  //   { _id: _id, patients: { $elemMatch: { _id: patientId } } },

  //   'patients'
  // ).then(user => {
  //   if (!user) {
  //     respondError404(res, next);
  //   } else if (user) {
  //     // res.json(user);

  //     user.patients = user.patients.filter(
  //       patient => patient._id !== patientId
  //     );

  //     user.save().then(result => {
  //       res.json(result);
  //     });
  //   }
  // });
});
//edit patient Info

router.post('/patients/:_id/edit/:section', (req, res) => {
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
});
//add an appointment
router.post('/patients/:_id/appointments', (req, res) => {
  console.log(req.params, `is req params`);
  let patientId = req.params._id;

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
});

//all appointments

router.get('/appointments/all', (req, res) => {
  const { _id } = req.user;

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
});

//today appointments
router.get('/appointments/:date', (req, res, next) => {
  //check user auth
  if (req.user) {
    const { date } = req.params;

    const { _id } = req.user;

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

//add form

router.post('/patients/:_id/forms/medical', (req, res, next) => {
  const { _id } = req.user;
  const patientId = req.params._id;

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
  ).then(user => {
    if (!user) {
      respondError404(res, next);
    } else {
      user.patients[0].medicalForms.push(req.body);
      user.patients[0].medicalForms.sort((a, b) => {
        let aDate = moment(a.date, 'DD-MM-YYYY');
        let bDate = moment(b.date, 'DD-MM-YYYY');
        return bDate.diff(aDate) - aDate.diff(bDate);
      });
      user
        .save()
        .then(result => {
          res.json({ message: 'Success' });
        })
        .catch(err => console.log(err));
    }
  });
});

//get forms

router.get('/patients/:_id/forms/medical/all', (req, res, next) => {
  const { _id } = req.user;
  const patientId = req.params._id;

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
  ).then(user => {
    if (!user) {
      respondError404(res, next);
    } else {
      const forms = user.patients[0].medicalForms;
      // console.log(forms);

      // forms.sort();
      res.json(forms);
    }
  });
});

//get single form

router.get('/patients/:_id/forms/medical/:date', (req, res, next) => {
  const { _id } = req.user;
  const patientId = req.params._id;
  const date = req.params.date;

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
      medicalForms: {
        $elemMatch: {
          date: date,
        },
      },
    }
  ).then(user => {
    if (!user) {
      respondError404(res, next);
    } else {
      // const forms = user.patients[0].medicalForms;

      res.json(user);
    }
  });
});
//add procedure
router.post('/patients/:_id/dental/procedures/add', handleAddProcedure);
router.post('/patients/:_id/dental/conditions/add', handleAddCondition);
router.get('/patients/:_id/dental/info/:tooth', getSingleToothInfo);

module.exports = router;
