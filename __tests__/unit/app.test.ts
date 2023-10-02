import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../src/app';
import { connectMySQL } from '../../src/config/connectSQL';
import sequelize from '../../src/config/sequelize';
import { connectToMongoDB } from '../../src/config/mongodb';

beforeAll(async () => {
  await connectMySQL();
  await connectToMongoDB();
})
afterAll(async () => {
  await sequelize.close();
  await mongoose.disconnect();
})

describe('Express API Endpoints', () => {
  // Test the root endpoint
  describe('GET /', () => {
    it('should return a 200 status code and a message', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Hello from Blog!' });
    });
  });
});