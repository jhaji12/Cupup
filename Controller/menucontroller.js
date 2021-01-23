const asyncHandler = require('express-async-handler');
const Menu = require('../models/menu');

const getMenu = asyncHandler(async(req,res) => {
    const menu = await Menu.find({});
    res.json(menu);
});

const getMenuById = asyncHandler(async(req,res) => {
    const menu = await Menu.findById(req.params.id);

    if(menu){
        res.json(menu);
    }
    else{
        res.status(400);
    }
});



module.exports = {getMenu, getMenuById};