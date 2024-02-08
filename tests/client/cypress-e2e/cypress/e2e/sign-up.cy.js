/* eslint-disable cypress/no-force */
import { cleanUpTests, generateRandomEmail, generateRandomPassword, generateRandomString } from '../support/shared'


describe('Sign Up tests', () => {

  beforeEach(() => {
    cy.visit('/')
  })

  after(async () => {
    await cleanUpTests()
  })

  it('Sign Up a new user', () => {
    cy.get('button').contains('Or Sign Up').click()
    cy.get('button[disabled]').contains('Sign Up').should('exist')

    const email = generateRandomEmail()
    const wrongPassword = generateRandomString()
    const password = generateRandomPassword()

    // Email.

    // Incorrect email.
    cy.get('input[formcontrolname="email"]').type(wrongPassword)
    // Do not allow sign up.
    cy.get('button[mat-raised-button][disabled="true"]').contains('Sign Up').should('exist')
    cy.get('input[formcontrolname="email"]').clear()
    cy.get('input[formcontrolname="email"]').type(email)

    // Passwords

    // Wrong password and confirmPassword.
    cy.get('input[formcontrolname="password"]').type(wrongPassword)
    cy.get('input[formcontrolname="confirmPassword"]').type(wrongPassword, { force: true })
    // Do not allow sign up.
    cy.get('button[mat-raised-button][disabled="true"]').contains('Sign Up').should('exist')

    // Correct password and wrong confirmPassword.
    cy.get('input[formcontrolname="password"]').clear()
    cy.get('input[formcontrolname="password"]').type(password)
    // Do not allow sign up.
    cy.get('button[mat-raised-button][disabled="true"]').contains('Sign Up').should('exist')

    // Correct confirmPassword.
    cy.get('input[formcontrolname="confirmPassword"]').clear()
    cy.get('input[formcontrolname="confirmPassword"]').type(password, { force: true })

    // Finally allow sign-up.
    cy.get('button[mat-raised-button]').contains('Sign Up').click()

    // Home page.
    cy.get('h1').contains('Home').should('exist')
  })
})