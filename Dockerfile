FROM node:latest
ENV host app.reboo-staging.org
RUN mkdir /code
WORKDIR /code
RUN npm install -g phantomjs casperjs
CMD ["./node_modules/.bin/casperjs", "test", "tests/"]
