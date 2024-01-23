

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
      return res.status(500).json('Server Error.')
    }
  }
}

export const successfulResponse = (payload, statusCode = 200) => {
  return { ...payload, statusCode }
}

export const validationErrorResponse = (payload, statusCode = 400) => {
  return { ...payload, validation: true, statusCode }
}