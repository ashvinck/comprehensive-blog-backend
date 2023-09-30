import express, {Request, Response, NextFunction, Application, ErrorRequestHandler } from "express";
import { Server } from "http";
import createHttpError from "http-errors";
import { config } from 'dotenv';

// Dotenv configuration
config();

// Initialize express App
const app: Application = express();


app.get('/', (req: Request, res: Response, next: NextFunction) => { 
  res.send('Hello from Blog!')
})

// 404 Error handling
app.use((req: Request, res: Response, next: NextFunction) => {
  next( new createHttpError.NotFound())
})

// Error Handler with http-errors(middleware)
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  res.status(err.status || 500)
  res.send({
    status: err.status || 500,
    message: err.message 
  })
};
app.use(errorHandler);


const PORT: Number = Number(process.env.PORT) || 4005;

const server: Server = app.listen(PORT, () => console.log(`The server started in: ${PORT} ✨`));