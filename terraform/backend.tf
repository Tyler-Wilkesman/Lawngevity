terraform {
  backend "s3" {
  bucket         = "file-share-tf-state"
  key            = "file-share-state.tfstate"
  region         = "us-east-1"
  use_lockfile = true
  encrypt        = true
  }
}
