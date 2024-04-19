import { Router } from "express";
import controller from "../authController.js";
const router = new Router()
import { check } from "express-validator"; 
import authMiddleware from "../middlewarea/authMiddleware.js";
import roleMiddleware from "../middlewarea/roleMiddleware.js";
import checkAdmin from '../middlewarea/checkAdmin.js';

router.post('/registration', [
    check('userName', 'Error in your name').notEmpty(),
    check('password', 'Error in password').isLength({min: 4, max: 10})
], controller.registration)
router.post('/login', controller.login)
router.get('/users', roleMiddleware(["ADMIN"]), controller.getUsers)
// router.post('/forgot-password', controller.forgotPassword)
// router.get('/verify',controller.verify, controller.verifyUser)
router.get('/logout', controller.logoutUser)
router.get('/get_token', controller.getToken)
router.get('/admin_panel', checkAdmin(["ADMIN"]), (req, res) => {
    res.json({message: 'you have admin privilegas'})
})

export default router