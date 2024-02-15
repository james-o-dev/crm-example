# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudfront_distribution
# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket_policy

resource "aws_s3_bucket" "clientS3Bucket" {
  bucket        = var.clientS3BucketName
  force_destroy = true
}

output "clientS3Bucket" {
  value = aws_s3_bucket.clientS3Bucket.bucket
}

resource "aws_s3_bucket_acl" "clientS3BucketAcl" {
  bucket     = aws_s3_bucket.clientS3Bucket.id
  acl        = "private"
  depends_on = [aws_s3_bucket_ownership_controls.clientS3BucketOwnership]
}

resource "aws_s3_bucket_ownership_controls" "clientS3BucketOwnership" {
  bucket = aws_s3_bucket.clientS3Bucket.id
  rule {
    object_ownership = "ObjectWriter"
  }
}

# CloudFront Origin Access Identity (OAI)
resource "aws_cloudfront_origin_access_identity" "oai" {
  comment = "Allow CloudFront to access the S3 bucket"
}

data "aws_iam_policy_document" "allow_access_from_another_account" {
  statement {
    principals {
      type        = "AWS"
      identifiers = [aws_cloudfront_origin_access_identity.oai.iam_arn]
    }

    actions = [
      "s3:GetObject",
    ]

    resources = [
      aws_s3_bucket.clientS3Bucket.arn,
      "${aws_s3_bucket.clientS3Bucket.arn}/*"
    ]
  }
}

# Attach S3 bucket policy allowing CloudFront access
resource "aws_s3_bucket_policy" "bucket_policy" {
  bucket = aws_s3_bucket.clientS3Bucket.id
  policy = data.aws_iam_policy_document.allow_access_from_another_account.json
}

resource "aws_cloudfront_distribution" "clientCloudfront" {
  origin {
    domain_name = aws_s3_bucket.clientS3Bucket.bucket_regional_domain_name
    origin_id   = aws_s3_bucket.clientS3Bucket.id
    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.oai.cloudfront_access_identity_path
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  price_class         = "PriceClass_100"

  default_cache_behavior {
    # CacheOptimized
    cache_policy_id        = "658327ea-f89d-4fab-a63d-7e88639e58f6"
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = aws_s3_bucket.clientS3Bucket.id
    compress               = true
    viewer_protocol_policy = "redirect-to-https"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  custom_error_response {
    error_code            = 403
    response_code         = 200
    response_page_path    = "/"
    error_caching_min_ttl = 0
  }
  custom_error_response {
    error_code            = 404
    response_code         = 200
    response_page_path    = "/"
    error_caching_min_ttl = 0
  }
}

output "clientCloudfrontDomainName" {
  value = aws_cloudfront_distribution.clientCloudfront.domain_name
}

output "clientCloudfrontId" {
  value = aws_cloudfront_distribution.clientCloudfront.id
}
