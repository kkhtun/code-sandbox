#!/bin/bash
git pull
npm install
cd client
npm install
npm run build
cd ..
pm2 reload ecosystem.config.js --env production
# EOF