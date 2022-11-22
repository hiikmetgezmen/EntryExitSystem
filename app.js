import express from "express";
import createHttpError from "http-errors";
import morgan from "morgan";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import indexRoute from "./routes/index.route.js";
import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import expressSession from "express-session";
import connectFlash from "connect-flash";
import session from "express-session";
import passport from "passport";
dotenv.config();

const app = express();
app.use(morgan('dev'));

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
    })
);

app.use(passport.initialize());
app.use(passport.session());
import('./utils/passport.util.js');

app.use(connectFlash());
app.use((req,res,next)=>{
    res.locals.messages = req.flash();
    next();
})

app.use('/',indexRoute);
app.use('/auth',authRoute);
app.use('/user',userRoute);

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