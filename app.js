import express from 'express'
//import { body, validationResult } from 'express-validator'
import mongoose from 'mongoose'
import Product from './models/product.model.js'
import { GoogleStrategy } from './config/passport-setup.js'
import User from './models/user.model.js'
import cookieSession from 'cookie-session'
import passport from 'passport'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config()
const port = process.env.PORT
const app = express()

app.use(express.json());
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended:true}))

app.use(cookieSession({
    maxAge:24*60*60*1000,
    keys:[process.env.COKIE_SESSION_KEYS]
}))

app.use(passport.initialize())
app.use(passport.session())

app.set('view engine', 'ejs')

import loginGoogle from './routes/google-auth.js'
app.use('/', loginGoogle)
import profRoutes  from './routes/profile.routes.js'
app.use('/perfil', profRoutes)
import apiRouter from "./routes/api.js"
app.use('/api', apiRouter)

async function adminVerif(req, res, next){
    const acc = req.user
    if(acc === undefined){
        return res.redirect('/')
    }
    await User.findById({_id: acc.id, admin: {$exists: true, $eq: true}})
        .then((prod) => {
            if (prod.admin) {
                next()
            } else {
                return res.redirect('/')
            }
    })
}

app.get('/admin', adminVerif, async (req, res) => {
    try{
        const data = await Product.find({ verified: {$exists: false} });
        res.render("admin.ejs", {user: req.user, data});
    }catch(e){
        res.status(500).json({message: e.message})
    }
});

// app.get('/', async (req, res)=>{
//     await Product.deleteMany({})
//     res.send("Succes")
// })

app.get('/', async (req, res) => {
    try{
        const data = await Product.find({verified: true});
        if(req.user === undefined){
            return res.render("index.ejs", {user: false, data});
        }
        res.render("index.ejs", {user: req.user, data});
    }catch(e){
        res.status(500).json({message: e.message})
    }
});

app.get('/comentarios/:val', async (req, res) =>{
    try{
        const recOrPop = req.params
        let populares
        switch(recOrPop.val){
            case 'recientes':
                populares = false
                break;
            case 'populares':
                populares = true
                break;
            default:
                return res.redirect('/')
        }
	    const products = await Product.find({verified: true});
        if(req.user === undefined){
            return res.render("productos.ejs", {user: false, populares: populares, data: products});
        }
        const user = req.user
	    res.render("productos.ejs", {user: user, populares: populares, data: products})
    }
    catch(e){
	res.status(500).json({message: e.message});
    }
})

mongoose.connect(process.env.MONGODB_SRV)
.then(() =>{
    console.log("Connected to database");
})
.catch(() =>{
    console.log("Failed to connect to database");
});

app.listen(port, () =>{
    console.log('Server is running on port ' + port);
});
