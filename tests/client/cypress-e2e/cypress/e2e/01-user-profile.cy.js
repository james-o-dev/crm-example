/* eslint-disable cypress/no-force */
import { cleanUpTests, generateRandomEmail, generateRandomPassword, generateRandomString } from '../support/shared'

describe('User Profile', () => {

  beforeEach(() => {
    cy.visit('/')
  })

  after(async () => {
    await cleanUpTests()
  })

  it('Change username, password and test sign out everywhere', () => {
    // Sign up.
    const email = generateRandomEmail()
    const password = generateRandomPassword()
    const username = generateRandomString()
    const newPassword = generateRandomPassword()
    cy.signUp(email, password)

    // User profile.
    cy.get('a').contains('Profile').click()
    cy.url().should('include', '/user-profile')

    // Change username.
    cy.get('button[aria-label="change username"]').click()
    cy.get('input[name="username"]').type(username)
    cy.get('button[type="submit"]').contains('Confirm').click()

    cy.get('div').contains(`Username: ${username}`).should('exist')

    // Change password.

    cy.get('input[name="oldPassword"]').type(password)
    cy.get('input[name="newPassword"]').type(newPassword)
    cy.get('input[name="confirmPassword"]').type(newPassword)
    cy.get('button[type="submit"]').contains('Change Password').click()
    // Dialog displayed.
    cy.get('h1').contains('Password changed successfully').should('exist')
    cy.get('div').contains('You will be signed out').should('exist')
    cy.get('button').contains('OK').click()

    // Sign again, using new password.
    cy.signIn(email, newPassword)

    // User profile.
    cy.get('a').contains('Profile').click()
    cy.url().should('include', '/user-profile')

    // Sign out everywhere.
    cy.get('button').contains('Sign Out Of All Devices').click()
    // Dialog displayed.
    cy.get('h1').contains('Sign Out Everywhere').should('exist')
    cy.get('div').contains('This will sign you out of all existing devices').should('exist')
    cy.get('button[aria-label="Sign Out dialog action"]').click()
    // Dialog displayed.
    cy.get('h1').contains('Sign Out Successful').should('exist')
    cy.get('div').contains('You will be signed out.').should('exist')
    cy.get('button[aria-label="OK dialog action"]').click()

    // Attempt to visit home page, redirects to sign-in
    cy.visit('/')
    cy.get('button').contains('Sign In').should('exist')
  })
})