#!/bin/bash

# Set your AWS S3 bucket name
S3_BUCKET_NAME="crm-example-s3"

CLOUDFRONT_DISTRIBUTION_ID="REPLACE_ME"

# Set the local directory path containing the files to sync
LOCAL_DIR_PATH="./dist/crm-example-client-angular/browser"

# Sync files to S3 bucket
aws s3 sync $LOCAL_DIR_PATH s3://$S3_BUCKET_NAME --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_DISTRIBUTION_ID --paths "/*"

echo "Sync and cache invalidation completed."
