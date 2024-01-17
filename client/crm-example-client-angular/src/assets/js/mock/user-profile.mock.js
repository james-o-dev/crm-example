import { getLocalStorageDb, saveToDb } from './mock.js'
import { verifyAccessToken } from './auth.mock.js'

export const changeUsernameEndpoint = async (accessToken, username) => {
  const { user_id } = await verifyAccessToken(accessToken) || {}

  saveToDb('users', user_id, { username })

  return { statusCode: 200, message: 'Username updated.' }
}

export const getUsernameEndpoint = async (accessToken) => {
  const { user_id } = await verifyAccessToken(accessToken) || {}
  if (!user_id) return { statusCode: 400, message: 'Invalid token.'  }

  const { users } = getLocalStorageDb()
  const { username } = users[user_id]

  return { statusCode: 200, message: 'Username retrieved.', username  }
}
