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

# Below: Environment variables for the lambda.

variable "lambdaEnv_ACCESS_TOKEN_EXPIRY" {
  type        = string
  description = "Expiry time of the access token. e.g. 10m, 2h, 3d etc"
  default     = "ACCESS_TOKEN_EXPIRY" # Replace me.
}
variable "lambdaEnv_ACCESS_TOKEN_SECRET" {
  type        = string
  description = "Used for signing the access token."
  default     = "ACCESS_TOKEN_SECRET" # Replace me.
}
variable "lambdaEnv_POSTGRES_DATABASE" {
  type        = string
  description = "Postgres database name"
  default     = "POSTGRES_DATABASE" # Replace me.
}
variable "lambdaEnv_POSTGRES_HOST" {
  type        = string
  description = "Postgres database host"
  default     = "POSTGRES_HOST" # Replace me.
}
variable "lambdaEnv_POSTGRES_PASSWORD" {
  type        = string
  description = "Postgres database access password"
  default     = "POSTGRES_PASSWORD" # Replace me.
}
variable "lambdaEnv_POSTGRES_PORT" {
  type        = string
  description = "Postgres database port"
  default     = "POSTGRES_PORT" # Replace me.
}
variable "lambdaEnv_POSTGRES_USERNAME" {
  type        = string
  description = "Postgres database access username."
  default     = "POSTGRES_USERNAME" # Replace me.
}
variable "lambdaEnv_REFRESH_TOKEN_EXPIRY" {
  type        = string
  description = "Expiry time of the refresh token. e.g. 10m, 2h, 3d etc"
  default     = "REFRESH_TOKEN_EXPIRY" # Replace me.
}
variable "lambdaEnv_REFRESH_TOKEN_SECRET" {
  type        = string
  description = "Used for signing the refresh token."
  default     = "REFRESH_TOKEN_SECRET" # Replace me.
}
