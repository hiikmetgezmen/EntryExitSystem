import mongoose from "mongoose";
import bcrypt from "bcrypt";
import createHttpError from "http-errors";
import {roles} from "../utils/constants.js";

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        lowercase:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:[roles.admin,roles.moderator,roles.person],
        default:roles.person
    }
});

userSchema.pre('save',async function(next){
    try {
        if(this.isNew)
        {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password,salt);
        this.password = hashedPassword;
        if(this.email === process.env.ADMIN.toLocaleLowerCase())
        {
            this.role = roles.admin;
        } 
        }
        
        next();
    } catch (error) {
        
    }
});

userSchema.methods.isValidPassword = async function(password)
{
    try {
        return bcrypt.compare(password , this.password);
        
    } catch (error) {
        throw createHttpError.InternalServerError(error.message);
    }
}

const User = mongoose.model('user',userSchema);
export default User;