#!/bin/bash

# Define an associative array of apps (name as key and path as value)
declare -A apps=(
    [sozialbau]="dist/sozialbau/index.js"
    [wbm]="dist/wbm/index.js"
    [gewobag]="dist/gewobag/index.js"
)

# Iterate over the associative array
for name in "${!apps[@]}"
do
    path=${apps[$name]}

    # Start the app using pm2
    NODE_ENV=prod pm2 start $path --name $name --time
done
