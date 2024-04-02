import mongoose from "mongoose";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import { createError } from "../error.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from 'dotenv';


dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    },
    port: 587,
    host: 'smtp.gmail.com'
});

export const signup = async (req, res, next) => {
    const { email } = req.body
    if (!email) {return res.status(422).send({ message: "Missing email." });}
    try {
        // Check if the email is in use
        const existingUser = await User.findOne({ email }).exec();
        if (existingUser) {
            return res.status(409).send({
                message: "Email is already in use."
            });
        }
        // Step 1 - Create and save the userconst salt = bcrypt.genSaltSync(10);
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(req.body.password, salt);
        const newUser = new User({ ...req.body, password: hashedPassword });

        newUser.save().then((user) =>
        {
            const token = jwt.sign({ id: user._id }, process.env.JWT, { expiresIn: "9999 years" });
            res.status(200).json({ token, user });
        }).catch((err) => {
            next(err);
        });
    } catch (err) {
        next(err);
    }
}

export const signin = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return next(createError(201, "User not found"));
        }
        if (user.googleSignIn) {
            return next(createError(201, "Entered email is Signed Up with google account. Please SignIn with google."));
        }
        const validPassword = bcrypt.compareSync(req.body.password, user.password);
        if (!validPassword) {
            return next(createError(201, "Wrong password"));
        }
        // create jwt token
        const token = jwt.sign({ id: user._id }, process.env.JWT, { expiresIn: "9999 years" });
        res.status(200).json({ token, user });

    } catch (err) {
        next(err);
    }
}

export const logout = (req, res) => {
    res.clearCookie("access_token").json({ message: "Logged out" });
}

export const findUserByEmail = async (req, res, next) => {
    const { email } = req.query;
    try {
        const user = await User.findOne({ email: email });
        if (user) {
            return res.status(200).send({
                message: "User found"
            });
        } else {
            return res.status(202).send({
                message: "User not found"
            });
        }
    } catch (err) {
        next(err);
    }
}

export const resetPassword = async (req, res, next) =>
{
    const { email, password } = req.body;
    try {
        await User.findOne({ email }).then(user => {
            if (user)
            {
                const salt = bcrypt.genSaltSync(10);
                const hashedPassword = bcrypt.hashSync(password, salt);
                User.updateOne({ email: email }, { $set: { password: hashedPassword } }).then(() => {

                    req.app.locals.resetSession = false;
                    return res.status(200).send({
                        message: "Password reset successful"
                    });
                }).catch(err => {
                    next(err);
                });
            } else {
                return res.status(202).send({
                    message: "User not found"
                });
            }
        });
    } catch (err) {
        next(err);
    }
}

export const verifypassword = (req,res,next) =>{

}