/* eslint-disable cypress/no-force */
import { cleanUpTests, generateRandomEmail, generateRandomPassword, generateRandomString } from '../support/shared'

describe('Import & Export', () => {
  const downloadsFolder = Cypress.config('downloadsFolder')

  beforeEach(() => {
    cy.visit('/')
  })

  after(async () => {
    await cleanUpTests()
  })

  it('Import and export contacts', () => {
    const email = generateRandomEmail() // Used for export.
    const email2 = generateRandomEmail() // Used for import.
    const password = generateRandomPassword()

    const contactName = generateRandomString()
    const contactEmail = generateRandomEmail()
    const contactEmail2 = generateRandomEmail()

    cy.intercept('/export/contacts/json').as('exportJson')

    // Sign up.
    cy.signUp(email, password)

    // Create a contact.
    // Add a contact.
    cy.get('button[aria-label="open new records menu"]').click()
    cy.get('button').contains('Add Contact').click()

    // Add new contact.
    cy.url().should('include', '/add-contact')
    cy.get('input[name="name"]').type(contactName)
    cy.get('input[name="email"]').type(contactEmail)
    cy.get('.fab-desktop button[aria-label="create contact"').click()
    // Dialog displayed.
    cy.get('h1').contains('New contact added').should('exist')
    cy.get('div').contains('Would you like to go to your existing contacts?').should('exist')
    cy.get('button').contains('No').click()

    // Go to export section.
    cy.get('a').contains('Import / Export').click()
    // Download.
    cy.get('button').contains('Export Contacts To JSON File').click()

    cy.wait('@exportJson')

    // Change the contact email - to avoid conflict.
    cy.get('a').contains('Contacts').click()
    cy.url().should('include', '/contacts')
    cy.get('a').contains(contactName).click()
    cy.get('.fab-desktop button[aria-label="edit contact"').click()
    cy.get('input[name="email"]').clear()
    cy.get('input[name="email"]').type(contactEmail2)
    cy.get('.fab-desktop button[aria-label="update contact"').click()

    // Get downloads - get the first download.
    cy.task('downloads', downloadsFolder).then(downloads => {
      const path = `${downloadsFolder}/${downloads[0]}`

      // Check the file contents
      cy.readFile(path).its('length').should('eq', 1)
      cy.readFile(path).its(0).its('name').should('eq', contactName)
      cy.readFile(path).its(0).its('email').should('eq', contactEmail)

      // Importing.

      // Sign out and sign up as a new user.
      cy.signUp(email2, password)

      // Go to import section.
      cy.get('a').contains('Import / Export').click()
      cy.log(path)
      // cy.get('button').contains('Import Contacts From JSON File').click() // This will not work, since the file input is hidden.
      cy.get('input[type=file]').selectFile(path, { force: true })

      // Dialog displayed.
      cy.get('div').contains('Contacts imported.').should('exist')
      cy.get('button').contains('Confirm').click()

      // Redirect back to contacts list.
      // Contact should be imported.
      cy.url().should('include', '/contacts')
      cy.get('a').contains(contactName).click()
      cy.url().should('include', '/contact-detail/')
      cy.get('h2').contains(contactName).should('exist')
    })
  })
})