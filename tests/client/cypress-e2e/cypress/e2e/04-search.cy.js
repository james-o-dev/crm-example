/* eslint-disable cypress/no-force */
import { cleanUpTests, generateRandomEmail, generateRandomPassword, generateRandomString } from '../support/shared'

describe('Search', () => {

  beforeEach(() => {
    cy.visit('/')
  })

  after(async () => {
    await cleanUpTests()
  })

  it('Search contact and ta', () => {
    const email = generateRandomEmail()
    const password = generateRandomPassword()

    const contactName = generateRandomString()
    const contactEmail = generateRandomEmail()

    const taskTitle = generateRandomString()

    // Sign up.
    cy.signUp(email, password)

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
    cy.get('button').contains('Yes').click()

    // Back home.
    cy.visit('/')

    // Add a task.
    cy.get('button[aria-label="open new records menu"]').click()
    cy.get('button').contains('Add Task').click()

    // Task form.
    cy.get('input[name="title"]').type(taskTitle)
    // Create new task.
    cy.get('.fab-desktop button[aria-label="create new task"').click()
    // Dialog displayed.
    cy.get('h1').contains('Task added').should('exist')
    cy.get('div').contains('Would you like to go to the Tasks list?').should('exist')
    cy.get('button').contains('Yes').click()

    // Click the search in the toolbar.
    cy.get('mat-toolbar button[aria-label="go to search"]').click()

    // Search contact.
    cy.get('input[name="q"]').type(contactName)
    cy.get('td').contains('contact').should('exist')
    cy.get('button').contains(contactName).click()
    cy.url().should('include', '/contact-detail/')
    cy.get('h2').contains(contactName).should('exist')

    // Go back to search.
    cy.get('mat-toolbar button[aria-label="go to search"]').click()

    // Search task.
    cy.get('input[name="q"]').should('have.value', contactName) // Search input saved in session storage.
    cy.get('input[name="q"]').clear()
    cy.get('input[name="q"]').type(taskTitle)
    cy.get('td').contains('task').should('exist')
    cy.get('button').contains(taskTitle).click()
    cy.url().should('include', '/task-detail/')
    cy.get('h2').contains(taskTitle).should('exist')
  })
})