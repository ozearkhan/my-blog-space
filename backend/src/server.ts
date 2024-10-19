import { Hono } from 'hono'
const server = new Hono()

server.get('/', (c) => c.text('Hello Cloudflare Workers!'))

export default server