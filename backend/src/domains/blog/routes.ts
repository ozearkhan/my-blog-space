import { Hono } from 'hono'
export const blog = new Hono()

blog.post('/', (c)=>{
    return c.text('/blog/post')
})

blog.put('/',(c)=>{
    return c.text('/blog/put')
})

// blog.get('/:id',(c) =>{
//     return c.text('blog/get/:id')
// })

blog.get('/bulk',(c)=>{
    return c.text('blog/bulk')
})
