
/**
 * Sign up a user request.
 *
 * @param {object} param
 * @param {string} param.email
 * @param {string} param.password
 * @param {string} param.confirmPassword
 */
const signUpRequest = async ({ email, password, confirmPassword }) => {
  return fetch(`${process.env.API_HOST}/auth/sign-up`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password, confirmPassword }),
  })
}

module.exports = {
  signUpRequest,
}