FROM node:12

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

ENV PORT=8000

EXPOSE 8000

CMD ["npm", "start"]