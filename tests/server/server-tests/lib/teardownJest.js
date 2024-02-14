require('dotenv').config()

const teardown = async () => {

  console.log('Deleting test data.')

  await fetch(`${process.env.API_HOST}/test/cleanup`)

  console.log('Test data deleted.')
}

module.exports = teardown