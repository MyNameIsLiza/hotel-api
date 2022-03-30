const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

const ClientSchema = new Schema({
    surname: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    middleName: {
        type: String,
        required: false
    },
    passportNumber: {
        type: String,
        validate: {
            validator: function (v) {
                return v.length === 9;
            },
            message: props => `${props.value} is not a valid passport number!`
        },
        required: [true, 'User passport number required'],
        unique: true
    },
    telephoneNumber: {
        type: String,
        validate: {
            validator: function (v) {
                console.log('telephoneNumber', /\d{3}-\d{3}-\d{4}/.test(v));
                return /\d{3}-\d{3}-\d{4}/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        },
        required: [true, 'User phone number required']
    },
    privileged: {
        type: Boolean,
        required: true,
        default: false
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        validate: [function (email) {
            const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return re.test(email)
        }, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: 'Password is required',
    }
});

ClientSchema.plugin(uniqueValidator);

ClientSchema.pre('save', function (next) {
    const user = this;

    if (!user.isModified('password')) return next();

    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

ClientSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        console.log('err', err);
        console.log('isMatch', isMatch);
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

const Client = mongoose.model('clients', ClientSchema);
module.exports = Client;
