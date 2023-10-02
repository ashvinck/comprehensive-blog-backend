import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../src/app';
import { connectToMongoDB } from '../../src/config/mongodb';
import postsModel from '../../src/models/posts.model';
import { signAccessToken } from '../../src/utilities/jwt.sign';
import { connectMySQL } from '../../src/config/connectSQL';
import sequelize from '../../src/config/sequelize';

beforeAll(async () => {
  await connectToMongoDB();
  await connectMySQL();
});

afterAll(async () => {
  await mongoose.disconnect();
   await sequelize.close();
});

describe('Express API Endpoints', () => {

  // Test POST / (Create a new blog post)
  describe('POST /api/posts', () => {
    it('It should create a new blog post', async () => {
      const postData = {
        title: 'Post 1',
        content: 'Content 1',
        category_id: 'category1',
      };

      const response = await request(app)
        .post('/api/posts')
        .send(postData);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Post created successfully!');

      // Verify that the post was actually created in the database
      const createdPost = await postsModel.findOne({ title: 'Post 1' });
      expect(createdPost?.content).toBe('Content 1');
    });
  });

  // Test GET /latest (Get latest posts by category)
  describe('GET /api/posts/latest', () => {
    it('should return the latest posts by category', async () => {
      // Create sample posts in the test database
      const jwt = signAccessToken("testuser")
      await postsModel.create([
        {
          title: 'Post 1',
          content: 'Content 1',
          category_id: 'category1',
        },
        {
          title: 'Post 2',
          content: 'Content 2',
          category_id: 'category2',
        },
      ]);
      const response = await request(app).get('/api/posts/latest').set("authorization",`Bearer ${jwt}`);
      expect(response.status).toBe(200);
      
    });
  });

  // Test GET /:id (Get post by ID)
  describe('GET /api/posts/:id', () => {
    it('should return a post by ID', async () => {
      // Create a sample post in the test database
      const createdPost = await postsModel.create({
        title: 'Test Post',
        content: 'This is a test post content',
        category_id: 'category1',
      });

      const response = await request(app).get(`/api/posts/${createdPost._id}`);

      expect(response.status).toBe(200);
      // Add assertions to verify the response content as needed
    });
  });

  // Test PUT /:id (Update post by ID)
  describe('PUT /api/posts/:id', () => {
    it('should update a post by ID', async () => {
      // Create a sample post in the test database
      const createdPost = await postsModel.create({
        title: 'Test Post',
        content: 'This is a test post content',
        category_id: 'category1',
      });

      const updatedData = {
        title: 'Updated Test Post',
        content: 'Updated content',
        category_id: 'category2',
      };

      const response = await request(app)
        .put(`/api/posts/${createdPost._id}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      // Verify that the post was actually updated in the database
      const updatedPost = await postsModel.findById(createdPost._id);
      expect(updatedPost?.title).toBe('Updated Test Post');
      expect(updatedPost?.content).toBe('Updated content');
    });
  });

  // Test DELETE /:id (Delete post by ID)
  describe('DELETE /:id', () => {
    it('should delete a post by ID', async () => {
      // Create a sample post in the test database
      const createdPost = await postsModel.create({
        title: 'Test Post',
        content: 'This is a test post content',
        category_id: 'category1',
      });

      const response = await request(app).delete(`/api/posts/${createdPost._id}`);

      expect(response.status).toBe(200);
      // Verify that the post was actually deleted from the database
      const deletedPost = await postsModel.findById(createdPost._id);
      expect(deletedPost).toBeNull();
    });
  });

  // Test GET / (Get all posts)
  describe('GET /', () => {
    it('should return a list of all blog posts', async () => {
      // Create sample posts in the test database
      await postsModel.create([
        {
          title: 'Post 1',
          content: 'Content 1',
          category_id: 'category1',
        },
        {
          title: 'Post 2',
          content: 'Content 2',
          category_id: 'category2',
        },
      ]);

      const response = await request(app).get('/api/posts');

      expect(response.status).toBe(200);
    });
  });
});