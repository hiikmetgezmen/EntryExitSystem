import express from "express";

const router = express.Router();

router.get('/profile',async (req,res,next)=>{
    const profiles = req.user;
    res.render("profile",{profiles});
});

export default router;