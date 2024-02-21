# AWS Lambda | CRM Example

- [AWS Lambda | CRM Example](#aws-lambda--crm-example)
  - [Description](#description)
  - [Development Notes](#development-notes)

## Description

AWS Lambda with function URLs are used to provide a serverless solution to the CRM Example project.

This folder contains the source code for AWS Lambda functions as well as the AWS Lambda layer dependencies.

To create or modify Lambda/s it is recommended to use [Terraform](./../terraform-aws/) in order to make the changes.

Folder|Description
-|-
[crm-example-api](./crm-example-api/)|The main source code for the API.
[crm-example-api-layer](./crm-example-api-layer/)|Dependencies for the [crm-example-api](./crm-example-api/) function.

In addition, package and eslint files exist above these folders, to provide linting and Intellisense for developers.

## Development Notes

This is the main source code for the API and most of the shared code and libs are copied from the [local ExpressJS source code](../../server/crm-example-local-server/).

The main differences are:
1. The `index.js` is different, for AWS Lambda NodeJS, rather than ExpressJS
2. Removed package files and dependencies. Instead, they are provided by the [Lambda layer](./crm-example-api-layer/).

Other than that, they should be identical.

If developing, the idea is to:
1. First develop locally with ExpressJS, modifying the services and libs.
2. Once developed and tested, copy the modified services and libs to this Lambda.
3. If there are changes that are done to the [ExpressJS main index file](../../server/crm-example-local-server/index.mjs), make similar compatible changes manually in the [Lambda index file](./crm-example-api/index.mjs).
4. If there are any dependency changes, change them in the layer [`package.json`](./crm-example-api-layer/nodejs/package.json) and run `npm install` to update the `node_modules` folder.
5. Use Terraform to apply the changes, with [`npm run apply`](../terraform-aws/package.json).