provider "aws" {
  region = var.aws_region
}

#create S3 bucket to host web app

resource "aws_s3_bucket" "create" {
  bucket = "lawngevity-landscaping-website"

  tags = {
    Name        = "Lawngevity Website"
    Environment = "Prod"
  }
}

resource "aws_s3_bucket_ownership_controls" "owner" {
  bucket = "lawngevity-landscaping-website"
    rule {
      object_ownership = "BucketOwnerPreferred"
  }
    depends_on = [
        aws_s3_bucket.create
      ]
}


resource "aws_s3_bucket_public_access_block" "access" {
  bucket = aws_s3_bucket.create.id

  block_public_acls = true
  block_public_policy = true
  ignore_public_acls = true
  restrict_public_buckets = true
  depends_on = [
    aws_s3_bucket.create
  ]
}

#add files to S3 

resource "aws_s3_object" "home" {
  bucket = aws_s3_bucket.create.id
  key    = "create"
  source = "${path.module}/../src/frontend/lawngevity.html"
  acl = "private"
  content_type = "text/html"
  depends_on = [
    aws_s3_bucket_public_access_block.access
  ]
}
