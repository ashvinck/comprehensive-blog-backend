import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../src/app';
import { connectMySQL } from '../../src/config/connectSQL';
import sequelize from '../../src/config/sequelize';
import { connectToMongoDB } from '../../src/config/mongodb';

beforeAll(async () => {
  await connectMySQL();
  await connectToMongoDB();
});

afterAll(async () => {
  await sequelize.close();
  await mongoose.disconnect();
});

describe('Express API Endpoints', () => {
  // Test the root endpoint
  describe('GET the root end point / ', () => {
     it('should respond with "Hello from Blog!" at the root endpoint', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toContain('Hello from Blog!');
  });
  });
});
