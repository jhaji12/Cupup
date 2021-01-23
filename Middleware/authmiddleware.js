const jwt = require('jsonwebtoken');
const Employe = require('../models/Employe');

const requireAuth = (req,res,next) => {
    const token = req.cookies.jwt;

    if(token){
        jwt.verify(token, 'cafeteria', (err,decodedToken) => {
            if(err){
                res.redirect('/login');
            }
            else{
                console.log(decodedToken)
                next();
            }
        });
    }
    else{
        res.redirect('/login');
    }
};

const currentUser = (req,res,next) => {
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token,process.env.JWT_SECRET_KEY, async (err, decodedToken) => {
            if(err){
                console.log(err.message);
                res.locals.employe = null;
                next();
            } else{
                console.log(decodedToken);
                let employe = await Employe.findById(decodedToken.id);
                res.locals.employe = employe;
                next();
            }
        });
    }
    else{
       res.locals.employe = null;
       next();
    }
}

module.exports = {requireAuth, currentUser};