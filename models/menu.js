const mongoose=require('mongoose');

const menuSchema=new mongoose.Schema({
    id:{
      type: Number
    },
    name:{
      type:String,
      required:true
    },
    price:{
        type:Number,
        required:true
    },
    imgName:{
      type: String,
      required: true
    },
    

});


const Menu = mongoose.model('menu',menuSchema);

module.exports = Menu;