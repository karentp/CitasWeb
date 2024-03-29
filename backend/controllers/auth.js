const User = require("../models/User");
const ErrorResponse = require('../utils/errorResponse');
const sendEmail = require("../utils/sendEmail");
const crypto = require('crypto');

const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

exports.register = async (req, res, next) => {
    const { username, email, password, type, role } = req.body;

    try {
        const user = await User.create({
            username,
            email,
            password,
            type,
            roles: [
            ],
            name: "",
            lastname: "",
            phone: ""
            
        });

        sendToken(user, 201, res);
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    

    if (!email || !password) {
        return next(new ErrorResponse("Email or password not provided", 400));
    }

    try {
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return next(new ErrorResponse("Usuario o contraseña son incorrectas", 404));
        }

        const isMatch = await user.matchPasswords(password);

        if (!isMatch) {
            return next(new ErrorResponse("Usuario o contraseña son incorrectas", 401));
        }

        sendToken(user, 200, res);
    } catch (error) {
        return next(new ErrorResponse(error.message, 500));
    }
};

exports.forgotpassword = async (req, res, next) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if(!user){
            return next(new ErrorResponse("Error could not be sent", 404));
        }

        const resetToken = user.getResetPasswordToken();

        await user.save();

        const resetUrl = `http://localhost:3000/passwordreset/${resetToken}`;

        const message = `
        <h1> You have requested a password reset </h1>
        <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
        `

        try {
            await sendEmail({
                to: user.email,
                subject: "Password Reset Request",
                text: message
            });

            res.status(200).json({ success: true, data: "Email Sent" });
        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            
            await user.save();

            return next(new ErrorResponse("Email could not be sent",500));


        }

    } catch (error) {
        next(error);
    }
};

exports.resetpassword = async (req, res, next) => {
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.resetToken).digest("hex");

    try {
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now()}
        })

        if(!user){
            return next(new ErrorResponse("Invalid Reset Token", 400));
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(201).json({
            success: true,
            data: "Password Reset Success"
        })

    } catch (error) {
        next(error);
    }
};

const sendToken = (user, statusCode, res) => {
    const token = user.getSignedToken();
    res.status(statusCode).json({ success: true, token, id: user._id, type: user.type, image: user.image })
}