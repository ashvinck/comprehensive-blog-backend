import { Router } from "express";
import { createPosts, deletePostById, getAllPosts, getLatestPostByCategory, getPostById, updatePostById } from "../controllers/posts.controller";
import { authValidation } from "../middleware/login-validation";


const router: Router = Router();

// To create a new Blog Post
router.post('/', createPosts);

// To find the latest blog post corresponding to category
router.get('/latest',authValidation, getLatestPostByCategory);

// To get posts By id
router.get('/:id', getPostById);

// To update a blog post By Id
router.put('/:id', updatePostById);

// To delete a blog post By Id
router.delete('/:id', deletePostById);

// To get all blog posts
router.get('/', getAllPosts);

export default router;