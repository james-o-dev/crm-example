import { extractAuthHeaderToken, verifyAccessToken, verifyRefreshToken } from '../lib/auth.common.mjs'
import { unauthorizedError } from '../lib/common.mjs'

/**
 * Verify JWT
 * * Continue and append the decoded JWT to the request if it can be verified.
 * * Respond with 401 if it cannot be verified.
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @param {boolean} [checkRefreshToken=false] True to check the refresh JWT. Falsy to check the access token
 */
const authToken = async (req, res, next, checkRefreshToken = false) => {
  // Get headers.
  const token = extractAuthHeaderToken(req.headers)

  try {
    if (!token) throw unauthorizedError()

    let verified
    if (checkRefreshToken) verified = await verifyRefreshToken(token)
    else verified = await verifyAccessToken(token)

    if (verified) {
      // Append the verified decoded JWT to the request.
      req.user = verified
      next()
    } else {
      throw unauthorizedError()
    }

  } catch (error) {
    const { statusCode, message } = unauthorizedError()
    res.status(statusCode).json({ message })
  }
}

/**
 * Add this middleware to a route if it requires a valid ACCESS JWT.
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const authAccessToken = (req, res, next) => authToken(req, res, next)

/**
 * Add this middleware to a route if it requires a valid REFRESH JWT.
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const authRefreshToken = (req, res, next) => authToken(req, res, next, true)
