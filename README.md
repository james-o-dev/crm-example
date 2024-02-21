# CRM Example
- [CRM Example](#crm-example)
  - [Overview](#overview)
  - [App Features](#app-features)
    - [Main Features](#main-features)
    - [Other Capabilities](#other-capabilities)
    - [Potential Future Ideas](#potential-future-ideas)
  - [Technologies](#technologies)
  - [Project Structure](#project-structure)
  - [Getting Started](#getting-started)
  - [Designs and Notes](#designs-and-notes)
  - [License](#license)

## Overview

This is a personal project of an example full stack web application for a Customer Relation Management (CRM) system.

Currently it is a basic app that can form a foundation, in order to be expanded with bespoke features in the future.

Note: This is app is **NOT intended for any commercial or production usage**. It is used for the purposes of learning and demonstration.

## App Features

### Main Features

* User Sign In + Sign Up.
* User profile management.
  * Optional username
  * Change password
* Contacts: Defines a customer.
  * Operations
    * Create
    * Update
    * List
    * Archive
* Tasks: Defines a task or action
  * Can be related to a specific customer or standalone
  * Operations
    * Create
    * Update
    * List
    * Delete
* Search functionality
* Notification list
  * Basic - excludes push notifications or SMS / emailing
* Import / Export
  * JSON (basic)

### Other Capabilities

* Responsive-first designed client.
* Client Progressive Web App (PWA) support.
* Serverless or hosted server (locally with ExpressJS) REST API.
* Access/refresh JWT authentication.

### Potential Future Ideas

Note: Unordered and subject to change.

* Re-create client with React Typescript
* Angular client
  * Different or multiple colour themes.
  * Light / dark mode.
* Security / authentication
  * TOTP MFA (e.g. Google Authenticator codes)
  * Forgot password
  * Google Sign On
  * Other federated sign on
* Import / export
  * CSV
  * Possibly Google Sheets
  * Possibly Excel
  * Update handling of uploading and downloading files
* Containerization, if relevant
  * Docker
* Emailing
  * For authentication/security purposes
  * Possibly for notifications

## Technologies

Note: Subject to change.

|Type|Technology|
|-|-|
|Front end client|Angular (v17+) |
|API|AWS Lambda serverless function/s (NodeJS) OR local ExpressJS server|
|Database|PostgreSQL (v15+)|
|Infrastructure as Code (IaC)|Terraform AWS + AWS CloudFormation + |

## Project Structure

|Directory|Description|
|-|-|
|[`/aws`](./aws)|AWS Lambda function and layer code for the serverless REST API. Terraform templates.|
|[`/client`](./client)|Front-end web client/s.|
|[`/database`](./database)|Database-related scripts and content.|
|[`/server`](./server)|Local ExpressJS REST API server.|
|[`/tests`](./tests)|REST API Jest tests and client E2E tests.|

Please visit each of these folders and sub-folders for more detailed information relating to each area.

## Getting Started

To first start locally, in general the flow is...
* Set up the [database](./database/), if not done so already.
* Run the [ExpressJS server](./server/crm-example-local-server/)
* Start the client ([Angular](./client/crm-example-client-angular/))

Then you are able to preview it locally.

Run [API](./tests/server/server-tests/) and [E2E](./tests/client/cypress-e2e/) tests locally.

Any ExpressJS changes are then copied over to the [Lambda function code](./aws/lambda/crm-example-api/), as well as changes to [dependencies](./aws/lambda/crm-example-api-layer/nodejs/package.json).

To deploy the app remotely, we use [Terraform to apply infrastructure changes](./aws/terraform-aws/) to AWS.



## Designs and Notes

Note: Subject to change.

|Link / Name|Description|
|-|-|
|[Notes](https://www.figma.com/file/D4Q9uuKSWaGFLSgh7eXmPD/CRM-Example---notes?type=whiteboard&t=HcI9SPQJdtQv7Jz2-6)|Brainstorm and notes.|
|[Design](https://www.figma.com/file/6oPU72SRXNy7JrbokFhOH2/CRM-Example---Design?type=design&t=HcI9SPQJdtQv7Jz2-6)| Client wire-frames and mock-ups.|

## License

[Apache License 2.0](LICENSE)