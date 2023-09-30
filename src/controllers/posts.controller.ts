import { Request, Response, NextFunction } from 'express';
import Post from '../models/mongo.posts';
import createError from 'http-errors';

// To create new posts
export async function createPosts(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { title, content, category_id } = req.body;
    const post = new Post({ title, content, category_id });
    const savedPost = await post.save();
    res.status(201).send({ message: 'Post created successfully!' });
  } catch (error) {
    console.error(error);
    next(error);
  }
}

// To get a list of all Blog Posts
export async function getAllPosts(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
}

// To get PostById
export async function getPostById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const {id} = req.params;
  try {
    const post = await Post.findById(id);
  
    if (!post) {
      throw createError.NotFound('Post Not Found! 😶‍🌫️');
    }
    res.json(post);
  } catch (error) {
    console.error(error);
    next(error);
  }
}

// To Update a PostById
export async function updatePostById(req: Request, res: Response, next: NextFunction): Promise<void>{
  try {
    const { title, content, category_id } = req.body;
    const { id }  = req.params;
    const UpdatedPost = await Post.findByIdAndUpdate(id, { title, content, category_id }, { new: true });
    if (!UpdatedPost) {
      throw createError.NotFound('Post Not Found! 😶‍🌫️');
    }
    res.status(200).send({message: "Post updated successfully!"})
  } catch (error) {
    console.error(error);
    next(error);
  }
}

// To delete a PostById
export async function deletePostById(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { id } = req.params;
  try {
    const deletedPost = await Post.findByIdAndDelete(id);
    if (!deletedPost) throw createError.NotFound('Post Not Found! 😶‍🌫️'); // Add "throw" keyword here
    res.status(200).send({ message: "Post deleted Successfully!" });
  } catch (error) {
    console.error(error);
    next(error);
  }
}

// To get the latest post from each category
export async function getLatestPostByCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
     const latestPosts = await Post.aggregate([
      // Unwind the category_id array to create multiple documents
      { $unwind: '$category_id' },
      // Sort by 'created_at' in descending order
      { $sort: { 'created_at': -1 } },
      // Group by 'category_id' and select the first document in each group
      {
        $group: {
          _id: '$category_id',
          latestPost: { $first: '$$ROOT' },
        },
      },
      // Replace _id with category_id
      { $project: { _id: 0, category_id: '$_id', latestPost: 1 } },
    ]);

    res.json(latestPosts);
  } catch (error) {
    console.error(error);
    next(error);
  }
}