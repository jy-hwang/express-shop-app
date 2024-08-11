const mongoose = require('mongoose');

const connect = () => {
  if (process.env.NODE_ENV !== 'production') {
    mongoose.set('debug', true);
  }

  mongoose
    .connect(process.env.MONGO_URI, {
      dbName: process.env.MONGO_DB,
    })
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch(err => {
      console.error(err);
    });
};
mongoose.connection.on('error', err => {
  console.error(err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Disconnected from MongoDB, Trying to reconnect...');
  //connect();
});

module.exports = connect;
