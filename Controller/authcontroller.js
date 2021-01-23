const mongoose = require('mongoose');
const Employe = require('../models/Employe');
// const Cart = require('../models/cart');
const jwt = require('jsonwebtoken');



//creating json web token
const maxAge = 1 * 24 * 60 * 60 * 1000;
const Token = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET_KEY, {
    expiresIn: maxAge,
    });
};
//error handling
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { employe_id: '', password: '', email: ''};
  
    if (err.code === 11000) {
        if(err.message.includes("email_1")){
            errors.email = 'that email is already registered';
        }
        else{
         errors.employe_id = 'employe ID already registered';
    
        }
        return errors;
    }
  
    if(err.message === "invalid employe ID"){
      errors.employe_id = "Please enter a valid Employe ID";
     
    }
  
    if(err.message === "incorrect password"){
      errors.password = "Password is incorrect";
      
    }
  
  
    if (err.message.includes('employe validation failed')) {
      Object.values(err.errors).forEach(({ properties }) => {
        errors[properties.path] = properties.message;
      });
    }
  return errors;
  }
  // signup and login controllers

module.exports.signup_get = async(req,res) => {
    res.render('signup');
}
module.exports.signup_post = async(req,res) => {
    const {email, password, employe_id,mobile_no,organisation_name,full_name} = req.body;
    try{
        const employe = await Employe.create({email, password, employe_id,mobile_no,organisation_name,full_name});
        const  token = Token(employe._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        if(employe){
            res.status(201);
            res.json({
                _id:employe._id,
                full_name:employe.full_name,
                organisation_name: employe.organisation_name,
                mobile_no:employe.mobile_no,
                password:employe,password,
                employe_id: employe.employe_id,
                email:employe.email,
                
            });  
        }
        
        else{
            res.status(400);
            throw new Error ('Invalid details');
        }
    }

        catch(err){
            const errors = handleErrors(err);
            res.status(400).json({errors});
        }
}
module.exports.login_get= async(req,res)=>{
    res.render('login');
}
module.exports.login_post=async(req,res)=>{
    const {employe_id, password} = req.body;
    try{
      const employe = await Employe.login(employe_id,password);
      const token = Token(employe._id);
      res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000});
       res.status(201).json({
         _id : employe._id,
         password: employe.password,
         employe_id: employe.employe_id
       });  
      }
        catch(err){
            const errors = handleErrors(err);
            res.status(400).json({errors});
        }
}
// logout controller
module.exports.logout_get = (req,res) => {
  res.cookie('jwt', '', {maxAge: 1});
  res.redirect('/');
}






