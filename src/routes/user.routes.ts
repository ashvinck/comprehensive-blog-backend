import { Router } from "express";
import { loginUser, registerUser } from "../controllers/user.controller";
import { loginValidation, signUpValidation } from "../middleware/auth-input-validation";


const router: Router = Router();

// To register a new  user
router.post('/signup',signUpValidation(), registerUser);

// to login user
router.post('/login',loginValidation(), loginUser )


export default router;