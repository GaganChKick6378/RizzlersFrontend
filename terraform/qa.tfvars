environment  = "qa"
aws_region   = "ap-south-1"
vpc_name     = "KDU-25-VPC"
team_number  = 10
rds_endpoint = "ibe2025-kdu25rdsinstance61f66da9-8harocvoxzt8.c3ysg6m2290x.ap-south-1.rds.amazonaws.com"

# ECS Configuration
container_port    = 8080
container_cpu     = 512
container_memory  = 1024
task_cpu          = 1024
task_memory       = 2048
ecs_desired_count = 2
ecs_min_capacity  = 2
ecs_max_capacity  = 6 