FROM node:16.3-alpine3.12 as builder

ARG GITHUB_TOKEN

ENV HOME /usr/home/leclub
WORKDIR $HOME

RUN apk add --update \
    curl \
    git \
    && rm -rf /var/cache/apk/*

RUN git config --global url.https://${GITHUB_TOKEN}:@github.com/.insteadOf https://github.com/

# copy the tarballs
COPY ["yarn-offline-mirror", "$HOME/yarn-offline-mirror/"]

# copy files needed for the install
COPY ["package.json", "yarn.lock", ".yarnrc", "$HOME/"]

# the offline flag will mean that an error is raised if any
# module needs to be fetched remotely. It can be removed to allow
# yarn to fetch any missing modules if that was to happen.
RUN yarn --offline --frozen-lockfile --link-duplicates

# copy the rest.. could be further broken up into multiple instructions
# for cache optimisation
COPY . $HOME

ENTRYPOINT ["yarn"]
