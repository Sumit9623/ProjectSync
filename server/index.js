import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import projectRoutes from './routes/project.js';
import teamRoutes from './routes/teams.js';
import cookieParser from "cookie-parser";
import cors from 'cors';
import path from 'path';
dotenv.config();
const app = express();



/** Middlewares */

app.disable('x-powered-by');

const connect = () => {

};

app.use(cors());
app.use(express.json())
app.use("/auth", authRoutes)
app.use("/users", userRoutes)
app.use("/project", projectRoutes)
app.use("/team", teamRoutes)

app.listen(process.env.PORT,()=>{
    console.log("server started...")
    mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log('MongoDB connected...');
    })
    .catch((err) => {
        console.log(err);
    });
})
