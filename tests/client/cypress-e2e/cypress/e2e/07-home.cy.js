/* eslint-disable cypress/no-force */
import { cleanUpTests, generateRandomEmail, generateRandomPassword, generateRandomString } from '../support/shared'

describe('Home', () => {

  beforeEach(() => {
    cy.visit('/')
  })

  after(async () => {
    await cleanUpTests()
  })

  it('Check home / dashboard contents', () => {
    const email = generateRandomEmail()
    const password = generateRandomPassword()

    const contactName = generateRandomString()
    const contactEmail = generateRandomEmail()

    const taskTitle = generateRandomString()
    const taskTitle2 = generateRandomString()

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
    cy.get('button').contains('No').click()

    // Add another task - this time overdue.

    // Task form.
    cy.get('input[name="title"]').type(taskTitle2)
    const overdueDate = '01/01/1970'
    cy.get('input[name="due_date"]').type(overdueDate)
    // Create new task.
    cy.get('.fab-desktop button[aria-label="create new task"').click()
    // Dialog displayed.
    cy.get('h1').contains('Task added').should('exist')
    cy.get('div').contains('Would you like to go to the Tasks list?').should('exist')
    cy.get('button').contains('Yes').click()

    // Go back to home.
    cy.visit('/')

    // Check contacts number - expected 1
    cy.get('h2[aria-label="number of contacts"]').should('contain.text', '1')
    // Check tasks number - expected 2
    cy.get('h2[aria-label="number of tasks"]').should('contain.text', '2')
    // Check tasks overdue number - expected 1
    cy.get('h2[aria-label="number of overdue tasks"]').should('contain.text', '1')

    // Check that clicking each card goes to the relevant route.
    cy.get('h2[aria-label="number of contacts"]').click()
    cy.url().should('include', '/contacts')
    cy.visit('/')
    cy.get('h2[aria-label="number of tasks"]').click()
    cy.url().should('include', '/tasks')
    cy.visit('/')
    cy.get('h2[aria-label="number of overdue tasks"]').click()
    cy.url().should('include', '/tasks')
  })
})