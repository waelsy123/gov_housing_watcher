provider "aws" {
  region = "us-east-1"
}

resource "aws_instance" "sozialwatcher" {
  ami           = "ami-0ac019f4fcb7cb7e6"
  instance_type = "t2.micro"
 key_name = "id_rsa.pub"
 
  user_data = <<-EOF
#!/bin/bash

# Install Node.js and npm
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
apt-get install -y nodejs

# Install git
apt-get install -y git

# Install the pm2 package
npm install pm2 -g

cd /home/ubuntu

# Clone the repository containing the index.ts file
git clone https://github.com/waelsy123/chatgpt.git

# Install the required dependencies
cd chatgpt
npm install
npm run tsc

# Use pm2 to run the index.ts file
# pm2 start dist/index.js
  EOF
}