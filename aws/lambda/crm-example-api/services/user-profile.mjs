import { getUserId } from '../lib/auth.common.mjs'
import { successfulResponse, validationErrorResponse } from '../lib/common.mjs'
import { getDb, isUniqueConstraintError } from '../lib/db/db-postgres.mjs'

/**
 * Get the user's username.
 *
 * @param {*} reqHeaders
 */
export const getUsername = async (reqHeaders) => {
  const userId = await getUserId(reqHeaders)

  const db = getDb()
  const user = await db.oneOrNone('SELECT username FROM users WHERE user_id = $1', [userId])

  return successfulResponse({ username: user.username })
}

/**
 * Set the user's username.
 *
 * @param {*} reqHeaders
 * @param {*} reqBody
 */
export const setUsername = async (reqHeaders, reqBody) => {
  const userId = await getUserId(reqHeaders)

  const { username } = reqBody
  const normalUsername = (username || '').trim()

  const db = getDb()
  try {
    await db.oneOrNone('UPDATE users SET username = $2 WHERE user_id = $1 RETURNING user_id', [userId, normalUsername || null])
  } catch (error) {
    if (isUniqueConstraintError(error, 'users_unique_1')) throw validationErrorResponse({ message: 'Username already taken.' }, 409)
    throw error
  }

  return successfulResponse({ message: 'Username updated.' })
}