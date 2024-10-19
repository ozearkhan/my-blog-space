import {Hono} from 'hono';
export const user = new Hono();

user.post('/signup',(c)=>{
    return c.text('user/signup');
})

user.post('/signin',(c)=>{
    return c.text('user/signin');
})

