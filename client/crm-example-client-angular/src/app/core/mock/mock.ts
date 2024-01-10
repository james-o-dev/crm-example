/**
 * Default empty mock DB.
 */
const newDbSchema = JSON.stringify({
  users: {},
  contacts: {},
  tasks: {},
})

/**
 * Get the mock DB.
 */
export const getLocalStorageDb = () => {
  return JSON.parse(localStorage.getItem('db') || newDbSchema)
}

/**
 * Save / override the mock DB
 *
 * @param {object} newDb
 */
export const saveLocalStorageDb = (newDb: object) => {
  localStorage.setItem('db', JSON.stringify(newDb))
}

/**
 * Remove/reset the mock DB from localStorage.
 */
export const clearLocalStorageDb = () => {
  localStorage.removeItem('db')
}
