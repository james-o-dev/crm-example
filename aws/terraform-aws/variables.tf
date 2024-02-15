# Variables relating to AWS resource names.

variable "lambdaName" {
  type        = string
  description = "Name for the Lambda function."
  default     = "crm-example-api"
}

variable "sqsName" {
  type        = string
  description = "Name for the SQS queue as well as the dead-letter queue (as <name>DL)."
  default     = "crm-example-sqs"
}

variable "s3BucketName" {
  type        = string
  description = "Name for the S3 bucket; Note- only lowercase alphanumeric characters and hyphens allowed"
  default     = "crm-example-s3"
}