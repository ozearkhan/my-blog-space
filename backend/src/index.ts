import { Hono } from 'hono'
import { server } from './routes/routes'
const app = new Hono()
import { cors } from 'hono/cors'

app.use('/',cors())
app.route('/',server)

export default app
