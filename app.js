const express = require("express");
const app = express();
const morgan = require("morgan");
const sequelize = require("./models").sequelize;
const PORT = 5000; // Change broadcast port here.

// variable to enable global error logging
const enableGlobalErrorLogging =
  process.env.ENABLE_GLOBAL_ERROR_LOGGING === "true";

// setup morgan which gives us http request logging
app.use(morgan("dev"));

/**
 *
 */
app.use("/api/users", require("./routes/api/users"));
app.use("/api/courses", require("./routes/api/courses"));

// @route   GET /
// @desc    Returns a message at root
// @access  Public
app.get("/", (req, res) => {
  res.json({
    message: "Rest API project using Express and Sequelize"
  });
});

/**
 * Send 404 if no other route matched
 */
app.use((req, res) => {
  res.status(404).json({
    message: "Route Not Found"
  });
});

/**
 * Generic handler for errors
 */
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {}
  });
});

// start listening on our port
sequelize
  .authenticate()
  .then(() => {
    app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
  })
  .catch(err => console.error(`Could not connect to database, error: ${err}`));
