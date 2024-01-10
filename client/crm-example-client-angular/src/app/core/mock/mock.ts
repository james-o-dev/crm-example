const MOCK_DB_NAME = 'mockDb'

/**
 * Default empty mock DB.
 */
const MOCK_DB_NEW = JSON.stringify({
  users: {},
  contacts: {},
  tasks: {},
})

export const getRandomString = () => Math.random().toString()

export const saveToDb = (table: string, key: string, payload: object) => {
  const db = getLocalStorageDb()
  db[table][key] = { ...db[table][key], ...payload}
  saveLocalStorageDb(db)
}

export const newToDb = (table: string, payload: object) => {
  const key = getRandomString()
  const db = getLocalStorageDb()
  db[table][key] = { ...payload, key }
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
export const saveLocalStorageDb = (newDb: object) => {
  localStorage.setItem(MOCK_DB_NAME, JSON.stringify(newDb))
}

/**
 * Remove/reset the mock DB from localStorage.
 */
export const clearLocalStorageDb = () => {
  localStorage.removeItem(MOCK_DB_NAME)
}
