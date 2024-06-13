import { Hono } from '@hono/hono'
import { bearerAuth } from "@hono/hono/bearer-auth";
import { serveStatic } from "@hono/hono/deno";

import { createUser, findToken, getClasses, registerClass, putAllClasses } from './db.ts'
import { inyectEnv } from './envs.ts'

const app = new Hono()

await inyectEnv()
await createUser()

app.post('/login', async (c) => {
  const body = await c.req.json()
  if (!body['username'] || !body['password']) {
    return c.json({ errors: 'Please provide username and password' }, 400)
  }
  
  const token = await findToken(body['username'], body['password'])
  
  if (!token) {
    return c.json({ errors: 'Invalid username or password' }, 401)
  }else{
    return c.json({ token })
  }
})

app.use('/api/*', bearerAuth({ token: Deno.env.get('TOKEN') || '' }))

app.get('/api/classes/:date', async (c) => {
  const date = c.req.param('date')
  const classes = await getClasses(date)
  return c.json(classes)
})

app.post('/api/classes', async (c) => {
  const body = await c.req.json()
  
  if (!body['date'] || !body['place'] || !body['duration']) {
    return c.json({ errors: 'Please provide date, place, start and end' }, 400)
  }
  
  try{
    await registerClass(body['date'], body['place'], body['duration'])
    return c.json({ message: 'Class registered' })
  }catch(e){
    return c.json({ errors: `Error registering class: ${e}` }, 500)
  }
})

app.put('/api/classes/:date', async (c) => {
  const date = c.req.param('date')
  const body = await c.req.json()
  
  if (!body['classes']) {
    return c.json({ errors: 'Please provide classes' }, 400)
  }
  
  try{
    const allClasses = await putAllClasses(date, body['classes'])
    
    if (!allClasses) {
      return c.json({ errors: 'No classes found' }, 404)
    }else{
      return c.json({ message: 'Classes updated' })
    }
  }catch(e){
    return c.json({ errors: `Error updating classes: ${e}` }, 500)
  }
})

app.use('/*', serveStatic({ root: './templates/' }))

Deno.serve(app.fetch)