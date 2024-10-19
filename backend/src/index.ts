import { Hono } from 'hono'
import { server } from './routes/routes'
const app = new Hono()


app.route('/',server)

export default app
