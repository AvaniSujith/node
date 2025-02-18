const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [ true, 'Please tell us your name']
    },
    email: {
        type: String,
        required: [ true, 'Please enter your email'],
        unique:true,
        lowercase: true,
        validate: [validator.isEmail, 'Enter a valid email']
    },
    photo: String,
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            validator : function(el){
                return el === this.password;
            },
            message: 'Both passwords not same'

        }
    },
    passwordChangedAt: Date
});

userSchema.pre('save', async function(next) {


    if(!this.isModified('password')) return next();

    // this.password = bcrypt.hash('User', userSchema);
    this.password = await bcrypt.hash(this.password, 12);

    this.passwordConfirm = undefined;
    next();

});

userSchema.methods.correctPassword = function(candidatePassword, userPassword){
    // this.password
    return bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.changedPasswordAfter = function(JWTTimestamp){

    if(this.passwordChangedAt){

        const changedTimeStamp = this.passwordChangedAt.getTime() / 1000;
        console.log(changedTimeStamp, JWTTimestamp);

    }


    //false means not changed

    return false;
    
}

const User = mongoose.model('User', userSchema);

module.exports = User;
