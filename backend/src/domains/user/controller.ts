import { createFactory } from 'hono/factory';
import {generateSalt, hashPassword} from "../../utils/wepCryptoApi";
import {getPrisma} from "../../config/db";
import { sign } from 'hono/jwt'
import { signupinput, signininput } from "@ozear1224/my-blog-space-common"

const factory = createFactory()

type Bindings = {
    DATABASE_URL: string
    JWT_SECRET: string
}



const hashPasswordMiddleware = factory.createMiddleware(async(c,next)=>{
    try{
        const body = await c.req.json();
        const salt = await generateSalt();
        const hashedPassword = await hashPassword(body.password, salt);

        // Converting the salt and hash to strings for storage
        const saltString = new Uint8Array(salt).toString();
        const hashedPasswordString = new Uint8Array(hashedPassword).toString();

        body.password = hashedPasswordString;
        c.set('salt',saltString);
        c.set('body',body);
        await next();

    }catch(err){
        return c.json({ error : "error in hashPasswordMiddleware route signin " });
    }
})

const storeUserHandler = factory.createHandlers(hashPasswordMiddleware,async(c)=>{



    const body = await c.get('body')
    const {success } = signupinput.safeParse(body)
    if(!success){
        c.status(411)
        return c.json({
            Message: "Input validation failed"
        })
    }
    const prisma = getPrisma(c.env.DATABASE_URL)

    try {
        const user = await prisma.user.create({
            data: {
                email: body.email,
                password: body.password,
                salt: c.get('salt')
            }
        });

        const token = await sign({ id : user.id }, c.env.JWT_SECRET)
        return c.json({ token: `Bearer ${token}`})
    } catch(e) {
        c.status(403)
        c.json({ error : "Error while signup in user/signup route"})
    }
});


const findUserMiddleware = factory.createMiddleware(async (c, next) => {
    try {
        const body = await c.req.json();
        const {success} = signininput.safeParse(body)
        if(!success){
            c.status(411)
            return c.json({
                message: "Input validation failed"
            })
        }
        const prisma = getPrisma(c.env.DATABASE_URL);

        const user = await prisma.user.findUnique({
            where: {
                email: body.email,
            },
        });

        if (!user) {
            c.status(404)
            return c.json({ error: 'User not found' });
        }

        const enteredPassword = body.password; // Password entered by the user
        const salt = new Uint8Array(user.salt.split(',').map(Number)); // Convert salt back to Uint8Array
        const hashedEnteredPassword = await hashPassword(enteredPassword, salt);
        const hashedEnteredPasswordString = new Uint8Array(hashedEnteredPassword).toString();

        if (hashedEnteredPasswordString !== user.password) {
            c.status(401)
            return c.json({ error: 'Invalid credentials' });
        }

        c.set('user', user);
        await next();
    } catch (err) {
        c.status(500)
        return c.json({ error: 'Internal server error' });
    }
});

const signInHandler = factory.createHandlers(findUserMiddleware,async (c)=>{
    const user = c.get('user')
    // Passwords match, generate a token
    const token = await sign({ id: user.id }, c.env.JWT_SECRET);
    return c.json({ token: `Bearer ${token}` });
})



export {storeUserHandler, signInHandler}