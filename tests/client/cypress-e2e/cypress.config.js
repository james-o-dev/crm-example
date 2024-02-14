const { defineConfig } = require('cypress')
const { removeDirectory } = require('cypress-delete-downloads-folder')
require('dotenv').config()
const fs = require('fs')

module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.DEV_CLIENT_HOST,
    // setupNodeEvents(on, config) {
    //   // implement node event listeners here
    // },
    env: {
      DEV_CLIENT_HOST: process.env.DEV_CLIENT_HOST,
      API_HOST: process.env.API_HOST,
    },
    // chromeWebSecurity: true,
    setupNodeEvents(on) {
      on('task', {
        removeDirectory,
        downloads: (path) => fs.readdirSync(path),
      })
    },
  },
})
