# Terraform AWS | CRM Example

- [Terraform AWS | CRM Example](#terraform-aws--crm-example)
  - [Description](#description)
  - [AWS](#aws)
  - [Pre-requisites](#pre-requisites)
    - [AWS pre-setup](#aws-pre-setup)
  - [Getting started](#getting-started)
    - [!WARNING!](#warning)
  - [Teardown](#teardown)

## Description

This is a set of Terraform scripts that are used to set up the basic infrastructure for the CRM Example web app, deployed to AWS services.

The Terraform scripts use AWS to [remotely store the state](#aws-pre-setup), for potential safety and collaboration, rather than saving the state on your local system.

## AWS

The following are used:

Service|Description
-|-
[Lambda]()|Serverless API functions.
[S3]()|Holds static file assets of the client. Additionally contains Terraform IaC config.
[Cloudfront]()|Takes to assets from S3 and distributes them with a CDN using HTTPS and other features.
[Dynamo DB]()|Note- this is not directly used by the CRM Example web app. It is only used as part of the Terraform IaC config.

## Pre-requisites

AWS account and AWS set up knowledge

Basic AWS Pre-setup, see below.

Terraform already installed and set up.

### AWS pre-setup

The Terraform requires you to have set up some basic AWS services already. These are:

Resource|Description
-|-
S3|Requires the name.
Dynamo DB|A table with the primary key name of `LockID` that is a string/text value.

It is recommended that you have a separate Cloudformation template to create these. If not, you can create them manually.

## Getting started

Edit [main.tf](./main.tf) according to your existing AWS setup (see [above](#aws-pre-setup)) and preference.

Value|Description
-|-
`terraform.backend.s3.bucket`|Name of your S3 bucket.
`terraform.backend.s3.key`|Name of the file/object you want to save the Terraform state as.
`terraform.backend.s3.dynamodb_table`|Name of your Dynamo DB table.
`terraform.backend.s3.region`|Your AWS region.

Then edit [variables.tf](./variables.tf). These allow you to configure the name of the created resources as well as required set up - e.g. Lambda environment variables. Descriptions accompany each variable to help you determine what to set.

Once done, we are ready to apply the Terraform templates. Npm scripts are included for easier Terraform command access.
* `npm run init` If not done so to initialize Terraform for this project.
* `npm run validate` Validate that the Terraform scripts are valid, without applying.
* `npm run apply` Applies the scripts and makes the necessary changes to your AWS account. **Use this to initially create the infrastructure, or to make changes to the existing infrastructure**.

### !WARNING!

It is important that after the Terraform templates have been applied to **not delete or modify your pre-existing AWS resources** e.g. do not delete or change ACLs for these resources.

If you do so, you may not be able to teardown the created AWS resources easily and it must be done manually.

It is recommended to teardown this project (and other projects) first, before tearing down your pre-existing setup.


## Teardown

Use `npm run destroy` to tear down the existing infrastructure.

It is important to note that this is only possible if the Terraform state is saved and exists on your [pre-existing S3/DynamoDB setup](#aws-pre-setup).

If it was removed or modified, the teardown function [may not work correctly](#warning) and you will have to manually remove the existing infrastructure that could not be deleted.