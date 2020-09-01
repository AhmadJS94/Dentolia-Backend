const User = require('../../models/users/UserModel');
const moment = require('moment');
const respondError404 = (res, next) => {
  const err = new Error('Requested resource was not found');
  res.statusCode = 404;
  next(err);
};

const handleAddProcedure = async (req, res) => {
  try {
    console.log(req.body);
    const { _id } = req.user;
    const patientId = req.params._id;
    const { procedures } = req.body;
    const user = await User.findOne(
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
    );
    procedures.forEach(procedure => {
      user.patients[0].dentalInfo.teeth[procedure.tooth].procedures.push({
        type: procedure.type,
        detail: procedure.detail,
        option: procedure.option,
        surfaces: procedure.surfaces,
        date: procedure.date,
      });
    });
    await user.save();

    res.json({ message: 'success', user });
  } catch (error) {
    res.json({ message: 'Something went wrong', stack: error.stack });
  }
};
const handleAddCondition = async (req, res) => {
  console.log(req.body);
  try {
    const { _id } = req.user;
    const patientId = req.params._id;
    const { conditions } = req.body;
    const user = await User.findOne(
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
    );
    conditions.forEach(condition => {
      user.patients[0].dentalInfo.teeth[condition.tooth].conditions.push({
        type: condition.type,

        option: condition.option,
        surfaces: condition.surfaces,
        date: condition.date,
      });
    });

    await user.save();
    res.json({ message: 'success', user });
  } catch (error) {
    res.json({ message: 'Something went wrong', stack: error.stack });
  }
};

const getSingleToothInfo = async (req, res) => {
  console.log(req.params.tooth);
  try {
    const { _id } = req.user;
    const tooth = req.params.tooth;
    const patientId = req.params._id;
    const user = await User.findOne(
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
    );

    let info = [];

    user.patients[0].dentalInfo.teeth[tooth].conditions.forEach(condition => {
      info.push({
        from: 'Condition',
        type: condition.type,

        option: condition.option,
        surfaces: condition.surfaces,
        date: condition.date,
      });
    });
    user.patients[0].dentalInfo.teeth[tooth].procedures.forEach(procedure => {
      info.push({
        from: 'Procedure',
        type: procedure.type,

        option: procedure.option,
        surfaces: procedure.surfaces,
        date: procedure.date,
      });
    });
    info.sort((a, b) => {
      let aDate = moment(a.date, 'DD-MM-YYYY');
      let bDate = moment(b.date, 'DD-MM-YYYY');
      return bDate.diff(aDate) - aDate.diff(bDate);
    });
    console.log(info);

    res.json({ info });
  } catch (error) {
    res.json({ message: 'something went wrong', stack: error.stack });
  }
};

module.exports = {
  handleAddProcedure,
  handleAddCondition,
  getSingleToothInfo,
};
