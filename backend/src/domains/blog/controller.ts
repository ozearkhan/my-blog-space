import {createFactory} from "hono/factory";
import {getPrisma} from "../../config/db";
import {verify} from "hono/jwt";

const factory = createFactory();

const jwtMiddleware = factory.createMiddleware(async (c, next) => {
    const token = c.req.header('authorization')?.split(' ')[1];

    if (!token) {
        c.status(401);
        return c.json({ error: 'Unauthorized' });
    }

    try {
        const payload = await verify(token, c.env.JWT_SECRET);
        c.set('user', payload); // Set payload in context state
        await next();
    } catch (err) {
        c.status(401);
        return c.json({ error: 'Unauthorized' });
    }
});

const createBlogMiddleware = factory.createMiddleware(async (c, next) => {
    const prisma = getPrisma(c.env.DATABASE_URL);
    const body = await c.req.json();
    const user = c.get('user');

    try {
        const blog = await prisma.post.create({
            data: {
                title: body.title,
                content: body.content,
                published: body.published ?? false,
                authorId: user.id, // Using JWT payload's user ID
            }
        });
        c.set('id', blog.id);
        await next();
    } catch (e) {
        c.status(500);
        return c.json({ error: "Error creating blog post" });
    }
});

const updateBlogMiddleware = factory.createMiddleware(async (c, next) => {
    const prisma = getPrisma(c.env.DATABASE_URL);
    const body = await c.req.json();

    try {
        const blog = await prisma.post.update({
            where: { id: body.id },
            data: {
                title: body.title,
                content: body.content,
            }
        });
        c.set('blog', blog);
        await next();
    } catch (e) {
        c.status(500);
        return c.json({ error: "Error updating blog post" });
    }
});

const getBlogMiddleware = factory.createMiddleware(async (c, next) => {
    const prisma = getPrisma(c.env.DATABASE_URL);
    const blogId = c.req.param('id'); // Get blog ID from URL params

    try {
        const blog = await prisma.post.findUnique({
            where: { id: blogId }
        });

        if (!blog) {
            c.status(404);
            return c.json({ error: "Blog post not found" });
        }

        c.set('blog', blog);
        await next();
    } catch (e) {
        c.status(500);
        return c.json({ error: "Error fetching blog post" });
    }
});


//tod0 : should add pagination do not need to return all blogs.
const getAllBlogMiddleware = factory.createMiddleware(async (c, next) => {
    const prisma = getPrisma(c.env.DATABASE_URL);
    const blogs = await prisma.post.findMany(); // Fetch all blog posts
    c.set('blogs', blogs);
    await next();
});

const getBlogsHandler = factory.createHandlers(getAllBlogMiddleware, async (c) => {
    const blogs = c.get('blogs'); // Get the blogs from context
    return c.json(blogs); // Return all blogs as JSON
});


const getSingleBlogHandler = factory.createHandlers(getBlogMiddleware, async (c) => {
    const blog = c.get('blog');
    return c.json({ blog });
});

const createBlogHandler = factory.createHandlers(createBlogMiddleware, async (c) => {
    const blogId = c.get('id');
    return c.json({ message: 'Blog created', id: blogId });
});

const updateBlogHandler = factory.createHandlers(updateBlogMiddleware, async (c) => {
    const blog = c.get('blog');
    return c.json({ message: 'Blog updated', blog });
});

export {
    jwtMiddleware,
    getBlogsHandler,
    getSingleBlogHandler,
    createBlogHandler,
    updateBlogHandler
};
