import express from "express";
import User from "../models/user.model.js";
const router = express.Router();
import { body, validationResult } from "express-validator";

router.get("/login", async (req, res, next) => {
  res.render("login");
});

router.post("/log", async (req, res, next) => {
  res.send("log post");
});

router.get("/register", async (req, res, next) => {
  // req.flash('error','some error');
  // req.flash('error','some error 2');
  // req.flash('info','some value');
  // req.flash('warning','some value');
  // req.flash('success','some value');
  // const messages = req.flash();
  res.render("register");
});

router.post(
  "/register",
  [
    body("email")
      .trim()
      .isEmail()
      .withMessage("Email must be a valid email")
      .normalizeEmail()
      .toLowerCase(),
    body("password").trim().isLength(2).withMessage("Password is too short"),
    body("password2").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords not same");
      }
      return true;
    }),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      errors.array().forEach((error) => {
        req.flash("error", error.msg);
      });
      res.render("register", { email: req.body.email, messages: req.flash() });
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
      req.flash('success',`${user.email} is registered succesfuly`);
      res.redirect('/auth/login');
    } catch (error) {
      next(error);
    }
  }
);

router.get("/logout", async (req, res, next) => {
  res.send("logout");
});

export default router;
