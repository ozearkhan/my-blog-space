import {Hono} from 'hono';
import {signInHandler, storeUserHandler} from "./controller";
export const user = new Hono();

user.post('/signup',...storeUserHandler)

user.post('/signin',...signInHandler)

