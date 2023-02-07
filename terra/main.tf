provider "aws" {
  region = "us-east-1"
}

resource "aws_instance" "wasim_WBM" {
  ami           = "ami-0ac019f4fcb7cb7e6"
  instance_type = "t2.micro"
  key_name      = "wasim-mac"

  tags = {
    Name = "wasim_WBM"
  }

  user_data = <<-EOF
#!/bin/bash

sudo apt-get update

# Install Node.js and npm
curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
apt-get install -y nodejs

# Install git
apt-get install -y git

# Install the pm2 package
npm install pm2 -g
npm install http-server -g

cd /home/ubuntu

# Clone the repository containing the index.ts file
git clone https://github.com/waelsy123/gov_housing_watcher.git

# Install the required dependencies
sudo chmod 777 gov_housing_watcher
cd gov_housing_watcher
sudo git checkout wasim-wbm

npm install --unsafe-perm
npm run tsc

sudo apt-get install -y libpangocairo-1.0-0 libx11-xcb1 libxcomposite1 libxcursor1 libxdamage1 libxi6 libxtst6 libnss3 libcups2 libxss1 libxrandr2 libgconf2-4 libasound2 libatk1.0-0 libgtk-3-0
sudo apt-get install -y libgbm-dev

chmod 777 chat_ids.txt
chmod 777 *.png

# Use pm2 to run the index.ts file
sudo -H -u ubuntu bash -c 'pm2 start dist/index.js' 


#  pm2 start /usr/bin/http-server --name my-file-server -- -p 80 -d
 sudo pm2 start /usr/bin/http-server --name my-file-server -- -p 80 -d

  EOF
}
