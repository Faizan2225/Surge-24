const mongoose = require("mongoose");

const connectDb = () => {
  mongoose.connect(process.env.DB_URI).then((data) => {
    console.log(`Mongodb server connected: ${data.connection.host}`);
  });
};

module.exports = connectDb;
