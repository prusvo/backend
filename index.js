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
const buildPath = path.join(__dirname, "../frontend/build")

app.use(cors({
    origin: ['http://recipees.net','http://recipeee.c1.biz', 'http://localhost:3000'],
    credentials: true
}))
app.use(cookieParser())

// Показати повідомлення про підключення до MongoDB тільки один раз
let connectedToMongoDB = false;

mongoose.connect(API)
    .then(() => {
        if (!connectedToMongoDB) {
            console.log('Connected to Mongo DB');
            connectedToMongoDB = true; // Помітити, що повідомлення вже виведено
        }

        // Встановлення обробників запитів після підключення до бази даних
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

        // Показати повідомлення про запуск сервера тільки один раз
        let serverRunningMessageDisplayed = false;

        app.listen(PORT, () => {
            if (!serverRunningMessageDisplayed) {
                console.log(`Server is running on port ${PORT}`);
                serverRunningMessageDisplayed = true; // Помітити, що повідомлення вже виведено
            }
        });
    })
    .catch((error) => {
        console.error('Failed to connect to MongoDB:', error);
        process.exit(1); // Вийти з процесу, якщо підключення до MongoDB не вдалося
    });
