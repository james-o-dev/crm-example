// Process env in Vite https://vitejs.dev/guide/env-and-mode
const API_HOST = import.meta.env.VITE_API_HOST
if (!API_HOST) throw new Error('API_HOST is not defined')

export const ACCESS_TOKEN_STORAGE_NAME = 'accessToken'
export const REFRESH_TOKEN_STORAGE_NAME = 'refreshToken'

/**
 * What is returned in the body of a failed API request.
 */
export interface IBadResponse {
  message: string
}

/**
 * Helper: Refresh the access token.
 */
export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_STORAGE_NAME)

  if (!refreshToken) return ''

  try {
    // Note: Do not use the `makeApiRequest()` helper function here, or you will be stuck in an infinite loop!.
    const response = await fetch(`${API_HOST}/auth/refresh`, {
      headers: getAuthHeader(refreshToken),
    })

    // It could not refresh the access token.
    if (!response.ok) return ''

    // Successfully returned an access token.
    const refreshTokenResponse = await response.json()

    // Set the new access token to be returned.
    const accessToken = refreshTokenResponse.accessToken as string

    // Set the new access token in storage.
    localStorage.setItem(ACCESS_TOKEN_STORAGE_NAME, accessToken)

    // Return the access token
    return accessToken

  } catch (error) {
    // It could not refresh the access token.
    return ''
  }
}

/**
 * Helper: Add the authentication token to the request headers.
 *
 * @param {string} [jwt] - The JWT to use. By default, use the existing access token JWT value.
 */
const getAuthHeader = (jwt = localStorage.getItem(ACCESS_TOKEN_STORAGE_NAME)) => {
  return {
    Authorization: `Bearer ${jwt}`,
  }
}

/**
 * Makes a request to the API endpoint.
 *
 * @param {object} param0
 * @param {string} param0.endpoint - The API endpoint to make the request to.
 * @param {string} param0.method - The HTTP method to use.
 * @param {object} [param0.body] - The request body.
 * @param {HeadersInit} [param0.headers] - The request headers.
 * @param {boolean} [param0.includeCredentials] - Whether to include the authentication token in the request headers.
 * @returns {Promise<Response | null>} - The response from the API endpoint.
 */
export const makeApiRequest = async (
  { endpoint, method, body, headers, includeCredentials }:
    { endpoint: string; method: string; body?: object; headers?: HeadersInit; includeCredentials?: boolean },
): Promise<Response | null> => {

  const request$ = async () => {
    let authHeader = {}
    if (includeCredentials) {
      authHeader = getAuthHeader()
    }
    const response = await fetch(API_HOST + endpoint, {
      method,
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
        ...headers,
      },
    })

    if (!response.ok) throw response

    return response
  }

  // Make request.
  try {
    const response = await request$()
    return response
  } catch (error) {

    if (error instanceof Response && includeCredentials) {
      // If error status is not 401, rethrow the error.
      if (error.status !== 401) throw error

      // Else if it is a 401, then...

      // Clear access JWT and use refresh JWT.
      localStorage.removeItem(ACCESS_TOKEN_STORAGE_NAME)

      // Refresh the token.
      const refreshed = await refreshAccessToken()
      // Could not be refreshed.
      if (!refreshed) throw error

      // Retry request, new access token should be set now.
      const retriedResponse = await request$()
      return retriedResponse
    }

    throw error
  }
}

/**
 * Effectively signs out the user locally by removing their JWTs in localStorage.
 */
export const clearJWTs = () => {
  localStorage.removeItem(ACCESS_TOKEN_STORAGE_NAME)
  localStorage.removeItem(REFRESH_TOKEN_STORAGE_NAME)
}