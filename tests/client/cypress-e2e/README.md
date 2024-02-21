# E2E Tests | CRM Example

- [E2E Tests | CRM Example](#e2e-tests--crm-example)
  - [Description](#description)
  - [Pre-requisites](#pre-requisites)
  - [Getting Started](#getting-started)
  - [Test Records](#test-records)

## Description

End-to-end (E2E) tests for the client of the CRM example - to use the browser to act as if it is a user typing and clicking within the client.

It uses [Cypress](https://www.cypress.io/) to run these tests.

## Pre-requisites

The CRM Example must already be set up and running.
* Database set up and available
* REST API up and available
* Client available

Note that the tests are intended to be executed on a local stack (i.e. local ExpressJS + locally served Angular). Executing the test on a remote stack (i.e. Lambda + Cloudfront) may work (provided you edit the .env file, below) but so far has not been tested.

## Getting Started

* Duplicate the file `.env.template` and rename it `.env`. Set the environment variables according to the comments.
* Run `npm i`, if not already done so, to install dependencies. Recommended to use `npm ci` to install the exact dependencies, from the package-lock file.
* Run one of the following:
  * `npm run cypress:open` = Opens the Cypress window in order to run individual test s and preview the results visually.
  * `npm run cypress:run` = Run all the tests together in 'headless' mode - i.e. it tests in the background, without visual results.

## Test Records

Test records will contain the string `+apitest`. i.e. Users that were created during testing will have `+apitest` in the email e.g. 'test+apitest12121212@test.com.

This test 'token' can be configured [here](./cypress/support/shared.js).

Note that if a legitimate/real user also uses this token (i.e. in their email address), all their records may be deleted once the tests are completed.

Test records will also contain long numbers in their values, such as name and contact titles.