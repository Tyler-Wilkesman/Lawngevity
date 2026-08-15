terraform {
  backend "s3" {
  bucket         = "lawngevity-tf-state"
  key            = "lawngevit-website.tfstate"
  region         = "us-east-1"
  use_lockfile = true
  encrypt        = true
  }
}
