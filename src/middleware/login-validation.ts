import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import { config } from 'dotenv';
config();

// Middleware to handle authentication
export const authValidation = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer')) {
      throw createError.Unauthorized();
    }
    // getting access token from headers
    const accessToken = authHeader.split(' ')[1];
    // verify access token
    jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET as string,
      (err) => {
        if (err) {
          throw createError.Forbidden();
        }
        next();
      }
    );
  } catch (error) {
    throw createError.Unauthorized("Invalid Token");
  }
};
