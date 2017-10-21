FROM node:alpine

RUN apk add --no-cache \
	bash \
	coreutils \
	curl \
	git

COPY . /code
WORKDIR /code

RUN yarn

CMD ["yarn", "test"]