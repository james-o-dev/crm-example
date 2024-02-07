import pgPromise from 'pg-promise'

const POSTGRES_HOST = process.env.POSTGRES_HOST
const POSTGRES_PORT = process.env.POSTGRES_PORT
const POSTGRES_DATABASE = process.env.POSTGRES_DATABASE
const POSTGRES_USERNAME = process.env.POSTGRES_USERNAME
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD

/**
 * Postgres singleton class - i.e. this instance of the class should be shared throughout the app.
 * * It will connect to the Postgres database on initial instantiation.
 * * Use helper `getDb()` function to get the database connection.
 */
class PostgresDatabase {
  constructor() {
    const pgp = pgPromise()

    this.connection = pgp({
      host: POSTGRES_HOST,
      port: POSTGRES_PORT,
      database: POSTGRES_DATABASE,
      user: POSTGRES_USERNAME,
      password: POSTGRES_PASSWORD,
    })
    console.log('Connected to a Postgres database:')
    console.log({
      POSTGRES_HOST,
      POSTGRES_PORT,
      POSTGRES_DATABASE,
      POSTGRES_USERNAME,
      POSTGRES_PASSWORD: '***',
    })
  }

  /**
   * Singleton instance getter.
   */
  static getInstance() {
    if (!PostgresDatabase.instance) {
      PostgresDatabase.instance = new PostgresDatabase()
    }
    return PostgresDatabase.instance
  }
}

/**
 * Get the database connection.
 * * Returns the connection from the shared singleton Postgres class
 *
 * @returns {pgPromise.IDatabase<{}, pg.IClient>}
 */
export const getDb = () => PostgresDatabase.getInstance().connection

/**
 * Determine if the thrown Postgres error was due to a unique constraint.
 *
 * @param {*} error Thrown error
 * @param {string} uniqueConstraintName Name of the unique constraint in the database
 */
export const isUniqueConstraintError = (error, uniqueConstraintName) => {
  return error && error.code === '23505' && error.constraint === uniqueConstraintName
}

/**
 * Determine if the thrown Postgres error was due to a foreign key constraint.
 *
 * @param {*} error Thrown error
 * @param {string} uniqueConstraintName Name of the foreign key constraint in the database
 */
export const isForeignKeyConstraintError = (error, uniqueConstraintName) => {
  return error && error.code === '23503' && error.constraint === uniqueConstraintName
}

/**
 * @deprecated Avoid using .batch() method. Instead, just use normal Promise.all() or Promise.allSettled()
 *
 * Determine if the thrown Postgres error was due to a unique constraint.
 * * This is used specifically when an error was caught from a batch error (e.g. using t.batch([...])).
 * * It will attempt to find at least one error with the constraint error.
 *
 * @param {*} error Thrown error
 * @param {string} uniqueConstraintName Name of the unique constraint in the database
 */
export const isUniqueConstraintBatchError = (error, uniqueConstraintName) => {
  if (!error) return false
  const  errors = error.getErrors()
  if (!errors) return false
  const findConstraintError = errors.find(e => e.code === '23505' && e.constraint === uniqueConstraintName)
  return !!findConstraintError
}