variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "ap-south-1"
}

variable "environment" {
  description = "Environment (dev, qa, prod)"
  type        = string
}

variable "project" {
  description = "Project name"
  type        = string
  default     = "rizzlers-ibe"
}

variable "vpc_name" {
  description = "Name of the existing VPC"
  type        = string
  default     = "KDU-25-VPC"
}

variable "team_number" {
  description = "Team number for RDS database naming"
  type        = number
  default     = 10
}

variable "rds_endpoint" {
  description = "RDS endpoint to connect to"
  type        = string
  default     = "ibe2025-kdu25rdsinstance61f66da9-8harocvoxzt8.c3ysg6m2290x.ap-south-1.rds.amazonaws.com"
}

# ECS configuration
variable "container_port" {
  description = "Port exposed by the container"
  type        = number
  default     = 8080
}

variable "container_cpu" {
  description = "CPU units for the container"
  type        = number
  default     = 256
}

variable "container_memory" {
  description = "Memory for the container (MB)"
  type        = number
  default     = 512
}

variable "task_cpu" {
  description = "CPU units for the ECS task"
  type        = number
  default     = 512
}

variable "task_memory" {
  description = "Memory for the ECS task (MB)"
  type        = number
  default     = 1024
}

variable "ecs_desired_count" {
  description = "Desired number of ECS tasks"
  type        = number
  default     = 2
}

variable "ecs_min_capacity" {
  description = "Minimum number of ECS tasks"
  type        = number
  default     = 1
}

variable "ecs_max_capacity" {
  description = "Maximum number of ECS tasks"
  type        = number
  default     = 4
} 