import jwt from 'jsonwebtoken';
import secret from '../config.js';

export default function (requiredRoles) {
    return async function (req, res, next) {
        if (req.method === 'OPTIONS') {
            return next();
        }

        try {
            const token = req.headers.authorization.split(' ')[1];
            
            if (!token) {
                return res.status(403).json({ message: 'User did not sign in' });
            }

            const decodedToken =  jwt.verify(token, secret.code);
            const { roles } = decodedToken;

            if (!roles || !roles.some(role => requiredRoles.includes(role))) {
                return res.status(403).json({ message: 'Insufficient permissions for this action' });
            }

            next();
        } catch (error) {
            console.error('Error in checkAdmin middleware:', error);
            return res.status(403).json({ message: 'Invalid token or insufficient permissions' });
        }
    };
}
