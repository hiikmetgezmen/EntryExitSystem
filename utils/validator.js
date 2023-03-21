import { body } from "express-validator";
  export const registerValidator =  [
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
        ]
