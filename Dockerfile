FROM node:latest
RUN apt-get install make gcc g++ python git
RUN mkdir /code
WORKDIR /code
RUN npm install -g phantomjs casperjs
CMD ["./node_modules/.bin/casperjs", "test", "test.js"]
