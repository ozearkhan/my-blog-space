import { Hono } from 'hono';
import {
    jwtMiddleware,
    getBlogsHandler,
    getSingleBlogHandler,
    createBlogHandler,
    updateBlogHandler
} from "./controller";

export const blog = new Hono();

// All routes require JWT authentication
blog.use('/*', jwtMiddleware);
// Blog post creation
blog.post('/', ...createBlogHandler);

// Update an existing blog
blog.put('/', ...updateBlogHandler);

// Get all blog posts
blog.get('/bulk', ...getBlogsHandler);

// Get a single blog post by ID
blog.get('/:id', ...getSingleBlogHandler);


