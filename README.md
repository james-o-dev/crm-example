# CRM Example
- [CRM Example](#crm-example)
  - [Overview](#overview)
  - [Intended App Features](#intended-app-features)
    - [Main Features](#main-features)
    - [Other Capabilities](#other-capabilities)
  - [Intended Technologies](#intended-technologies)
  - [Project Structure](#project-structure)
  - [Getting Started](#getting-started)
  - [Designs and Notes](#designs-and-notes)
  - [License](#license)

## Overview

This is a personal project of an example full stack web application for a Customer Relation Management (CRM) system.

Note: This is app is **NOT intended for any commercial or production usage**. It is used for the purposes of learning and demonstration.

## Intended App Features

Note: Subject to change.

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
  * JSON
  * CSV

### Other Capabilities

* Responsive-first designed web client.
* Client Progress Web App (PWA) support.
* Serverless API
* User authentication, security

## Intended Technologies

Note: Subject to change.

|Type|Technology|
|-|-|
|Front end client|Angular AND/OR React |
|API|AWS Lambda serverless function/s|
|Database|PostgreSQL|
|Infrastructure as Code (IaC)|Terraform AWS + AWS CloudFormation|

## Project Structure

|Directory|Description|
|-|-|
|[`/client`](./client)|Contains source code of the front-end web clients.|
|[`/iac`](./iac)|Contains IaC templates, using Terraform + CloudFormation.|
|[`/api`](./api)|Contains API source code. Currently will use AWS Lambda.|
|[`/database`](./database)|Contains Lambda code|

## Getting Started

`TODO`

## Designs and Notes

Note: Subject to change.

|Link / Name|Description|
|-|-|
|[Notes](https://www.figma.com/file/D4Q9uuKSWaGFLSgh7eXmPD/CRM-Example---notes?type=whiteboard&t=HcI9SPQJdtQv7Jz2-6)|Brainstorm and notes.|
|[Design](https://www.figma.com/file/6oPU72SRXNy7JrbokFhOH2/CRM-Example---Design?type=design&t=HcI9SPQJdtQv7Jz2-6)| Client wire-frames and mock-ups.|

## License

`TODO`