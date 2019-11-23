FROM node:12-alpine
LABEL maintainer="Mohammed Essehemy <mohammedessehemy@gmail.com>"

ARG BUILD_PACKAGES="libgcc libstdc++ python linux-headers make gcc g++ git libuv bash curl tar bzip2 build-base"

WORKDIR /app

RUN apk --update --no-cache add --virtual .builds-deps ${BUILD_PACKAGES} && \
    apk add ca-certificates && \
    npm config set unsafe-perm true && \
    npm install node-gyp -g


COPY package.json package-lock.json ./

# in dev mode install all dependencies not  production only
RUN npm install && \
    (npm audit fix || true) && \
    chown -R node:node ./

COPY --chown=node:node ./ ./

USER node

CMD ["npm", "start"]
