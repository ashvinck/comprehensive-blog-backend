import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import createError from 'http-errors';
config();

// Sign JWT Token
export const signAccessToken = async (username: string): Promise<string | undefined> => {
  const payload = {
    username: username,
  };
  const secret = process.env.ACCESS_TOKEN_SECRET as string;
  const options: jwt.SignOptions = { expiresIn: '2h' };

  try {
    const token: string = jwt.sign(payload, secret, options);
    return token;
  } catch (err) {
    console.error(err);
    throw createError.InternalServerError("Error generating token");
  }
};
