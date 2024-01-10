import { getLocalStorageDb, saveLocalStorageDb } from './mock'

export const signUpEndpoint = async (email: string) => {
  const user_id = Math.random().toString() // Should be a UUID from the server/database.
  const db = getLocalStorageDb()

  // Find if user already exists.
  const normalEmail = email.toLowerCase().trim()
  const userFound = db.users.find(({ email: dbEmail }: { email: string }) => dbEmail.toLowerCase().trim() === normalEmail)
  if (userFound) return { status: 409, message: 'User already exists' }

  // Else 'save',
  db.users.push({user_id, email})
  saveLocalStorageDb(db)
  // 'Respond'.
  return { status: 201, message: 'User created', data: { user_id } }
}
