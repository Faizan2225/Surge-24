const app = require("./app");
const connectDB = require("./config/database");
const dotenv = require("dotenv");
const cloudinary = require("cloudinary");

//uncaught errores
process.on("uncaughtException", (err) => {
  console.log(`Error : ${err.message}`);
  console.log(`Error : ${err.line}`);
  console.log("Shutting down the server due to Unhandled Exception!");

  process.exit(1);
});

//config
dotenv.config({ path: "config.env" });

//database
connectDB();

// cloudinary
cloudinary.config({
  cloud_name: process.env.COUDINARY_NAME,
  api_key: process.env.COUDINARY_API_KEY,
  api_secret: process.env.COUDINARY_API_SECRET,
});

const server = app.listen(process.env.PORT, () => {
  console.log(`Server is working on http://localhost:${process.env.PORT}`);
});

// Unhandled Promise Rejection
process.on("unhandledRejection", (error) => {
  console.log(`Error : ${error.message}`);
  console.log(`Error : ${error}`);
  console.log("Shutting down the server due to Unhandled Promise Rejection!");

  server.close(() => {
    process.exit(1);
  });
});
