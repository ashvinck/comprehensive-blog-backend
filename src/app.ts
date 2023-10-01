import express, {
  Request,
  Response,
  NextFunction,
  Application,
  ErrorRequestHandler,
} from 'express';
import { Server } from 'http';
import createHttpError from 'http-errors';
import { config } from 'dotenv';
import cors from 'cors';

import postsRouter from './routes/posts.routes';
import authRouter from './routes/user.routes';
import { connectToMongoDB } from './config/mongodb';
import { connectMySQL } from './config/connectSQL';

// Load environment variables
config();

// Initialize express App
export const app: Application = express();

// Function to start the server
async function startServer() {
  try {
    // Checking if mongodb and mysql are available
    await Promise.all([connectToMongoDB(), connectMySQL()]);

    app.use(express.json()); //  Middleware to parse JSON request data
    app.use(cors()); // Cors middleware to enable CORS support

    // Routers
    app.use('/api/posts', postsRouter); //Posts router
    app.use('/auth', authRouter);  // Auth author

    app.get('/', (req: Request, res: Response, next: NextFunction) => {
      res.send('Hello from Blog!');
    });

    // 404 Error handling
    app.use((req: Request, res: Response, next: NextFunction) => {
      next(new createHttpError.NotFound());
    });

    // Error Handler (middleware)
    const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
      res.status(err.status || 500);
      res.send({
        status: err.status || 500,
        message: err.message,
      });
    };
    app.use(errorHandler);

    const PORT: Number = Number(process.env.PORT) || 4005;

    const server: Server = app.listen(PORT, () =>
      console.log(`The server started in: ${PORT} 😁✨`)
    );
  } catch (error) {
    console.error('Error connecting to databases', error);
    process.exit(1);
  }
}

// Start the server
startServer();