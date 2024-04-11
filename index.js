import express from "express";
import mongoose from "mongoose";
import cors from 'cors'
import bodyParser from "body-parser";
import path from "path"

import cookieParser from "cookie-parser";


import authRouter from "./routes/authRouter.js"
import RecPageRouter from "./routes/RecPageRouter.js"
const PORT = process.env.PORT || 5001
const API = 'mongodb+srv://admin:admin@cluster0.t1ju6q0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
const app = express()
const __dirname = path.resolve()
const buildPath = path.join(__dirname, "../recipeesfrontend/build")
app.use(cors({
    origin: ['http://3.71.202.234'],
    credentials: true
}))

app.use(cookieParser())






mongoose.connect(API)
    .then(() => {
        console.log('Connected to Mongo DB')
        app.use(express.json())
        app.use(bodyParser.json());
        app.use("/auth", authRouter)
        app.use("/recipe", RecPageRouter)
        app.use(express.static(buildPath))
        app.get("*", (req, res) =>{
            res.sendFile(path.join(buildPath, "index.html"), (err) => {
                if(err){
                    console.log(err);
                    res.status(500).send("Internal Server Error");
                }
            });
        });

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Failed to connect to MongoDB:', error);
        process.exit(1); // Exit the process if MongoDB connection fails
    });




