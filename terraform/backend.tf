terraform {
  backend "s3" {
    bucket         = "rizzlers-ibe-dev-tfstate"
    key            = "frontend/terraform.tfstate"
    region         = "ap-south-1"
    encrypt        = true
    dynamodb_table = "rizzlers-terraform-locks"
  }
}

# Create the DynamoDB table for state locking if it doesn't exist
resource "aws_dynamodb_table" "terraform_locks" {
  name         = "rizzlers-terraform-locks"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }

  tags = {
    Name    = "Rizzlers-Terraform-State-Lock"
    Creator = "RizzlersTeam"
    Purpose = "IBE"
  }

  # This prevents Terraform from trying to delete this table when running terraform destroy
  # since it's needed for the state locking mechanism
  lifecycle {
    prevent_destroy = true
  }
} 