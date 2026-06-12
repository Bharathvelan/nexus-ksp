###############################################################################
# NEXUS-KSP — MSK Module
# Amazon Managed Kafka (3 brokers, TLS, SASL/SCRAM).
###############################################################################

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# ---------------------------------------------------------------------------
# Security Group
# ---------------------------------------------------------------------------
resource "aws_security_group" "msk" {
  name_prefix = "${var.project}-msk-"
  vpc_id      = var.vpc_id
  description = "MSK Kafka security group"

  tags = merge(var.tags, {
    Name = "${var.project}-msk-sg"
  })

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_security_group_rule" "msk_ingress_tls" {
  type                     = "ingress"
  from_port                = 9094
  to_port                  = 9094
  protocol                 = "tcp"
  source_security_group_id = var.eks_node_security_group_id
  security_group_id        = aws_security_group.msk.id
  description              = "Allow Kafka TLS from EKS"
}

resource "aws_security_group_rule" "msk_ingress_sasl" {
  type                     = "ingress"
  from_port                = 9096
  to_port                  = 9096
  protocol                 = "tcp"
  source_security_group_id = var.eks_node_security_group_id
  security_group_id        = aws_security_group.msk.id
  description              = "Allow Kafka SASL/SCRAM from EKS"
}

resource "aws_security_group_rule" "msk_ingress_zookeeper" {
  type                     = "ingress"
  from_port                = 2181
  to_port                  = 2181
  protocol                 = "tcp"
  source_security_group_id = var.eks_node_security_group_id
  security_group_id        = aws_security_group.msk.id
  description              = "Allow ZooKeeper from EKS"
}

resource "aws_security_group_rule" "msk_egress" {
  type              = "egress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.msk.id
  description       = "Allow all outbound"
}

# ---------------------------------------------------------------------------
# MSK Configuration
# ---------------------------------------------------------------------------
resource "aws_msk_configuration" "main" {
  name              = "${var.project}-kafka-config"
  kafka_versions    = [var.kafka_version]
  description       = "NEXUS-KSP Kafka configuration"

  server_properties = <<-PROPERTIES
    auto.create.topics.enable=false
    default.replication.factor=3
    min.insync.replicas=2
    num.partitions=6
    num.io.threads=8
    num.network.threads=5
    num.replica.fetchers=2
    replica.lag.time.max.ms=30000
    socket.receive.buffer.bytes=102400
    socket.request.max.bytes=104857600
    socket.send.buffer.bytes=102400
    unclean.leader.election.enable=false
    log.retention.hours=168
    log.retention.bytes=-1
  PROPERTIES
}

# ---------------------------------------------------------------------------
# SASL/SCRAM Secret
# ---------------------------------------------------------------------------
resource "aws_secretsmanager_secret" "msk_credentials" {
  name       = "AmazonMSK_${var.project}_credentials"
  kms_key_id = var.kms_key_arn

  tags = var.tags
}

resource "aws_secretsmanager_secret_version" "msk_credentials" {
  secret_id = aws_secretsmanager_secret.msk_credentials.id

  secret_string = jsonencode({
    username = var.kafka_username
    password = var.kafka_password
  })
}

# ---------------------------------------------------------------------------
# MSK Cluster
# ---------------------------------------------------------------------------
resource "aws_msk_cluster" "main" {
  cluster_name           = "${var.project}-kafka"
  kafka_version          = var.kafka_version
  number_of_broker_nodes = var.broker_count

  broker_node_group_info {
    instance_type   = var.broker_instance_type
    client_subnets  = var.private_subnet_ids
    security_groups = [aws_security_group.msk.id]

    storage_info {
      ebs_storage_info {
        volume_size = var.broker_storage_gb

        provisioned_throughput {
          enabled           = true
          volume_throughput  = 250
        }
      }
    }
  }

  configuration_info {
    arn      = aws_msk_configuration.main.arn
    revision = aws_msk_configuration.main.latest_revision
  }

  encryption_info {
    encryption_in_transit {
      client_broker = "TLS"
      in_cluster    = true
    }
    encryption_at_rest_kms_key_arn = var.kms_key_arn
  }

  client_authentication {
    sasl {
      scram = true
    }
    unauthenticated = false
  }

  logging_info {
    broker_logs {
      cloudwatch_logs {
        enabled   = true
        log_group = aws_cloudwatch_log_group.msk.name
      }
    }
  }

  tags = merge(var.tags, {
    Name = "${var.project}-kafka"
  })
}

resource "aws_msk_scram_secret_association" "main" {
  cluster_arn     = aws_msk_cluster.main.arn
  secret_arn_list = [aws_secretsmanager_secret.msk_credentials.arn]

  depends_on = [aws_secretsmanager_secret_version.msk_credentials]
}

resource "aws_cloudwatch_log_group" "msk" {
  name              = "/aws/msk/${var.project}"
  retention_in_days = 30

  tags = var.tags
}
