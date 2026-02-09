import pkg from 'pg'
const { Pool } = pkg

// console.log({
//   host: process.env.DB_HOST,
//   port: Number(process.env.DB_PORT),
//   database: process.env.DB_NAME,
//   user: process.env.DB_USER,
//   password: process.env.TZ,
//   cwd: process.cwd()
// })

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
})

pool.query('SELECT 1')
  .then(() => console.log('PostgreSQL connected'))
  .catch(err => {
    console.error('PostgreSQL connection error', err)
    process.exit(1)
  })

export default pool
