#!/bin/bash

pm2 stop sozialbau
pm2 delete sozialbau

pm2 stop wbm
pm2 delete wbm

pm2 stop gewobag
pm2 delete gewobag