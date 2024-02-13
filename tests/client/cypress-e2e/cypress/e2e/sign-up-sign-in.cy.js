/* eslint-disable cypress/no-force */
import { cleanUpTests, generateRandomEmail, generateRandomPassword, generateRandomString } from '../support/shared'


describe('Sign Up / Sign In tests', () => {

  beforeEach(() => {
    cy.visit('/')
  })

  after(async () => {
    await cleanUpTests()
  })

  it('Sign Up a new user and sign in existing user', () => {
    cy.get('button').contains('Or Sign Up').click()
    cy.url().should('include', '/sign-up')

    const email = generateRandomEmail()
    const wrongPassword = generateRandomString()
    const password = generateRandomPassword()

    // Email.

    // Incorrect email.
    cy.get('input[name="email"]').type(wrongPassword)
    // Do not allow sign up.
    cy.get('button[mat-raised-button][disabled="true"]').contains('Sign Up').should('exist')
    cy.get('input[name="email"]').clear()
    cy.get('input[name="email"]').type(email)

    // Passwords.

    // Check password hint can be displayed.
    cy.get('button[aria-label="password help"]').click()
    cy.get('h1').contains('Password').should('exist')
    cy.get('div').contains('Password must contain at least').should('exist')
    cy.get('button').contains('OK').click()

    // Wrong password and confirmPassword.
    cy.get('input[name="password"]').type(wrongPassword)
    cy.get('input[name="confirmPassword"]').type(wrongPassword, { force: true })
    // Do not allow sign up.
    cy.get('button[mat-raised-button][disabled="true"]').contains('Sign Up').should('exist')

    // Correct password and wrong confirmPassword.
    cy.get('input[name="password"]').clear()
    cy.get('input[name="password"]').type(password)
    // Do not allow sign up.
    cy.get('button[mat-raised-button][disabled="true"]').contains('Sign Up').should('exist')

    // Correct confirmPassword.
    cy.get('input[name="confirmPassword"]').clear()
    cy.get('input[name="confirmPassword"]').type(password, { force: true })

    // Finally allow sign-up.
    cy.get('button[mat-raised-button]').contains('Sign Up').click()

    // Home page.
    cy.get('h1').contains('Home').should('exist')

    // Sign out.
    cy.get('a').contains('Sign Out').click()

    // Attempt sign in again.
    cy.url().should('include', '/sign-in')

    // Incorrect email.
    cy.get('input[name="email"]').type(wrongPassword)
    // Do not allow sign up.
    cy.get('button[mat-raised-button][disabled="true"]').contains('Sign In').should('exist')
    // Enter correct email.
    cy.get('input[name="email"]').clear()
    cy.get('input[name="email"]').type(email)
    // Do not allow sign up (password not entered).
    cy.get('button[mat-raised-button][disabled="true"]').contains('Sign In').should('exist')

    // Enter wrong password and submit.
    cy.get('input[name="password"]').type(email)
    cy.get('button[mat-raised-button]').contains('Sign In').click()

    // Should display dialog of invalid sign-in.
    cy.get('h1').contains('Error').should('exist')
    cy.get('div').contains('Invalid sign-in').should('exist')
    cy.get('button').contains('Dismiss').click()

    // Enter correct password and sign in successfully.
    cy.get('input[name="password"]').clear()
    cy.get('input[name="password"]').type(password)
    cy.get('button[mat-raised-button]').contains('Sign In').click()
    cy.get('h1').contains('Home').should('exist')
  })
})