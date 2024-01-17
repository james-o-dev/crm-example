const MOCK_DB_NAME = 'mockDb'

/**
 * Default empty mock DB.
 */
const MOCK_DB_NEW = JSON.stringify({
  users: {},
  contacts: {},
  tasks: {},
})

/**
 * Generate a random string.
 * * Currently: A random number between 0 and 1, converted to a string. Removes the dot.
 * * Ideally: Use a crypto-generated UUID in the 'real' database.
 */
const getRandomString = () => Math.random().toString().replace('.', '')

/**
 * Update an existing record in a table
 *
 * @param {string} table Name of the table
 * @param {string} key Primary key
 * @param {string} payload Object to save
 */
export const saveToDb = (table, key, payload) => {
  payload = {
    ...payload,
    date_modified: Date.now(),
  }
  const db = getLocalStorageDb()
  db[table][key] = { ...db[table][key], ...payload }
  saveLocalStorageDb(db)
}

/**
 * Create a new record in a table
 * * It will return a string which is the primary key of the new record.
 *
 * @param {string} table Name of the table
 * @param {string} payload Object to save
 */
export const newToDb = (table, payload) => {
  const key = getRandomString()
  const db = getLocalStorageDb()
  db[table][key] = {
    ...payload,
    key,
    date_created: Date.now(),
    date_modified: Date.now(),
  }
  saveLocalStorageDb(db)
  return key
}

/**
 * Remove an existing record in a table
 *
 * @param {string} table Name of the table
 * @param {string} key Primary key
 */
export const removeFromDb = (table, key) => {
  const db = getLocalStorageDb()
  delete db[table][key]
  saveLocalStorageDb(db)
  return key
}

/**
 * Get the mock DB.
 */
export const getLocalStorageDb = () => {
  return JSON.parse(localStorage.getItem(MOCK_DB_NAME) || MOCK_DB_NEW)
}

/**
 * Save / override the mock DB
 *
 * @param {object} newDb
 */
export const saveLocalStorageDb = (newDb) => {
  localStorage.setItem(MOCK_DB_NAME, JSON.stringify(newDb))
}

/**
 * Remove/reset the mock DB from localStorage.
 */
export const clearLocalStorageDb = () => {
  localStorage.removeItem(MOCK_DB_NAME)
}
