# IAM role for CodeBuild
resource "aws_iam_role" "codebuild" {
  name = "rizzlers-frontend-codebuild-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "codebuild.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name    = "rizzlers-codebuild-role-${var.environment}"
    Creator = "Rizzlers"
    Purpose = "IBE"
  }
}

# IAM policy for CodeBuild
resource "aws_iam_role_policy" "codebuild" {
  role = aws_iam_role.codebuild.name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:PutObject",
          "s3:GetObject",
          "s3:ListBucket",
          "s3:DeleteObject"
        ]
        Resource = [
          aws_s3_bucket.frontend.arn,
          "${aws_s3_bucket.frontend.arn}/*",
          "arn:aws:s3:::${var.terraform_state_bucket}",
          "arn:aws:s3:::${var.terraform_state_bucket}/*"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = ["*"]
      },
      {
        Effect = "Allow"
        Action = [
          "cloudfront:CreateInvalidation",
          "cloudfront:GetDistribution",
          "cloudfront:UpdateDistribution"
        ]
        Resource = [aws_cloudfront_distribution.frontend.arn]
      },
      {
        Effect = "Allow"
        Action = [
          "s3:*",
          "cloudfront:*",
          "iam:*",
          "logs:*",
          "codebuild:*"
        ]
        Resource = "*"
      }
    ]
  })
}

# CodeBuild project
resource "aws_codebuild_project" "frontend" {
  name          = "rizzlers-frontend-${var.environment}"
  description   = "Build project for Rizzlers frontend ${var.environment}"
  build_timeout = "30"
  service_role  = aws_iam_role.codebuild.arn

  artifacts {
    type = "NO_ARTIFACTS"
  }

  environment {
    compute_type                = "BUILD_GENERAL1_SMALL"
    image                      = "aws/codebuild/standard:7.0"
    type                       = "LINUX_CONTAINER"
    image_pull_credentials_type = "CODEBUILD"

    environment_variable {
      name  = "ENVIRONMENT"
      value = var.environment
    }

    environment_variable {
      name  = "S3_BUCKET"
      value = aws_s3_bucket.frontend.id
    }

    environment_variable {
      name  = "CLOUDFRONT_DISTRIBUTION_ID"
      value = aws_cloudfront_distribution.frontend.id
    }

    environment_variable {
      name  = "TF_VAR_environment"
      value = var.environment
    }
  }

  source {
    type            = "GITHUB"
    location        = "https://github.com/your-org/${var.github_repository}.git"
    git_clone_depth = 1
    buildspec       = "buildspec.yml"

    git_submodules_config {
      fetch_submodules = true
    }
  }

  source_version = var.github_branch

  logs_config {
    cloudwatch_logs {
      group_name  = "/aws/codebuild/rizzlers-frontend-${var.environment}"
      stream_name = "build-log"
    }
  }

  tags = {
    Name    = "rizzlers-codebuild-${var.environment}"
    Creator = "Rizzlers"
    Purpose = "IBE"
  }
}

# GitHub webhook for automatic builds
resource "aws_codebuild_webhook" "frontend" {
  project_name = aws_codebuild_project.frontend.name
  
  filter_group {
    filter {
      type    = "EVENT"
      pattern = "PUSH"
    }

    filter {
      type    = "HEAD_REF"
      pattern = var.github_branch
    }
  }
} 