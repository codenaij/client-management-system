const path = require("path");
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const bodyParser = require("body-parser");
const compression = require("compression");

const app = express();

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const branchRouter = require("./routes/branchRoutes");
const customerRouter = require("./routes/customerRoutes");
const authRouter = require("./routes/authRoutes");
const investmentRouter = require("./routes/investmentRoutes");
const topupRouter = require("./routes/topupRoutes");

app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

app.use(compression());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/branches", branchRouter);
app.use("/api/v1/customers", customerRouter);
app.use("/api/v1/investments", investmentRouter);
// app.use('/api/v1/staff', staffRouter);
app.use("/api/v1/topup", topupRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/../", "frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(
      path.join(__dirname, "/../", "frontend", "build", "index.html")
    )
  );
}

module.exports = app;
