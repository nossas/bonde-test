<<<<<<< HEAD
FROM node:8-slim

# Install latest chrome dev package.
# Note: this installs the necessary libs to make the bundled version of Chromium that Pupppeteer
# installs, work.
RUN apt-get update && apt-get install -y wget --no-install-recommends \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-unstable \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get purge --auto-remove -y curl \
    && rm -rf /src/*.deb

# Uncomment to skip the chromium download when installing puppeteer. If you do,
# you'll need to launch puppeteer with:
#     browser.launch({executablePath: 'google-chrome-unstable'})
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# Install puppeteer so it's available in the container.
# RUN yarn add puppeteer

=======
FROM node:alpine

RUN apk add --no-cache \
	bash \
	coreutils \
	curl \
	git

COPY . /code
>>>>>>> feature(devops): Remove casperjs and old strategy to test; Ava take place as test runner
WORKDIR /code
COPY . /code

# Add pptr user.
RUN groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
    && mkdir -p /home/pptruser/Downloads \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /code/node_modules

# Run user as non privileged.
USER pptruser

# CMD ["google-chrome-unstable"]

RUN yarn install

<<<<<<< HEAD
=======
RUN yarn

>>>>>>> feature(devops): Remove casperjs and old strategy to test; Ava take place as test runner
CMD ["yarn", "test"]