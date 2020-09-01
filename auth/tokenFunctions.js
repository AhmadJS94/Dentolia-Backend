const jwt = require('jsonwebtoken');

const respondError500 = (res, next) => {
  const err = new Error('Something went Wrong, Please try again');
  res.status(500);
  next(err);
};

const createTokenSendResponse = (user, res, next) => {
  const payload = {
    _id: user._id,
    officeName: user.officeName,
  };

  jwt.sign(
    payload,
    process.env.TOKEN_SECRET,
    {
      expiresIn: '2d',
    },
    (err, token) => {
      if (err) {
        respondError500(res, next);
      } else {
        res.json(token);
      }
    }
  );
};

module.exports = { createTokenSendResponse };
