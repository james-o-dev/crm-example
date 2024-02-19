# Angular Client | CRM Example

- [Angular Client | CRM Example](#angular-client--crm-example)
  - [Description](#description)
  - [Main Technologies](#main-technologies)
  - [Getting Started](#getting-started)
    - [Pre-requisites](#pre-requisites)
    - [Steps](#steps)
  - [Deploying remotely](#deploying-remotely)
    - [Pre-requisites](#pre-requisites-1)
    - [Steps](#steps-1)

## Description

This is the client for the CRM Example app, built with the Angular.

## Main Technologies

Tech|Description
-|-
[Angular (v17+)](https://angular.dev/)|Javascript framework.
Typescript|Main scripting language used to build this Angular client, instead of Javascript.
[Angular Material](https://material.angular.io/)|Main component library used.
[DateFns](https://date-fns.org/)|Date formatting library.

## Getting Started

How to run the client locally, for development or local preview.

### Pre-requisites

In order for all the client functionality to work, the API must already set up.

This can be the local NodeJS server (recommended) or another hosted CRM Example API (e.g. serverless API already deployed to AWS Lambda).

Required:
* API host domain

### Steps

* Run `npm i`, if not already done so, to install dependencies. Recommended to use `npm ci` to install the exact dependencies, from the package-lock file.
* Edit [environment.development.ts](./src/environments/environment.development.ts) <sup>1</sup>
  * `apiUrl` = **API host domain**.
* Run `npm start` to serve the client.

<sup>1</sup> Do not commit these changes.

## Deploying remotely

How to deploy the client remotely, for production or testing preview.

This will transfer the compiled Angular files to an AWS S3 bucket, which is served via the AWS CloudFront distribution.

### Pre-requisites

Unix or bash command line (i.e. git bash)

AWS account.

AWS CLI installed and set up on your machine, including credentials.

AWS S3 and CloudFront already set up.

Required:
* S3 bucket name
* Cloudfront distribution ID
* API host domain

### Steps

* Run `npm i`, if not already done so, to install dependencies. Recommended to use `npm ci` to install the exact dependencies, from the package-lock file.
* Edit [environment.ts](./src/environments/environment.ts) <sup>1</sup>
  * `apiUrl` = **API host domain**.
* Edit the [deploy-s3-cloudfront.sh](./deploy-s3-cloudfront.sh) shell script <sup>1</sup>
  * `S3_BUCKET_NAME` = **S3 bucket name**
  * `CLOUDFRONT_DISTRIBUTION_ID` = **Cloudfront distribution ID**
* Run `npm run build:deploy` to build and deploy the client.

<sup>1</sup> Do not commit these changes.

This runs a shell script that will build the Angular client, transfer the compiled files to an S3 bucket and then create an invalidation to the Cloudfront distribution.
