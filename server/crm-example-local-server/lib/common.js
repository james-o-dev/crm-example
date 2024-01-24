
/**
 * Wrapper to handle shared endpoint controller functions.
 *
 * @param {*} req Express request object.
 * @param {*} res Express response object.
 * @param {function} serviceFn Async function for this controller's logic.
 */
export const controllerHandler = async (req, res, serviceFn) => {
  try {
    const result = await serviceFn
    const responseBody = { ...result }
    delete responseBody.statusCode
    return res.status(result.statusCode).json(responseBody)
  } catch (error) {
    if (error.validation) {
      const errorBody = { ...error }
      delete errorBody.validation
      delete errorBody.statusCode
      return res.status(error.statusCode).json(errorBody)
    } else {
      console.error(error)
      return res.status(500).json({ message: 'Server Error.' })
    }
  }
}

/**
 * Return a success response, that will respond with the payload.
 *
 * @param {object} payload Be sure to include a 'message; property.
 * @param {number} [statusCode=200] Override the HTTP status code if necessary
 */
export const successfulResponse = (payload, statusCode = 200) => {
  return { ...payload, statusCode }
}

/**
 * Return a validation response, that will respond with the payload.
 *
 * @param {object} payload Be sure to include a 'message; property.
 * @param {number} [statusCode=400] Override the HTTP status code if necessary
 */
export const validationErrorResponse = (payload, statusCode = 400) => {
  return { ...payload, validation: true, statusCode }
}

/**
 * Return a generic unauthorized validation response.
 */
export const unauthorizedError = () => validationErrorResponse({ message: 'Unauthorized.' }, 401)