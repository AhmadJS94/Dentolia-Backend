const jwt = require('jsonwebtoken');

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
        respondError422(res, next);
      } else {
        res.json(token);
        console.log(token);
      }
    }
  );
};

module.exports = { createTokenSendResponse };
