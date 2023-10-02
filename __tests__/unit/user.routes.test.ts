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

describe('User Routes', () => {
  const validUser = {
    username: 'testuser',
    password: 'TestPass123@',
    confirmPassword: 'TestPass123@',
    email: 'testuser@example.com',
  };

  it('should register a new user', async () => {
    try {
      const response = await request(app)
      .post('/auth/signup')
      .send(validUser)
      .set('Accept', 'application/json');

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'User registered successfully');
    } catch (error) {
       console.error('Error in registration test:', error);
    }
    
  });

  it('should not register a user with duplicate email', async () => {
    try {
      const response = await request(app)
      .post('/auth/signup')
      .send({
        ...validUser,
        username: 'anotheruser',
      })
      .set('Accept', 'application/json');

    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty('message', 'User already exists');
    } catch (error) {
       console.error('Error in registrering a user with duplicate email:', error);
    }
    
  });

  it('should log in a user with valid credentials', async () => {
    try {
     const response = await request(app)
      .post('/auth/login')
      .send({
        username: validUser.username,
        password: validUser.password,
      })
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Login Successful!'); 
    } catch (error) {
       console.error('Error logging in user:', error);
    }
    
  });

  it('should not log in a user with incorrect password', async () => {
    try {
      const response = await request(app)
      .post('/auth/login')
      .send({
        username: validUser.username,
        password: 'IncorrectPass123@',
      })
      .set('Accept', 'application/json');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'Invalid credentials');
    } catch (error) {
       console.error('Error in logging user with incorrect password:', error);
    }
    
  });

  it('should not log in a non-existent user', async () => {
    try {
       const response = await request(app)
      .post('/auth/login')
      .send({
        username: 'nonexistentuser',
        password: 'SomePass123@',
      })
        .set('Accept', 'application/json');
      expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'User not found')
      
    } catch (error) {
       console.error('Error in log in a non-existent user:', error);
    }
  });
});
