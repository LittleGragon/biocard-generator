FROM ubuntu

RUN apt-get update

RUN apt-get install nodejs -y

RUN apt-get install npm -y

CMD ["npm", "-v"]

RUN apt-get install yarn -y

COPY package.json ./

CMD ["yarn", "install"]

COPY ./ ./

CMD ["npm" "run" "build:prod"]

CMD ["npm", "run", "start"]

EXPOSE 7001