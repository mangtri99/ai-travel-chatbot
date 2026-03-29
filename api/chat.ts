import express from 'express'
import chatRouter from '../server/routes/chat'

const app = express()
app.use(express.json())
app.use('/api/chat', chatRouter)

export default app
