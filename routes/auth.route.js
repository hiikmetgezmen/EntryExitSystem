import express from "express";
import User from "../models/user.model.js";
const router = express.Router();
import { body, validationResult } from "express-validator";
import passport from "passport";
import { ensureLoggedIn, ensureLoggedOut } from "connect-ensure-login";
import { registerValidator } from "../utils/validator.js";

router.get(
  "/login",
  ensureLoggedOut({ redirectTo: "/" }),
  async (req, res, next) => {
    res.render("login");
  }
);

router.post(
  "/login",
  ensureLoggedOut({ redirectTo: "/" }),
  passport.authenticate("local", {
    // successRedirect: "/user/profile",
    successReturnToOrRedirect: "/",
    failureRedirect: "/auth/login",
    failureFlash: true,
  })
);

router.get(
  "/register",
  ensureLoggedOut({ redirectTo: "/" }),
  async (req, res, next) => {
    // req.flash('error','some error');
    // req.flash('error','some error 2');
    // req.flash('info','some value');
    // req.flash('warning','some value');
    // req.flash('success','some value');
    // const messages = req.flash();
    res.render("register");
  }
);

router.post(
  "/register",
  ensureLoggedIn({ redirectTo: "/" }),
  registerValidator,
  async (req, res, next) => {
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      errors.array().forEach((error) => {
        req.flash("error", error.msg);
      });
      const params = { email: req.body.email, messages: req.flash() };
      console.log(req.query);

      if (req.query.modalName) 
        params.modalName = req.query.modalName;
      console.log("hata sayfası");
      res.render(req.query.redirectUrl, params);
      return;
    }
    try {
      const { email } = req.body;
      const doesExist = await User.findOne({ email });
      if (doesExist) {
        res.redirect("/auth/register");
        return;
      }

      const user = new User(req.body);
      await user.save();
      req.flash("success", `${user.email} is registered succesfuly`);
      console.log("kayıt basarılı");
      res.redirect("/auth/login");
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/logout",
  ensureLoggedIn({ redirectTo: "/" }),
  async (req, res, next) => {
    req.logOut(function () {});
    res.redirect("/");
  }
);

export default router;

// function ensureAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) {
//     next();
//   } else {
//     res.redirect("/auth/login");
//   }
// }

// function ensureNotAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) {
//     res.redirect("back");
//   } else {
//     next();
//   }
// }
