import { Pool } from "pg"

var credentials = {
  user: process.env.AUDIOGUILD_POSTGRES_USER,
  host: process.env.AUDIOGUILD_DATABASE_URL,
  database: process.env.AUDIOGUILD_DATABASE_DB,
  password: process.env.AUDIOGUILD_POSTGRES_PW,
  port: parseInt(process.env.DB_PORT || "5432")
}

var pool = new Pool(credentials)

module.exports = {
  async query(queryString: string) {
    const start = Date.now()
    const res = await pool.query(queryString)
    const duration = Date.now() - start
    console.log('executed query', { queryString, duration, rows: res.rowCount })
    return res
  },
}
