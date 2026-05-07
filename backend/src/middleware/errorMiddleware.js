//Status Management: It ensures the server sends an error code. If a route somehow fails but doesn't set an error code (staying at 200 OK), this code forces it to 500 Internal Server Error.
export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Handle Mongoose CastError (Invalid ID)
  //Mongoose Support: It specifically checks for a CastError. This happens in Mongoose when someone provides an invalid database ID (e.g., searching for a user with the ID "123" when it should be a 24-character string). It renames these confusing database errors to a simple "Resource not found" with a 404 status.
  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 404;
    message = "Resource not found";
  }
//Security & Debugging: It checks your environment. In development, it sends the full error stack (the long list of code lines where it failed) to help you fix it. In production, it hides that list (null) so hackers can't see your server's internal structure.
  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};