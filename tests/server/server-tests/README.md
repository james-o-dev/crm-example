# REST API Tests | CRM Example

- [REST API Tests | CRM Example](#rest-api-tests--crm-example)
  - [Description](#description)
  - [Pre-requisites](#pre-requisites)
  - [Getting Started](#getting-started)
  - [Test Records](#test-records)

## Description

Unit tests for the REST API of the CRM example. Uses http request to directly contact the API.

It uses [Jest](https://jestjs.io/) to run these tests.

## Pre-requisites

The CRM Example REST API must already be set up and running.
* Database set up and available
* REST API up and available

(Client not required).

Note that the tests can be executed both on a local stack (i.e. local ExpressJS + local Postgres) as well as on a remote stack (i.e. Lambda + remote Postgres). You must edit the `.env` file accordingly.


## Getting Started

* Duplicate the file `.env.template` and rename it `.env`. Set the environment variables according to the comments and variable names.
* Run `npm i`, if not already done so, to install dependencies. Recommended to use `npm ci` to install the exact dependencies, from the package-lock file.
* Run one of the following:
  * `npm run test` Run all test suites.
  * `npx jest <test.spec.js>` to test a specific test file, where `<test.spec.js>` is the name of the file

## Test Records

Test records will contain the string `+apitest`. i.e. Users that were created during testing will have `+apitest` in the email e.g. 'test+apitest12121212@test.com.

This test 'token' can be configured [here](./lib/common.js).

Note that if a legitimate/real user also uses this token (i.e. in their email address), all their records may be deleted once the tests are completed.

Test records will also contain long numbers in their values, such as name and contact titles.