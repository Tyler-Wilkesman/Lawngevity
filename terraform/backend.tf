terraform {
  backend "s3" {
  bucket         = "lawngevity-landscaping-tf-state"
  key            = "lawngevit-website.tfstate"
  region         = "us-east-1"
  use_lockfile = true
  encrypt        = true
  }
}
