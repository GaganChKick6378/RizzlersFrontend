terraform {
  backend "s3" {
    bucket         = "rizzlers-ibe-dev-tfstate"
    key            = "frontend/dev/terraform.tfstate"
    region         = "ap-south-1"
    encrypt        = true
    dynamodb_table = "rizzlers-terraform-locks"
  }
} 