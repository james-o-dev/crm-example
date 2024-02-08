import { successfulResponse } from '../lib/common.js'
import { getDb } from '../lib/db/db-postgres.js'

const API_TEST_TOKEN = '+apitest'

/**
 * Delete all test data.
 * * Other tables with rows relating to the test users should also be deleted -
 * * DELETE CASCADE must be enabled for the foreign keys in the database.
 */
export const cleanupTestRecords = async () => {
  const db = getDb()

  await db.tx(t => Promise.allSettled([
    t.none('DELETE FROM users WHERE email ILIKE \'%$1#%\'', [API_TEST_TOKEN]),
    t.none('DELETE FROM contacts WHERE email ILIKE \'%$1#%\'', [API_TEST_TOKEN]),
    t.none('DELETE FROM tasks WHERE title ILIKE \'%$1#%\'', [API_TEST_TOKEN]),
  ]))

  return successfulResponse({ message: 'Test records removed from the database.' })
}