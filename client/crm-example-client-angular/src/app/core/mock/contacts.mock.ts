import { verifyAccessToken } from './auth.mock'
import { newToDb } from './mock'

export const newContactEndpoint = async (accessToken: string, payload: object) => {
  const verifiedToken = await verifyAccessToken(accessToken)
  if (!verifiedToken || !verifiedToken['user_id']) return { statusCode: 400, ok: false, message: 'Unauthorized.' }

  const contactId = newToDb('contacts', {
    ...payload,
    user_id: verifiedToken['user_id'],
  })

  return { statusCode: 200, ok: true, message: 'Contact created.', contactId  }
}
