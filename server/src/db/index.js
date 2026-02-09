import pkg from 'pg'
const { Pool } = pkg

const pool = new Pool({
connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false 
  }
})

pool.query('SELECT 1')
  .then(() => console.log('PostgreSQL connected'))
  .catch(err => {
    console.error('PostgreSQL connection error', err)
    process.exit(1)
  })

export default pool
