const newDbSchema = JSON.stringify({
  users: [],
  contacts: [],
  tasks: [],
})

export const getLocalStorageDb = () => {
  return JSON.parse(localStorage.getItem('db') || newDbSchema)
}

export const saveLocalStorageDb = (newDb: object) => {
  localStorage.setItem('db', JSON.stringify(newDb))
}

export const clearLocalStorageDb = () => {
  localStorage.clear()
}
