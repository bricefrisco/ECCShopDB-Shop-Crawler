FROM mhart/alpine-node
COPY node_modules application/node_modules/
COPY dist/application.js application/application.js
WORKDIR application
ENTRYPOINT ["node", "application.js"]