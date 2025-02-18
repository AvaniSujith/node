const AppError = require('./../utils/appError');

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
}



const handleDuplicateFieldsDB = err => {

    // const errors = Object.values(err.errors).map(el => el.message);

    const value = err.errmsg.match(/(["'])(\\?.)*?\1/);
    console.log(value);
    const message = `Duplicate field value: x. Please use another value`;
    return new AppError(message, 400);
};

const handleValidationErrorDB = err =>{
    const errors = Object.values(err.errors).map(el => el.message);

    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400)
}

const handleJWTError = err => new AppError('Invalid Token. Please log in again!', 401);

const handleJWTExpiredError = err => new AppError('Your token has expired! Please log in again', 401)

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error:err,
        message: err.message,
        stack: err.stack
    });
}  


const sendErrorProd = (err, res) => {
    //Operational, trusted error: send msg to client

    if(err.isOperational){
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    });

    //programming or other
}else{

    //1-log error

    console.error('ERROR 🔥', err);

    //2-send generic msg
    res.status(500).json({
        status: 'error',
        message: 'Something went wrong'
    })
}
};


module.exports = (err, req, res, next) => {
    // console.log(err.stack);

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if(process.env.NODE_ENV === 'development'){
        // res.status(err.statusCode).json({
        //     status: err.status,
        //     error: err,
        //     message: err.message,
        //     stack: err.stack
        // });

        sendErrorDev(err, res);

    } else if ( process.env.NODE_ENV === 'production'){
        // res.status(err.statusCode).json({

        //     status: err.status,
        //     message: err.message;
        // });
        let error = { ...err };

        if (error.name === 'CasterError') error = handleCastErrorDB(error);
        if (error.code === 11000) error = handleDuplicateFieldsDB(error);
        if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
        if (error.name === 'JsonWebTokenError') error = handleJWTError(error);
        if (error.name === 'TokenExpiredError') error = handleJWTExpiredError(error);
        
        sendErrorProd(error, res);
        }

        // sendErrorProd(error, req, res, next);
    

    // res.status(err.statusCode).json({
    //     status: err.status,
    //     message: err.message
    // })
};