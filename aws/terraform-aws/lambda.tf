# Lambda zip.
data "archive_file" "lambdaZip" {
  type        = "zip"
  source_dir  = "../lambda/crm-example-api"
  output_path = "build/lambda.zip"
}

# Lambda layer zip.
data "archive_file" "lambdaLayerZip" {
  type        = "zip"
  source_dir  = "../lambda/crm-example-api-layer"
  output_path = "build/lambdaLayer.zip"
}

# Lambda layer version.
resource "aws_lambda_layer_version" "lambdaLayer" {
  filename         = data.archive_file.lambdaLayerZip.output_path
  source_code_hash = data.archive_file.lambdaLayerZip.output_base64sha256
  layer_name       = "${var.lambdaName}_layer"

  compatible_runtimes = ["nodejs20.x"]
}

# Lambda function.
resource "aws_lambda_function" "lambdaFunction" {
  filename         = data.archive_file.lambdaZip.output_path
  source_code_hash = data.archive_file.lambdaZip.output_base64sha256

  function_name = var.lambdaName
  handler       = "index.handler"
  layers        = [aws_lambda_layer_version.lambdaLayer.arn]
  description   = "CRM Example API serverless function"

  role = aws_iam_role.lambdaFunction.arn

  runtime                        = "nodejs20.x"
  architectures                  = ["arm64"]
  memory_size                    = 128
  reserved_concurrent_executions = -1 # A value of 0 disables lambda from being triggered and -1 removes any concurrency limitations. Defaults to Unreserved Concurrency Limits -1
  timeout                        = 15

  environment {
    variables = {
      ACCESS_TOKEN_EXPIRY  = var.lambdaEnv_ACCESS_TOKEN_EXPIRY
      ACCESS_TOKEN_SECRET  = var.lambdaEnv_ACCESS_TOKEN_SECRET
      POSTGRES_DATABASE    = var.lambdaEnv_POSTGRES_DATABASE
      POSTGRES_HOST        = var.lambdaEnv_POSTGRES_HOST
      POSTGRES_PASSWORD    = var.lambdaEnv_POSTGRES_PASSWORD
      POSTGRES_PORT        = var.lambdaEnv_POSTGRES_PORT
      POSTGRES_USERNAME    = var.lambdaEnv_POSTGRES_USERNAME
      REFRESH_TOKEN_EXPIRY = var.lambdaEnv_REFRESH_TOKEN_EXPIRY
      REFRESH_TOKEN_SECRET = var.lambdaEnv_REFRESH_TOKEN_SECRET
    }
  }
}

# Lambda function url.
resource "aws_lambda_function_url" "lambdaFunctionUrl" {
  function_name      = aws_lambda_function.lambdaFunction.function_name
  authorization_type = "NONE"
  cors {
    # allow_credentials = true
    allow_headers = ["*"]
    allow_methods = ["*"]
    allow_origins = ["*"]
    # expose_headers = ["Date"]
    max_age = 86400
  }
}
# Output the URL.
output "lambdaFunctionUrl" {
  description = "API Host URL of the Lambda Function."
  value       = aws_lambda_function_url.lambdaFunctionUrl.function_url
}

# IAM role for the Lambda.
resource "aws_iam_role" "lambdaFunction" {
  name = "${var.lambdaName}_role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Effect = "Allow",
        Principal = {
          Service = "lambda.amazonaws.com",
        },
      },
    ],
  })
}

# Below: SQS resources, if required.

# Attach the necessary policies to the Lambda execution role
# resource "aws_iam_role_policy" "lambdaExecPolicy" {
#   name = "${var.lambdaName}_role_policy"
#   role = aws_iam_role.lambdaFunction.id

#   policy = jsonencode({
#     Version = "2012-10-17",
#     Statement = [
#       {
#         Action = [
#           "sqs:ReceiveMessage",
#           "sqs:DeleteMessage",
#           "sqs:GetQueueAttributes",
#         ],
#         Effect   = "Allow",
#         Resource = aws_sqs_queue.mySQS.arn,
#       },
#     ],
#   })
# }

# resource "aws_lambda_event_source_mapping" "lambdaFunction" {
#   event_source_arn = aws_sqs_queue.mySQS.arn
#   function_name    = aws_lambda_function.lambdaFunction.arn
# }

# # Grant Lambda function permissions to receive messages from the SQS queue
# resource "aws_lambda_permission" "lambdaFunctionAllowSQS" {
#   statement_id  = "AllowExecutionFromSQS"
#   action        = "lambda:InvokeFunction"
#   function_name = aws_lambda_function.lambdaFunction.arn
#   principal     = "sqs.amazonaws.com"
#   source_arn    = aws_sqs_queue.mySQS.arn
# }

# output "lambda_function_url" {
#   description = "URL of the Lambda function"
#   value       = aws_lambda_function_url.lambdaFunction.function_url
# }
