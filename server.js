const express = require('express');
const mongoose = require('mongoose');

require('dotenv').config();
const app = express();
const morgan = require('morgan');
const cors = require('cors');
// const patientRoute = require('./routes/patientsRoute');
const { checkTokenSetUser, isLoggedIn } = require('./auth/middlewares');
const signupAuth = require('./authRoutes/signup');
const loginAuth = require('./authRoutes/login');
const authCheckRoute = require('./auth/authCheckRoute');
const appointmentCheckRoute = require('./routes/appointmentCheck');
const api = require('./routes/api/api');

var corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(morgan('dev'));

const errorHandler = (err, req, res, next) => {
  res.status(res.statusCode || 500);
  res.json({
    message: err.message,
    stack: err.stack,
  });
};
//middlewares
//cors
app.use(cors(corsOptions));
//parse json
app.use(express.json());

//routes
app.use('/login', loginAuth);
app.use('/signup', signupAuth);
app.use('/auth/check', authCheckRoute);
app.use(checkTokenSetUser);
app.use('/api', isLoggedIn, api);
app.use('/appointments', isLoggedIn, appointmentCheckRoute);
// app.use('/patients', patientRoute);

app.use(errorHandler);
mongoose
  .connect(process.env.MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('connected to database');
  })
  .catch(err => console.log(err));

app.listen(process.env.PORT, () => console.log('connected to server'));
