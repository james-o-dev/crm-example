import { getLocalStorageDb, saveLocalStorageDb } from './mock'

export const changeUsernameEndpoint = (email: string, username: string) => {
  const db = getLocalStorageDb()
  const users = db.users

  const index = users.findIndex(({ email: dbEmail }: { email: string }) => dbEmail === email)
  users[index].username = username

  const newDb = { ...db, users }
  saveLocalStorageDb(newDb)
}
