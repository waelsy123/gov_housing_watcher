
NODE_ENV=prod pm2 start dist/sozialbau/index.js --name sozial-bau --time
NODE_ENV=prod pm2 start dist/wbm/index.js --name sozial-bau --time
NODE_ENV=prod pm2 start dist/gewobag/index.js --name sozial-bau --time