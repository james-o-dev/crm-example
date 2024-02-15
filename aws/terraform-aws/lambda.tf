
resource "aws_lambda_function" "myLambda" {
  filename         = data.archive_file.lambdaPlaceholder.output_path
  source_code_hash = data.archive_file.lambdaPlaceholder.output_base64sha256

  function_name = var.lambdaName
  handler       = "index.handler"

  role = aws_iam_role.myLambda.arn

  runtime                        = "nodejs20.x"
  architectures                  = ["arm64"]
  memory_size                    = 128
  reserved_concurrent_executions = 1
  timeout                        = 10

  environment {
    variables = {
      foo = "bar"
    }
  }
}

# https://advancedweb.hu/how-to-define-lambda-code-with-terraform/
data "archive_file" "lambdaPlaceholder" {
  type        = "zip"
  output_path = "/tmp/lambdaPlaceholder.zip"

  source {
    filename = "index.js"

    content = <<EOF
      exports.handler = async (event, context) => {
          console.log("Hello, AWS Lambda!");
          return {
              statusCode: 200,
              body: JSON.stringify('Hello from Lambda!'),
          };
      };
    EOF
  }
}

resource "aws_lambda_function_url" "myLambda" {
  function_name      = aws_lambda_function.myLambda.function_name
  authorization_type = "NONE"
  cors {
    allow_credentials = true
    allow_headers     = ["*"]
    allow_methods     = ["*"]
    allow_origins     = ["*"]
    # expose_headers = ["Date"]
    max_age = 86400
  }
}

resource "aws_iam_role" "myLambda" {
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

# Below: SQS resources.

# Attach the necessary policies to the Lambda execution role
# resource "aws_iam_role_policy" "lambdaExecPolicy" {
#   name = "${var.lambdaName}_role_policy"
#   role = aws_iam_role.myLambda.id

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

# resource "aws_lambda_event_source_mapping" "myLambda" {
#   event_source_arn = aws_sqs_queue.mySQS.arn
#   function_name    = aws_lambda_function.myLambda.arn
# }

# # Grant Lambda function permissions to receive messages from the SQS queue
# resource "aws_lambda_permission" "myLambdaAllowSQS" {
#   statement_id  = "AllowExecutionFromSQS"
#   action        = "lambda:InvokeFunction"
#   function_name = aws_lambda_function.myLambda.arn
#   principal     = "sqs.amazonaws.com"
#   source_arn    = aws_sqs_queue.mySQS.arn
# }

# output "lambda_function_url" {
#   description = "URL of the Lambda function"
#   value       = aws_lambda_function_url.myLambda.function_url
# }
