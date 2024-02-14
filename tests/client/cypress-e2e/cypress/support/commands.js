/* eslint-disable cypress/no-force */
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

require('cypress-delete-downloads-folder').addCustomCommand()

/**
 * Do sign up.
 * * Redirects to the sign-up page
 *
 * @param {string} email
 * @param {string} password
 */
const signUp = (email, password) => {
  cy.visit('/sign-up')
  cy.url().should('include', '/sign-up')

  cy.get('input[name="email"]').type(email)
  cy.get('input[name="password"]').type(password)
  cy.get('input[name="confirmPassword"]').type(password, { force: true })

  // Finally allow sign-up.
  cy.get('button[mat-raised-button]').contains('Sign Up').click()

  // Home page.
  cy.get('h1').contains('Home').should('exist')
}
Cypress.Commands.add('signUp', signUp)

/**
 * Do sign in.
 * * Redirects to the sign-in page
 *
 * @param {string} email
 * @param {string} password
 */
const signIn = (email, password) => {
  cy.visit('/sign-in')
  cy.url().should('include', '/sign-in')

  cy.get('input[name="email"]').type(email)
  cy.get('input[name="password"]').type(password)

  // Finally allow sign-up.
  cy.get('button[mat-raised-button]').contains('Sign In').click()

  // Home page.
  cy.get('h1').contains('Home').should('exist')
}
Cypress.Commands.add('signIn', signIn)