const { API_TEST_EMAIL } = require('./common')
const { getDb } = require('./db-postgres')

require('dotenv').config()

const teardown = async () => {
  const db = getDb()

  console.log('Deleting test users.')
  // Delete all test users.
  // Other tables with rows relating to the test users should also be deleted -
  // DELETE CASCADE must be enabled for the foreign keys in the database.
  await db.none('DELETE FROM users WHERE email ILIKE \'%$1#%\'', [API_TEST_EMAIL])
  console.log('Test users deleted.')
}

module.exports = teardown