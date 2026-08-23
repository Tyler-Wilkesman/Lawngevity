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

resource "aws_s3_object" "website_files" {

  for_each = fileset(
    "${path.module}/../src/frontend",
    "**/*"
  )

  bucket = aws_s3_bucket.create.id

  key = each.value

  source = "${path.module}/../src/frontend/${each.value}"

  etag = filemd5(
    "${path.module}/../src/frontend/${each.value}"
  )

  content_type = lookup({
    html = "text/html"
    css  = "text/css"
    js   = "application/javascript"
    png  = "image/png"
    jpg  = "image/jpeg"
    jpeg = "image/jpeg"
    svg  = "image/svg+xml"
    webp = "image/webp"
    ico  = "image/x-icon"
  },
  lower(
    element(
      split(".", each.value),
      length(split(".", each.value)) - 1
    )
  ),
  "application/octet-stream"
  )

  depends_on = [
    aws_s3_bucket_public_access_block.access
  ]
}
