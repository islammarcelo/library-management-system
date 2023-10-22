FROM node:16.15.1

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . . 

CMD ["npm", "run", "start:dev"]