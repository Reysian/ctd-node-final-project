const CustomError = require("../errors/custom-error");

const errorHandlerMiddleware = (err, req, res, next) => {
    if (err.statusCode) {
        return res.status(err.statusCode).json({error: err.message});
    }
    return res.status(400).json({error: err.message});
};

module.exports = errorHandlerMiddleware;