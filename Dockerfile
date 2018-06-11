FROM node:9.9.0
ARG VERSION_TAG
RUN git clone -b $VERSION_TAG https://github.com/DuoSoftware/DVP-ARDSSlotCalculator.git /usr/local/src/ardsslotcalculator;
RUN cd /usr/local/src/ardsslotcalculator;
WORKDIR /usr/local/src/ardsslotcalculator
RUN npm install

CMD [ "node", "/usr/local/src/ardsslotcalculator/app.js" ]
