FROM node:21.2-bookworm

WORKDIR /app

COPY package*.json ./

RUN npm set strict-ssl false

RUN npm install -g --force yarn

RUN yarn config set "strict-ssl" false -g

RUN yarn install

COPY . .

EXPOSE 5173

CMD ["yarn", "dev"]
