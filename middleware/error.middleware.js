//we are intercepting the error and trying to find
// a bit more informaton about the error

//basically making global error handling middleware
const errorMiddleware = (err, req, res, next) => {
  try {
    let error = { ...err };
    error.message = err.message;

    console.error(err);

    // figuring out the error type
    // Mongoose bad ObjectId error
    if (err.name === "CastError") {
      const message = `Resource not found. Invalid: ${err.path}`;
      error = new Error(message);
      error.statusCode = 404;
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
      const message = `Duplicate field value entered`;
      error = new Error(message);
      error.statusCode = 400;
    }

    // Mongoose validation error
    if (err.name === "ValidationError") {
      //object values creates an array of values of objects
      const message = Object.values(err.errors)
        .map((val) => val.message)
        .join(", ");
      error = new Error(message);
      error.statusCode = 400;
    }

    //response from this error middleware
    //setting the http status code
    //sending json response
    //response body structure
    //500 is the general server error code
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || "Server Error",
    });
  } catch (error) {
    next(error);
  }
};

export default errorMiddleware;
