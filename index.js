import express from "express";
import mongoose from "mongoose";
import cors from 'cors';
import bodyParser from "body-parser";
import path from "path";
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRouter.js";
import RecPageRouter from "./routes/RecPageRouter.js";

const PORT = process.env.PORT || 5001;
const API = 'mongodb+srv://admin:admin@cluster0.t1ju6q0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const app = express();
const __dirname = path.resolve();
const buildPath = path.join(__dirname, "../frontend/build");

app.use(cors({
    origin: ['http://recipeee.c1.biz'],
    credentials: true
}));

app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());
app.use("/auth", authRouter);
app.use("/recipe", RecPageRouter);
app.use(express.static(buildPath));

mongoose.connect(API)
    .then(() => {
        console.log('Connected to Mongo DB');

        // Перевірка, чи з'єднання з базою даних встановлено
        if (!app.get('port')) {
            // Запуск сервера тільки один раз
            app.listen(PORT, () => {
                console.log(`Server is running on port ${PORT}`);
            });
        }
    })
    .catch((error) => {
        console.error('Failed to connect to MongoDB:', error);
        process.exit(1); // Вийти з процесу, якщо з'єднання з базою даних не вдалося
    });

// Обробник для коректного завершення роботи сервера
process.on('SIGINT', () => {
    console.log('Shutting down server...');
    mongoose.connection.close(() => {
        console.log('MongoDB connection closed');
        process.exit(0);
    });
});
