terraform {
  backend "s3" {
    bucket         = "rizzlers-terraform-state"
    key            = "frontend/qa/terraform.tfstate"
    region         = "ap-south-1"
    encrypt        = true
    dynamodb_table = "rizzlers-terraform-locks"
  }
} 