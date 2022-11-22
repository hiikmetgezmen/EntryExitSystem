import passport from "passport";
import localStrategy from "passport-local";

const LocalStrategy = localStrategy.Strategy;
import User from "../models/user.model.js";

passport.use(
    new LocalStrategy({
        usernameField:"email",
        passwordField:"password"
    },async (email , password , done)=>{
        try {
            const user = await User.findOne({email});

            if(!user)
            {
                return done(null , false , {message: "Email not registered"});
            }

            const isMatch = await user.isValidPassword(password);

            return isMatch ? done(null,user) :  done(null , false , {message: "Incorrect password"});
        } catch (error) {
            done(error);
        }
    })
);

passport.serializeUser(function (user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });