terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.31.0"
    }
  }

  # Use your own S3 and DynamoDB to store the state remotely.
  # Edit these according to the values you used in the `aws-bootstrap` CloudFormation template.
  backend "s3" {
    bucket         = "jamesodev-terraform-bootstrap"
    key            = "crm-example/state.tfstate"
    dynamodb_table = "jamesodev-terraform-bootstrap"
    encrypt        = true
    # Edit according to your AWS region.
    region = "ap-southeast-2"
  }
}

provider "aws" {
  # Configuration options
}
