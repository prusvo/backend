import Role from "./models/Role.js"

import User from "./models/User.js"
import bcrypt from "bcryptjs"
import { validationResult } from "express-validator"
import  jwt  from "jsonwebtoken"
import secret from "./config.js"
// import nodemailer from 'nodemailer'




class authController {
    async registration(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: 'Error in registration', errors: errors.array() });
            }
    
            const { userName, password } = req.body;
            const candidate = await User.findOne({ userName });
    
            if (candidate) {
                return res.status(400).json({ message: 'User with this username already exists' });
            }
    
            const salt = bcrypt.genSaltSync(7);
            const hashPassword = bcrypt.hashSync(password, salt);
    
            // Assuming roles should be an array
            // const userRole = await Role.findOne({ value: 'USER' });
            const user = new User({ userName, password: hashPassword, roles: 'USER'});
            await user.save();
    
            return res.json({ message: 'Registration successful' });
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: 'Internal server error during registration' });
        }
    }
    async login(req, res) {
        try {
            const { userName, password } = req.body;
    
            const user = await User.findOne({ userName });
    
            if (!user) {
                return res.status(400).json({ message: `User with name ${userName} is not found` });
            }
    
            const validPassword = await bcrypt.compare(password, user.password);
    
            if (!validPassword) {
                return res.status(400).json({ message: 'Incorrect password' });
            }
    
            // Оновлення токену для включення ролей
            const payload = {
                userName: user.userName,
                roles: user.roles,
            };
    
            const token = jwt.sign(payload, secret.code, { expiresIn: '1h' });
    
            res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });
            return res.json({ status: true, message: 'Login successfully', token });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Login error' });
        }
    }
    
    async getUsers(req, res) {
        try{
            const users = await User.find()
            const userRole = new Role()
            const adminRole = new Role({value: "ADMIN"})
            await userRole.save()
            await adminRole.save()
            res.json(users)
        }catch(e){
            console.log(e)
        }
    }
     
    async verifyUser(req, res) {
        try {
            return res.json({status: true,message: 'Authorized', roles: req.user.roles})
            
        }
        catch (error) {
            error => {
                res.json({message: 'User is not verify'})
                concole.error(error)
            }
        }
    }
    async verify(req, res, next) {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return res.status(403).json({ message: 'User does not have a token' });
        }
    
        const token = authorizationHeader.split(' ')[1];
        if (!token) {
            return res.status(403).json({ message: 'Invalid token' });
        }
    
        try {
            const decodedToken = jwt.verify(token, secret.code);
            req.user = decodedToken;
            next();
        } catch (error) {
            console.error(error);
            return res.status(403).json({ message: 'Invalid token' });
        }
    }
    
    async logoutUser (req, res) {
        try{
            res.clearCookie('token')
            return res.json({status: true, message: 'SuccesLogout'})
        } catch (err) {
            return console.log(err)
        }
    }
    async getToken(req, res) {
        try {
            const token = req.cookies.token;
            res.json({ token });
        } catch (err) {
            console.log('Token is not defined:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}
export default new authController