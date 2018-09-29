FROM node:latest

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build
EXPOSE 3000

ENV NODE_ENV production

# CMD ["npm", "run", "pm2:start"]
CMD ["node", "./dist/index.js"]

