import express from "express";
import User from "../models/user.model.js";
import mongoose from "mongoose";
import { roles } from "../utils/constants.js";
const router = express.Router();

router.get('/users',async (req,res,next)=>{
    try {
        const users = await User.find();
        res.render('manage-users', {users});
    } catch (error) {
        next(error);
    }
})

router.get('/user/:id', async (req,res,next)=>{
    try {
        const {id} = req.params;
        if(!mongoose.Types.ObjectId.isValid(id))
        {
            req.flash('error','Doest working');
            res.redirect('/admin/users');
            return;
        }
        const person = await User.findById(id);
        res.render('profile',{profiles:person});
    } catch (error) {
        next(error);
    }
})

router.post('/update-role', async (req,res,next)=>{
    const {id,role} = req.body;
    if(!id || !role)
    {
        req.flash('error','Doest working');
        return res.redirect('back');
    }
    // Check for valid mongoose objectID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        req.flash('error', 'Invalid id');
        return res.redirect('back');
      }
  
      // Check for Valid role
      const rolesArray = Object.values(roles);
      if (!rolesArray.includes(role)) {
        req.flash('error', 'Invalid role');
        return res.redirect('back');
      }

       // Admin cannot remove himself/herself as an admin
    if (req.user.id === id) {
        req.flash(
          'error',
          'Admins cannot remove themselves from Admin, ask another admin.'
        );
        return res.redirect('back');
      }
      
      const user = await User.findByIdAndUpdate(id,{role},{new:true,runValidators:true});
      req.flash('warning','uptaded');
      res.redirect('back');
  
})

export default router;