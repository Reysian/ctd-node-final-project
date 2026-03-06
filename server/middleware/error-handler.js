const errorHandlerMiddleware = (err, req, res, next) => {
    return res.status(400).json({error: err.message});
};

module.exports = errorHandlerMiddleware;