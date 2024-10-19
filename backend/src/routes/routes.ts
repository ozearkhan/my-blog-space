import { Hono } from 'hono'
import { blog } from "../domains/blog/"
import { user } from '../domains/user'

export const server = new Hono().basePath('api/v1')

server.route('/blog',blog)
server.route('/users',user)
