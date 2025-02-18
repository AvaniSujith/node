const catchAsync = require('../utils/catchAsync');
// const util = require('util');
const { promisify } = require('util');
const User = require('./../models/userModel');
const jwt = require('jsonwebtoken');
const AppError = require('./../utils/appError');


const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN 
    });
}

exports.signup = catchAsync( async (req, res, next) => {
    const newUser = await User.create(req.body);

    // const newUser = await User.create({
    //     name: req.body.name,
    //     email: req.body.email,
    //     password: req.body.password,
    //     passwordConfirm: req.body.passwordConfirm

    // });

    // const token = jwt.sign({ id: newUser._id}, 'secret');

    // const token = jwt.sign( { id: newUser._id}, process.env.JWT_SECRET, {
    //     expiresIn : process.env.JWT_EXPIRES_IN
    // });

    const token = signToken(newUser._id);

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    });

});

exports.login = catchAsync(async(req, res, next) =>  {

    const { email, password } = req.body;
    
    if(!email || !password){

        return next(new AppError('Please provide email and password', 400));

    }

    const user = await User.findOne({ email }).select('+password');

    // console.log(user);
    
    // const correct = await user.correctPassword(password, user.password);

    // if(!user || !correct){

    if(!user || !await user.correctPassword(password, user.password)){
        return next(new AppError('Incorrect email or phone number', 401));
    }
    
    // const token = '';

    const token = signToken(user._id);

    res.status(200).json({
        status: 'success',
        token
    });
    
});

exports.protect = catchAsync(async(req, res, next) => {

    //1* Getting token and check of ifs there
    let token;
    if(
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ){
        token = req.headers.authorization.split(' ')[1];
    }
    // console.log(token);

    if(!token){
        return next(new AppError('You are not Logged in! Please log in to get access.', 401));
    }

    // 2* Verification

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
    console.log(decoded)

    // 3* check if user still User.exists

    const freshUser = await User.findById(decoded.id);

    if(!freshUser) {
        return next( 
            new AppError('The user belonging to this token does no longer exist.', 401)
        );
    }

    // 4* check if user chnaged passwor after the token was issued 
    if (freshUser.changedPasswordAfter(decoded.iat)){
        return next(
            new AppError('User recently changed password! Please log in again', 401)
      );
    };

    //Grand access to protected route

    req.user = currentUser;
    next();

});

