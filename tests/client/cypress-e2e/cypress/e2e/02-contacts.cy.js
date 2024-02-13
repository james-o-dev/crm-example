/* eslint-disable cypress/no-force */
import { cleanUpTests, generateRandomEmail, generateRandomPassword, generateRandomString } from '../support/shared'

describe('Contacts', () => {

  beforeEach(() => {
    cy.visit('/')
  })

  after(async () => {
    await cleanUpTests()
  })

  it('Create, edit, archive contacts', () => {
    const email = generateRandomEmail()
    const password = generateRandomPassword()

    const contactName = generateRandomString()
    const contactName2 = generateRandomString()
    const contactEmail = generateRandomEmail()

    // Sign up.
    cy.signUp(email, password)

    // Contacts.
    cy.get('a').contains('Contacts').click()
    cy.url().should('include', '/contacts')

    // Add new contact.
    cy.get('button[aria-label="add contact"').click()
    cy.url().should('include', '/add-contact')
    cy.get('input[name="name"]').type(contactName)
    cy.get('input[name="email"]').type(contactEmail)
    cy.get('.fab-desktop button[aria-label="create contact"').click()
    // Dialog displayed.
    cy.get('h1').contains('New contact added').should('exist')
    cy.get('div').contains('Would you like to go to your existing contacts?').should('exist')
    cy.get('button').contains('Yes').click()

    // Redirect back to contacts list.
    cy.url().should('include', '/contacts')
    cy.get('a').contains(contactName).click()

    // Edit contact.
    cy.url().should('include', '/contact-detail/')
    cy.get('.fab-desktop button[aria-label="edit contact"').click()
    cy.get('input[name="name"]').clear()
    cy.get('input[name="name"]').type(contactName2)
    cy.get('.fab-desktop button[aria-label="update contact"').click()

    // Has updated.
    cy.get('h2').contains(contactName).should('not.exist')
    cy.get('h2').contains(contactName2).should('exist')

    // Go back to list.
    cy.get('a').contains('Contacts').click()
    cy.url().should('include', '/contacts')
    cy.get('a').contains(contactName).should('not.exist')
    cy.get('a').contains(contactName2).click()

    // Archive.
    cy.get('button').contains('Archive Contact').click()
    cy.url().should('include', '/contacts')
    cy.get('[aria-label="display archived"]').click()
    cy.get('a').contains(contactName2).click()

    // Restore.
    cy.get('button').contains('Restore Contact').click()
    cy.url().should('include', '/contacts')
    // cy.get('[aria-label="display active"]').click() // It displays active by default.
    cy.get('a').contains(contactName2).should('exist')
  })
})