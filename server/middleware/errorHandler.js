const notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`Route not found: ${req.originalUrl}`));
};

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  let message = err.message || "Something went wrong. Please try again.";
  let recognized = false;

  if (err.name === "CastError") {
    statusCode = 404;
    message = "Resource not found.";
    recognized = true;
  }
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors).map((e) => e.message).join(", ");
    recognized = true;
  }
  if (err.code === 11000) {
    statusCode = 400;
    message = "A record with that value already exists.";
    recognized = true;
  }
  if (statusCode === 400 && message.startsWith("Not allowed by CORS")) {
    recognized = true; // keep this exact, deliberately generic message
  }

  // Always log the real error server-side, regardless of environment.
  if (statusCode >= 500) {
    console.error("[Error]", err);
  }

  // Any *unrecognized* server error (Mongoose connection/buffering timeouts,
  // driver errors, unexpected exceptions, etc.) gets a generic, user-safe
  // message instead of leaking raw internals like "MongooseError: Operation
  // `products.find()` buffering timed out..." straight to the client.
  if (!recognized && statusCode >= 500) {
    message = "Something went wrong on our end. Please try again shortly.";
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};

module.exports = { notFound, errorHandler };
