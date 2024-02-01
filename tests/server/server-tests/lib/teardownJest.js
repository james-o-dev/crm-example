const { API_TEST_TOKEN } = require('./common')
const { getDb } = require('./db-postgres')

require('dotenv').config()

const teardown = async () => {
  const db = getDb()

  console.log('Deleting test data.')
  // Delete all test data.
  // Other tables with rows relating to the test users should also be deleted -
  // DELETE CASCADE must be enabled for the foreign keys in the database.
  await db.tx(t => t.batch([
    t.none('DELETE FROM users WHERE email ILIKE \'%$1#%\'', [API_TEST_TOKEN]),
    t.none('DELETE FROM contacts WHERE email ILIKE \'%$1#%\'', [API_TEST_TOKEN]),
  ]))
  console.log('Test data deleted.')
}

module.exports = teardown