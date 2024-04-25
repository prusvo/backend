// middleware/checkAdmin.js
import jwt from 'jsonwebtoken';
import secret from '../config.js';

export default function checkAdmin() {
    return async function (req, res, next) {
        try {
            const authorizationHeader = req.headers.authorization;
            if (!authorizationHeader) {
                return res.status(403).json({ message: 'Authorization header is missing' });
            }

            const token = authorizationHeader.split(' ')[1];
            if (!token) {
                return res.status(403).json({ message: 'User did not sign in' });
            }

            const decodedToken = jwt.verify(token, secret.code);
            const { roles } = decodedToken;

            if (!roles || !roles.includes('ADMIN')) {
                return res.status(403).json({ message: 'Insufficient permissions for this action' });
            }

            // Якщо перевірка успішна, продовжуйте виконання наступних дій
            next();
        } catch (error) {
            console.error('Error in checkAdmin middleware:', error);
            return res.status(403).json({ message: 'Invalid token or insufficient permissions' });
        }
    };
}
