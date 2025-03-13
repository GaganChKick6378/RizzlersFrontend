# Terraform Environment Configuration

This document provides detailed information about how Terraform workspaces are used in this project to manage separate development and QA environments.

## Workspace Strategy

We use Terraform workspaces to isolate resources for different environments while sharing the same Terraform configuration. Each workspace represents a separate infrastructure environment with its own state.

- **dev workspace**: Development environment
- **qa workspace**: QA environment

## State Management

All workspaces share the same backend S3 bucket for state storage, but each workspace has its own state file path:

```
s3://rizzlers-ibe-dev-tfstate/frontend/terraform.tfstate
```

Inside the S3 bucket, Terraform automatically creates separate state files for each workspace:

- `env:/dev/frontend/terraform.tfstate` - Development state
- `env:/qa/frontend/terraform.tfstate` - QA state

## Resource Naming Convention

Resources are named dynamically based on the current workspace to ensure proper separation:

```terraform
locals {
  bucket_name = "rizzlers-ibe-frontend-${terraform.workspace}"
}
```

This ensures that each environment has its own isolated resources:

- Development S3 bucket: `rizzlers-ibe-frontend-dev`
- QA S3 bucket: `rizzlers-ibe-frontend-qa`

## Environment-specific Variables

In the GitHub Actions workflows, environment-specific variables are set:

### Dev Environment
```yaml
- name: Set Terraform Workspace
  id: workspace
  run: |
    echo "WORKSPACE=dev" >> $GITHUB_ENV
    echo "WORKSPACE=dev" >> $GITHUB_OUTPUT
```

### QA Environment
```yaml
- name: Set Terraform Workspace
  id: workspace
  run: |
    echo "WORKSPACE=qa" >> $GITHUB_ENV
```

## Manual Approval for QA

The QA environment deployment requires manual approval, which is implemented using GitHub Environments:

```yaml
manual-approval:
  name: "Manual Approval for QA Deployment"
  needs: terraform-plan
  runs-on: ubuntu-latest
  environment: qa  # This creates a deployment environment with protection rules
```

## Handling Existing Resources

To handle the "resource already exists" errors, our Terraform configuration uses:

1. **Data sources** to check if resources already exist
2. **Count parameter** to conditionally create resources
3. **Import steps** in the workflow to import existing resources into Terraform state
4. **Lifecycle blocks** to prevent unnecessary recreation of resources

### Example for DynamoDB table:

```terraform
# Use a data source to check if the DynamoDB table already exists
data "aws_dynamodb_table" "existing_locks_table" {
  name = "rizzlers-terraform-locks"
  count = 1
}

# Create the DynamoDB table for state locking only if it doesn't exist
resource "aws_dynamodb_table" "terraform_locks" {
  # Only create if the data source lookup fails
  count = length(data.aws_dynamodb_table.existing_locks_table) > 0 ? 0 : 1
  name  = "rizzlers-terraform-locks"
  # ... other configuration ...
}
```

### Example for S3 bucket:

```terraform
locals {
  bucket_name = "rizzlers-ibe-frontend-${terraform.workspace}"
}

# Use a data source to check if the bucket already exists
data "aws_s3_bucket" "existing_bucket" {
  bucket = local.bucket_name
  count  = 1
}

resource "aws_s3_bucket" "frontend" {
  bucket = local.bucket_name
  
  # Don't recreate if only these attributes change
  lifecycle {
    ignore_changes = [
      tags,
      server_side_encryption_configuration
    ]
  }
}
```

## Environment-specific Tagging

All resources include environment information in their tags:

```terraform
provider "aws" {
  region = "ap-south-1"
  default_tags {
    tags = {
      Creator = "RizzlersTeam"
      Purpose = "IBE"
      Environment = terraform.workspace
    }
  }
}
```

## Email Notifications

The QA workflow includes email notifications to:

1. **Notify reviewers** when a deployment needs approval
2. **Notify the team** when a deployment has been completed successfully

These notifications are configured in the QA workflow file. 