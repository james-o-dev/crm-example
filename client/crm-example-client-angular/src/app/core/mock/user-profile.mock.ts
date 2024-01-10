import { getLocalStorageDb, saveToDb } from './mock'
import { verifyAccessToken } from './auth.mock'

export const changeUsernameEndpoint = async (accessToken: string, username: string) => {
  const { user_id } = await verifyAccessToken(accessToken) || {}

  saveToDb('users', user_id as string, { username })

  return { statusCode: 200, message: 'Username updated.' }
}

export const getUsernameEndpoint = async (accessToken: string) => {
  const { user_id } = await verifyAccessToken(accessToken) || {}
  if (!user_id) return { statusCode: 400, message: 'Invalid token.'  }

  const { users } = getLocalStorageDb()
  const { username } = users[user_id as string]

  return { statusCode: 200, message: 'Username retrieved.', username  }
}
