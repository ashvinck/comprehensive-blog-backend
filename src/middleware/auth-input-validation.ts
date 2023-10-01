import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// Validation using Express-validator for signup, signin, login, reset password
export const signUpValidation = () => {
  return [
    body('username')
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage('Username must be at least 3 characters')
      .trim(),
    body('email', 'Please enter a valid email address')
      .isEmail()
      .normalizeEmail(),
    body('password')
      .notEmpty()
      .withMessage('Password should not be empty')
      .isLength({ min: 8, max: 15 })
      .withMessage('Password must be between 8 and 15 characters')
      .matches(/\d/)
      .withMessage('Password should contain a numerical character')
      .matches(/[!@#$%^&*(),.?":{}|<>]/)
      .withMessage('Password should contain a special character'),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password fields do not match');
      }
      return true;
    }),

    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (errors.isEmpty()) {
        return next();
      }
      const extractedErrors: { message: string }[] = [];
      errors.array().map((err) => extractedErrors.push({ message: err.msg }));

      return res.status(422).json({ errors: extractedErrors });
    },
  ];
};

export const loginValidation = () => {
  return [
    body('username', 'Please enter a username')
      .notEmpty()
      .trim(),
    body('password').notEmpty().withMessage('Password field cannot be empty'),
    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (errors.isEmpty()) {
        return next();
      }
      const extractedErrors: { message: string }[] = [];
      errors.array().map((err) => extractedErrors.push({ message: err.msg }));

      return res.status(409).json({ errors: extractedErrors });
    },
  ];
};
