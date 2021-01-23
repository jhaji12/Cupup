const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const {isEmail} = require('validator');

//employee schema

const employeeSchema = new mongoose.Schema({
   full_name:{
       type:String,
       required:true
   },
   organisation_name:{
       type:String,
       required:true
   },
   employe_id:{
       type:String,
       required:[true, 'Employe ID is Required'],
       unique:true
    },
    mobile_no:{
        type:Number,
        required:true

    },
    email:{
        type: String,
        required: [true, 'Email is required'],
        unique:true,
        validate: [isEmail, 'Please enter a valid email']
    },
    password:{
        type: String,
        required: [true, 'Please enter a password'],
    },
    img:
    {
        data: Buffer,
        contentType: String,
        
    }
});



// bcrypting password
employeeSchema.pre('save',async function(next){
    const salt=await bcrypt.genSalt();
    this.password=await bcrypt.hash(this.password,salt);
    next();
});
// static login
employeeSchema.statics.login = async function(employe_id, password){
    const employe = await this.findOne({employe_id});
    if (employe){
  const auth = await bcrypt.compare(password, employe.password);
  if(auth){
      return employe;
  }
  throw Error('incorrect password');
    }
    throw Error('invalid employe ID');
}


const Employe = mongoose.model('employe', employeeSchema);
module.exports = Employe;