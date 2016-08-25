FROM node:6

COPY . /opt/webdriverio

WORKDIR /opt/webdriverio

RUN npm install