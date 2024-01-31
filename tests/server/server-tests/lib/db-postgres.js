const pgp = require('pg-promise')()

let postgresDatabase

function PostgresDatabase() {
  this.db = pgp({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DATABASE,
    user: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
  })
}

/**
 * Returns database connection to use.
 *
 * @returns {pgPromise.IDatabase<{}, pg.IClient>}
 */
const getDb = () => {
  if (!postgresDatabase) postgresDatabase = new PostgresDatabase()
  return postgresDatabase.db
}

module.exports = {
  getDb,
}