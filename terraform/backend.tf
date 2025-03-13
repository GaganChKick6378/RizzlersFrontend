terraform {
  backend "s3" {
    bucket         = "rizzlers-ibe-dev-tfstate"
    key            = "frontend/terraform.tfstate"
    region         = "ap-south-1"
    encrypt        = true
    dynamodb_table = "rizzlers-terraform-locks"
  }
}

# Use a data source to check if the DynamoDB table already exists
data "aws_dynamodb_table" "existing_locks_table" {
  name = "rizzlers-terraform-locks"
  # This will fail if the table doesn't exist, but that's okay because we use count below
  count = 1
}

# Create the DynamoDB table for state locking only if it doesn't exist
resource "aws_dynamodb_table" "terraform_locks" {
  # Only create if the data source lookup fails (i.e., the table doesn't exist)
  count        = length(data.aws_dynamodb_table.existing_locks_table) > 0 ? 0 : 1
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