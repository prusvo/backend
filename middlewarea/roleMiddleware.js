import secret from "../config.js"
import jwt from 'jsonwebtoken'
export default function(roles) {
    return function (req, res, next) {
        if(req.metod === "OPTIONS") {
            next()
        }
        try{
            const token = req.headers.authorization.split(' ')[1]
            if(!token) {
                return res.status(403).json({message: 'User did not sign in'})
            }
            const { roles: roles} = jwt.verify(token, secret.code)
            let hasRole = false
            roles.forEach(role => {
                if(roles.includes(role)) {
                    hasRole = true
                }
            })
            if(!hasRole) {
                return res.status(403).json({message: 'you dont have data options'})
            }
            next()
        }
        catch(e){
            console.log(e)
            return res.status(403).json({message: 'User did not sign in2'})
        }
    }
}