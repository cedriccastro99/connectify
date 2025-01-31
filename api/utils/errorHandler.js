const ErrorHandler = (err, req, res, next) => {
    const error = new Error(err.message);
    error.status = err.status || 500;
    res.status(error.status);
    return next(error);
}

export default ErrorHandler;