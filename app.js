import express from "express";
import createHttpError from "http-errors";
import morgan from "morgan";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import indexRoute from "./routes/index.route.js";
import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import connectFlash from "connect-flash";
import session from "express-session";
import passport from "passport";
import connectMongo from "connect-mongo"
import {ensureLoggedIn} from "connect-ensure-login";
import adminRoute from "./routes/admin.route.js";
import { roles } from "./utils/constants.js";
dotenv.config();

const app = express();
app.use(morgan('dev'));

const mongoStore = connectMongo(session);

app.set('view engine','ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(
    session({
        secret:process.env.SESSION,
        resave : false,
        saveUninitialized:false,
        cookie:{
            httpOnly:true
        },
        store: new mongoStore({mongooseConnection:mongoose.connection})
    })
);

app.use(passport.initialize());
app.use(passport.session());
import('./utils/passport.util.js');

app.use((req,res,next)=>{
    res.locals.user = req.user;
    next();
})


app.use(connectFlash());
app.use((req,res,next)=>{
    res.locals.messages = req.flash();
    next();
})

app.use('/',indexRoute);
app.use('/auth',authRoute);
app.use('/user', ensureLoggedIn({redirectTo:'/auth/login'}) ,userRoute);
app.use('/admin',ensureLoggedIn({redirectTo:'/auth/login'}),ensureAdmin,adminRoute)

app.use((req,res,next)=>{
    next(createHttpError.NotFound());
});

app.use((error,req,res,next)=>{
    error.status = error.status;
    res.status(error.status);
    res.send(error);
});


const port = process.env.PORT;

mongoose.connect(process.env.URI,{
    dbName :process.env.DB_NAME,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
    // useFindAndModify: false
}).then(()=>{
    console.log("connected");
}).catch((error)=>{
    console.log(error.message);
});

app.listen((port),()=>{
    console.log("Server is run"); 
});

// function ensureAuthenticated(req,res,next){
//     if(req.isAuthenticated())
//     {
//         next();
//     }
//     else
//     {
//         res.redirect("/auth/login");
//     }
// };

function ensureAdmin(req,res,next){
    if(req.user.role === roles.admin)
    {
        next();
    }
    else
    {
        req.flash('warning','admin page');
        res.redirect('/');
    }
}