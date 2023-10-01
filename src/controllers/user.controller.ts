import { Request, Response, NextFunction } from 'express';
import { Op } from 'sequelize';
import User from '../models/user.model';
import createError from 'http-errors';
import { signAccessToken } from '../utilities/jwt.sign';

export async function registerUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { username, email, password } = req.body;

    // Check if a user with the same username or email already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ username }, { email }],
      },
    });
    if (existingUser) {
      throw createError.Conflict('User already exists');
    }

    // Create a new user with the attributes as an object
    const newUser = await User.create({
      username: username,
      email: email,
      password: password,
    });
    // Send a response indicating successful registration
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    next(error);
  }
}

export async function loginUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username: username } });
    if (!user) {
      throw createError.NotFound('User not found');
    }

    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      throw createError.Unauthorized('Invalid credentials');
    }
    // Generate access jwt
    const accessToken = await signAccessToken(user.username)
    if (!accessToken) {
      throw createError.InternalServerError("Error Logging in");
    }
    res.cookie('acess_token', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ message: 'Login Successful!' });
  } catch (error) {
    console.error(error);
    next(error);
  }
}