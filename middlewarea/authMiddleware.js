// authMiddleware.js
import jwt from 'jsonwebtoken';
import secret from "../config.js";

export default function (req, res, next) {
    if (req.method === "OPTIONS") {
        next();
    }
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return res.status(403).json({ message: 'User did not sign in' });
        }

        const token = authorizationHeader.split(' ')[1];
        console.log(token)
        if (!token) {
            return res.status(403).json({ message: 'User did not sign in' });
        }

        const decodedData = jwt.verify(token, secret.code);
        req.user = decodedData;
        console.log(decodedData)
        next();
    } catch (e) {
        console.log(e);
        return res.status(403).json({ message: 'User did not sign in or invalid token' });
    }
}

// checkAdmin.js
