import dotenv from 'dotenv'
dotenv.config({ path: './.env' }) 

import express from 'express'
import cors from 'cors'
import authRoutes from './src/routes/auth.js'
import verifyRouter from './src/routes/auth.js'
import usersRoutes from './src/routes/users.js'
import auth from './src/middleware/auth.js' 

const app = express()
app.use(cors({origin: 'https://my-app-se2k.onrender.com'}))
app.use(express.json())
app.use('/auth', authRoutes)
app.use('/auth/verify', verifyRouter)
app.use(auth)
app.use('/users', usersRoutes)
app.listen(3000, () => {
  console.log(`server is running`)
})

export default app