const mongoose = require('mongoose');

//Connect to mongodb
mongoose
  .connect(process.env.MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(`Connected to Database`))
  .catch(err => console.log(err));
