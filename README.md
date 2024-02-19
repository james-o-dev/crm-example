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
* Import / Export
  * JSON (basic)

### Other Capabilities

* Responsive-first designed web client.
* Client Progress Web App (PWA) support.
* Serverless API or hosted server API (locally with NodeJS).
* User authentication, security.

### Potential Future Ideas

Note: Unordered and subject to change.

* Re-create client with React Typescript
* Angular client
  * Different or multiple colour themes.
  * Light / dark mode.
* Security
  * TOTP MFA (e.g. Google Authenticator codes)
  * Forgot password
  * Google Sign On
  * Other federated sign on
* Import / export
  * CSV
  * Excel
  * Google Sheets
  * Update handling of uploading and downloading files
* Containerization
  * Docker
* Emailing

## Technologies

Note: Subject to change.

|Type|Technology|
|-|-|
|Front end client|Angular (v17+) |
|API|AWS Lambda serverless function/s (NodeJS) OR local NodeJS server|
|Database|PostgreSQL (v15+)|
|Infrastructure as Code (IaC)|Terraform AWS + AWS CloudFormation|

## Project Structure

|Directory|Description|
|-|-|
|[`/client`](./client)|Contains source code of the front-end web client/s.|
|[`/aws`](./aws)|Contains IaC templates, using Terraform + CloudFormation.|
|[`/server`](./server)|Contains API source code. Both local NodeJS as well as serverless AWS Lambda. |
|[`/database`](./database)|Contains database-related scripts and content.|
|[`/tests`](./tests)|Contains both API Jest tests and client E2E tests for this app.|

Please visit each of these folders and sub-folders for more detailed readmes relating to each area.

## Getting Started

`TODO`

## Designs and Notes

Note: Subject to change.

|Link / Name|Description|
|-|-|
|[Notes](https://www.figma.com/file/D4Q9uuKSWaGFLSgh7eXmPD/CRM-Example---notes?type=whiteboard&t=HcI9SPQJdtQv7Jz2-6)|Brainstorm and notes.|
|[Design](https://www.figma.com/file/6oPU72SRXNy7JrbokFhOH2/CRM-Example---Design?type=design&t=HcI9SPQJdtQv7Jz2-6)| Client wire-frames and mock-ups.|

## License

[Apache License 2.0](LICENSE)