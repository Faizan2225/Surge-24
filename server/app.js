const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const errorMiddleware = require("./Middlewares/error");
const userRoutes = require("./Routes/userRoutes");
const orgRoutes = require("./Routes/organizationRoutes");
const needRoutes = require("./Routes/needRoutes");

app.use(express.json());

// Middleware setup
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

// Routes
app.use("/api/v1", userRoutes);
app.use("/api/v1", orgRoutes);
app.use("/api/v1", needRoutes);

app.use(errorMiddleware);

module.exports = app;
