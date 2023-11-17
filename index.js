const http = require("http");
const createError = require("http-errors");
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const debug = require("debug")("learnteach:server");
const socketIo = require("socket.io");

/**
 * Normalize a port into a number, string, or false.
 */

const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

/**
 * Event listener for HTTP server "error" event.
 */

const onError = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

/**
 * Event listener for HTTP server "listening" event.
 */

const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
};

const router = require("./app/router");
const app = express();

// view engine setup
app.set("views", path.join(__dirname, "app/views"));
app.set("view engine", "ejs");

app.use(expressLayouts);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", router);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);

  if (err.status === 404) {
    return res.render("error", {
      layout: "layouts/main-layout",
      title: "Page Not Found!",
      code: 404,
      errorTitle: "Sorry, page not found",
      errorSubTitle: "The page you requested could not be found",
    });
  }

  return res.render("error", {
    layout: "layouts/main-layout",
    title: "Internal Server Error!",
    code: 500,
    errorTitle: "Sorry, your request cannot be processed",
    errorSubTitle: "It seems there was an error on our side",
  });
});

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Create Socket.io server.
 */

const io = socketIo(server, {});
const CommunityService = require("./app/services/CommunityService");
const community = new CommunityService(io);

io.on("connection", (socket) => {
  socket.on("join", community.join);
  socket.on("message", (chat) => {
    community.message(chat);
    io.emit("message", chat);
  });
  socket.on("disconnect", community.leave);
});

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

console.log(`Server run on http://localhost:${port}`);
