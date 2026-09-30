export const notFound = (req, res) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
};

export const errorHandler = (err, req, res, next) => {
  console.error(err);
  const statusCode = err.name === "MulterError" && err.code === "LIMIT_FILE_SIZE" ? 413 : (res.statusCode >= 400 ? res.statusCode : 500);
  const message = statusCode === 413 ? "File is too large. Maximum size is 5 MB." : (err.message || "Something went wrong");
  res.status(statusCode).json({ message: process.env.NODE_ENV === "production" && statusCode === 500 ? "Something went wrong" : message });
};
