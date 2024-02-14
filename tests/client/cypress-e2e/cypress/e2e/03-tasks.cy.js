/* eslint-disable cypress/no-force */
import { cleanUpTests, generateRandomEmail, generateRandomPassword, generateRandomString } from '../support/shared'

describe('Tasks', () => {

  beforeEach(() => {
    cy.visit('/')
  })

  after(async () => {
    await cleanUpTests()
  })

  it('Create, edit, delete a task', () => {
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

    // Go to tasks.
    cy.get('a').contains('Tasks').click()
    // Create task.
    cy.get('.fab-desktop button[aria-label="add task"]').click()
    cy.get('.fab-desktop button[aria-label="create new task"').should('be.disabled') // Title is required.
    cy.get('input[name="title"]').type(taskTitle)
    // Select the contact.
    cy.get('input[name="autoContact"]').type(contactName)
    cy.get('mat-option span').contains(contactName).click()
    // Select due date, from date picker.
    cy.get('mat-datepicker-toggle').click()
    cy.get('button span.mat-calendar-body-today').click()
    cy.get('body').type('{esc}') // Requires this in order to close the date picker.
    // Create new task.
    cy.get('.fab-desktop button[aria-label="create new task"').click()
    // Dialog displayed.
    cy.get('h1').contains('Task added').should('exist')
    cy.get('div').contains('Would you like to go to the Tasks list?').should('exist')
    cy.get('button').contains('Yes').click()

    // Redirected to tasks.
    cy.url().should('include', '/tasks')
    cy.get('a').contains(taskTitle).click()

    // Edit task.
    cy.url().should('include', '/task-detail/')
    cy.get('.fab-desktop button[aria-label="edit task"]').click()
    cy.get('input[name="title"]').clear()
    cy.get('input[name="title"]').type(taskTitle2)
    cy.get('.fab-desktop button[aria-label="update task"]').click()
    cy.get('h2').contains(taskTitle2).should('exist')

    // Go to tasks.
    cy.get('a').contains('Tasks').click()
    cy.get('a').contains(taskTitle).should('not.exist')
    cy.get('a').contains(taskTitle2).click()

    // Delete task.
    cy.get('button').contains('Delete Task').click()
    // Dialog displayed.
    cy.get('h1').contains('Confirm Delete Task').should('exist')
    cy.get('div').contains('delete').should('exist')
    cy.get('div').contains('irreversible').should('exist')
    cy.get('button').contains('Delete Confirmed').click()
    // Dialog displayed.
    cy.get('h1').contains('Task Deleted').should('exist')
    cy.get('button').contains('Confirm').click()

    // Redirected to tasks.
    cy.get('a').contains(taskTitle2).should('not.exist')
  })
})