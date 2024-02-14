/* eslint-disable cypress/no-force */
import { cleanUpTests, generateRandomEmail, generateRandomPassword, generateRandomString } from '../support/shared'

describe('Notifications', () => {

  beforeEach(() => {
    cy.visit('/')
  })

  after(async () => {
    await cleanUpTests()
  })

  it('Task notifications', () => {
    const email = generateRandomEmail()
    const password = generateRandomPassword()

    const taskTitle = generateRandomString()

    const today = new Date()
    const todayString = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`

    const tomorrow = new Date()
    tomorrow.setDate(today.getDate() + 1)
    const tomorrowString = `${tomorrow.getDate()}/${tomorrow.getMonth() + 1}/${tomorrow.getFullYear()}`

    // Sign up.
    cy.signUp(email, password)

    // Add a task.
    cy.get('button[aria-label="open new records menu"]').click()
    cy.get('button').contains('Add Task').click()

    // Task form.
    cy.get('input[name="title"]').type(taskTitle)
    cy.get('input[name="due_date"]').type(todayString)
    // Create new task.
    cy.get('.fab-desktop button[aria-label="create new task"').click()
    // Dialog displayed.
    cy.get('h1').contains('Task added').should('exist')
    cy.get('div').contains('Would you like to go to the Tasks list?').should('exist')
    cy.get('button').contains('Yes').click()

    // Check notifications badge.
    cy.get('mat-toolbar .mat-badge-content').contains('1').should('exist')
    // Go to notifications.
    cy.get('mat-toolbar button[aria-label="go to notifications"]').click()
    cy.url().should('include', '/notifications')
    // Check notification.
    cy.get('td').contains('is overdue').should('exist')
    cy.get('button').contains('Task overdue').click() // Go to task.

    // Edit task.
    // Change due date to tomorrow.
    cy.url().should('include', '/task-detail/')
    cy.get('h2').contains(taskTitle).should('exist')
    cy.get('.fab-desktop button[aria-label="edit task"]').click()
    cy.get('input[name="due_date"]').clear()
    cy.get('input[name="due_date"]').type(tomorrowString)
    cy.get('.fab-desktop button[aria-label="update task"]').click()

    // Check notifications badge.
    cy.get('mat-toolbar .mat-badge-content').contains('1').should('exist')
    // Go to notifications.
    cy.get('mat-toolbar button[aria-label="go to notifications"]').click()
    cy.url().should('include', '/notifications')
    // Check notification.
    cy.get('td').contains('is due soon').should('exist')
    cy.get('button').contains('Task due soon').click() // Go to task.

    // // Delete task.
    // cy.url().should('include', '/task-detail/')
    // cy.get('h2').contains(taskTitle).should('exist')
    // cy.get('button').contains('Delete Task').click()
    // cy.get('button').contains('Delete Confirmed').click()
    // // Dialog displayed.
    // cy.get('h1').contains('Task Deleted').should('exist')
    // cy.get('button').contains('Confirm').click()

    // Edit task.
    // Clear due date
    cy.url().should('include', '/task-detail/')
    cy.get('h2').contains(taskTitle).should('exist')
    cy.get('.fab-desktop button[aria-label="edit task"]').click()
    cy.get('input[name="due_date"]').clear()
    cy.get('.fab-desktop button[aria-label="update task"]').click()

    // Check notifications badge - should no longer exist.
    cy.get('mat-toolbar .mat-badge-content').contains('1').should('not.exist')
    // Go to notifications.
    cy.get('mat-toolbar button[aria-label="go to notifications"]').click()
    cy.url().should('include', '/notifications')
    // Check notification.
    cy.get('td').should('not.exist')
    cy.get('button').contains('Task due soon').should('not.exist')
  })
})