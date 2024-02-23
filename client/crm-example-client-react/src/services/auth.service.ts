import { NavigateFunction } from 'react-router-dom'
import { ACCESS_TOKEN_STORAGE_NAME, REFRESH_TOKEN_STORAGE_NAME, clearJWTs, makeApiRequest } from '../lib/api'

interface ISignInResponse {
  message: string
  accessToken: string
  refreshToken: string
}

/**
 * Make a sign up request.
 *
 * @param {string} email
 * @param {string} password
 * @param {string} confirmPassword
 */
export const signUp = async (email: string, password: string, confirmPassword: string): Promise<ISignInResponse> => {
  const response = await makeApiRequest({
    endpoint: '/auth/sign-up',
    method: 'POST',
    body: { email, password, confirmPassword },
    includeCredentials: false,
  })

  const data = await response?.json() as ISignInResponse

  localStorage.setItem(ACCESS_TOKEN_STORAGE_NAME, data.accessToken)
  localStorage.setItem(REFRESH_TOKEN_STORAGE_NAME, data.refreshToken)

  return data
}

/**
 * Make a sign in request.
 *
 * @param {string} email
 * @param {string} password
 */
export const signIn = async (email: string, password: string): Promise<ISignInResponse> => {
  const response = await makeApiRequest({
    endpoint: '/auth/sign-in',
    method: 'POST',
    body: { email, password },
    includeCredentials: false,
  })

  const data = await response?.json() as ISignInResponse

  localStorage.setItem(ACCESS_TOKEN_STORAGE_NAME, data.accessToken)
  localStorage.setItem(REFRESH_TOKEN_STORAGE_NAME, data.refreshToken)

  return data
}

/**
 * Signs out the user locally by clearing their existing JWTs.
 * * Pass the router-dom navigation function to also redirect to the sign-in page.
 */
export const signOutLocally = (navigateFn?: NavigateFunction) => {
  clearJWTs()
  if (navigateFn) navigateFn('/sign-in')
}

/**
 * Fetch the API whether the user is authenticated.
 */
export const isAuthenticated = async () => {
  try {
    // Initial attempt to verify.
    const response = await makeApiRequest({ endpoint: '/auth/authenticate', method: 'GET', includeCredentials: true })
    // No errors, it is verified.
    if (response!.ok) return true
    // Had errors or not OK, not verified.
    return false
  } catch (error) {
    return false
  }
}