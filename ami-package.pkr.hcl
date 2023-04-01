packer {
  required_plugins {
    amazon = {
      version = ">= 1.0.0"
      source  = "github.com/hashicorp/amazon"
    }
  }
}

locals {
  timestamp = regex_replace(timestamp(), "[- TZ:]", "")
}

variable "Access_key_ID" {
  default       = "AKIAUH3BDF6AVHMBORYQ"
  type          = string
}
variable "Secret_Access_Key" {
  default       = "i/6AWlwwm4RgGRUOTJO2BNgq1uIJ4tHLKSwFC4Q1"
  type          = string
}


source "amazon-ebs" "Linux_Machine"{
  profile="dev"
  ami_users=["084961205891"]
  ami_name = "CUSTOMIZE_AMI${local.timestamp}"
  access_key=var.Access_key_ID
  secret_key=var.Secret_Access_Key
  source_ami_filter {
    filters = {
      name                = "amzn2-ami-kernel-5.10-hvm-2.0.20230207.0-x86_64-gp2"
      root-device-type    = "ebs"
      virtualization-type = "hvm"
    }
    most_recent = true
    owners      = ["amazon"]
  }


  instance_type = "t2.micro"
  region = "us-east-1"
  ssh_username = "ec2-user"
}

build {
  sources = [
    "source.amazon-ebs.Linux_Machine"
  ]

  provisioner "file" {
    source = "./webApp.zip"
    destination = "/tmp/webApp.zip"
  }
  provisioner "file" {
    source      = "./project.service"
    destination = "/tmp/project.service"
  }

    provisioner "file" {
    source      = "./cloudwatch-config.json"
    destination = "/tmp/cloudwatch-config.json"
  }
  
  provisioner "shell" {
    script = "./app.sh"
  }
}
