# ExpressJS Server | CRM Example

- [ExpressJS Server | CRM Example](#expressjs-server--crm-example)
  - [Description](#description)
  - [Pre-requisites](#pre-requisites)
  - [Getting Started](#getting-started)
  - [Development With Lambda](#development-with-lambda)

## Description

A NodeJS project that uses ExpressJS provides the REST API for the CRM Example, during local development.

## Pre-requisites

NodeJS installed on the local system.

A Postgres database already set up and available.

## Getting Started

* Duplicate the file `.env.template` and rename it `.env`. Set the environment variables according to the comments and variable names.
* Run `npm i`, if not already done so, to install dependencies. Recommended to use `npm ci` to install the exact dependencies, from the package-lock file.
* Use:
  * `npm run start` = Start the server.
  * `npm run dev` = Start the server with automatic reloading on file changes.
  * Additionally, you can launch debugging if using VSCode with the `Launch local CRM example server` launch configuration.

## Development With Lambda

In general, development is to first take place locally in this project - modifying the services and libs.

Once done, they are copied to the Lambda project. Any additional changes to the ExpressJS main index file is to be similarly be done manually to the Lambda index file.

For more detail, see the notes [here, under Development Notes](../../aws/lambda/README.md#development-notes).