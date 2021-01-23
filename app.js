const express = require("express");
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const colors = require('colors');
// const menuRoute = require('./routes/menuRoute');
const authRoute = require('./routes/authRoute');
const cartRoute = require('./routes/cartRoute');
const cookieParser =require('cookie-parser');
const {requireAuth, currentUser} = require('./Middleware/authmiddleware');
const path = require('path');
var multer = require('multer');
var fs = require('fs'); 


dotenv.config();

connectDB()
const app = express();
app.use(express.static('public'));
app.use(express.json());
app.use(bodyParser.json());

app.use(cookieParser());

//view engine
app.set('view engine', 'ejs');

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY;
const stripe = require('stripe')(stripeSecretKey);

app.get('*', currentUser);
app.get('/', (req,res) =>{
    fs.readFile('menu.JSON', function(error, data){
        if(error) {
            console.log(error);
        } else{
            res.render('home', {
                stripePublicKey:stripePublicKey,
                menu: JSON.parse(data)
            });
        }
    })
})


app.get('/profile', requireAuth, (req,res) => {
    res.render('profile');
})
app.get('/upload', requireAuth, (req,res) => {
    res.render('image');
})

app.post('/orderconfirm', function(req,res){
    fs.readFile('menu.json',function(error,data){
        if(error)
        {
            res.status(500).end();
            console.log(error);
        }else{
            const menuJson=JSON.parse(data)
            const menuArray=menuJson.Beverages.concat(menuJson.Snacks).concat(menuJson.Dessert)
            let total=0
            req.body.menu.forEach(function(menu){
                const menuJson=menuArray.find(function(i){
                    return i.id==menu.id
                })
                total= total + menuJson.price * menu.quantity
            })
            stripe.charges.create({
                amount:total,
                source:req.body.stripeTokenId,
                currency:'ind'
            }).then(function(){
                console.log("charge successful")
                res.json({message:'successfully ordered'})
            }).catch(function(){
                console.log('charge fail')
                res.status(500).end()
            })
        }
    })
})





const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}
const upload = multer({ storage: storage, fileFilter: fileFilter });

//Upload route
app.post('/upload', upload.single('image'), (req, res, next) => {
    try {
          res.render('image');
        }
     catch (error) {
        console.error(error);
    }
});



app.use(authRoute);

PORT = process.env.PORT;

app.listen(PORT, ()=> console.log(`Server started at port ${PORT}`))