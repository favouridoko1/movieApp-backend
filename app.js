const express = require("express");
const app = express();
const morgan = require("morgan");
const PORT = process.env.PORT || 5000;
const moviesRouter = require("./Routes/moviesRoute");


if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
const logger = (req, res, next) => {
  console.log("Custume Middleware is being called");
  next();
};

app.use(express.json());
app.use(express.static("./public"));
app.use(logger);
app.use((req, res, next) => {
  req.requestedAt = new Date().toISOString();
  next(); 
});

app.use("/api/v1/movies", moviesRouter);

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));


module.exports = app;