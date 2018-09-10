const redisHandler = require('./RedisHandler');
const logger = require("dvp-common/LogHandler/CommonLogHandler.js").logger;
const util = require('util');
const config = require('config');


var SetArdsSlotCount = async () => {
    logger.info('++++++++++++++++++++++++ Start SetArdsSlotCount :: Time: ' + new Date().toISOString() + ' ++++++++++++++++++++++++');

    try {
        let registeredMetaInfo = await redisHandler.GetAllRegisteredMetaInfo();

        for (let metaInfo of registeredMetaInfo.values()) {

            let existingCountKeys = await redisHandler.ScanAsync(util.format('ExecCount:Queue:%s:%s:CALLSERVER:CALL:*', metaInfo.Company, metaInfo.Tenant));
            let queueDetails = await redisHandler.GetAllQueues(metaInfo.Tenant, metaInfo.Company);
            let totalQueueCount = queueDetails.TotalQueueCount;

            let queueRatios = new Map();
            let minQueueRatio = 1.00;
            for (let [queueId, queuedSessions] of queueDetails.QueueList.entries()) {

                //logger.info(`queueId:: ${queueId} ::: queuedSessions:: ${queuedSessions}`);
                let ratio = queuedSessions.length / parseFloat(totalQueueCount);
                queueRatios.set(queueId, ratio);
                if (minQueueRatio > ratio) {
                    minQueueRatio = (ratio > 0) ? ratio : 0.01;
                }

            }

            for(let execCountKey of existingCountKeys){
                logger.info(`---------------------------------------------------------------`);

                let queueId = execCountKey.split(':').slice(1).join(':');
                if(queueRatios.has(queueId)){
                    let queueRatio = queueRatios.get(queueId);

                    logger.info(`queueId:: ${queueId} ::: queueRatio:: ${queueRatio}`);
                    let queueMinRatio = queueRatio / minQueueRatio;
                    logger.info(`queueId:: ${queueId} ::: queueRatio:: ${queueMinRatio}`);

                    if (queueMinRatio > 20) {
                        logger.info(`SetExecuteCount queueId:: ${queueId} :: count: 4 ::: Result:: ${await redisHandler.SetExecuteCount(queueId, 4)}`);
                    } else if (queueMinRatio > 10) {
                        logger.info(`SetExecuteCount queueId:: ${queueId} :: count: 3 ::: Result:: ${await redisHandler.SetExecuteCount(queueId, 3)}`);
                    } else if (queueMinRatio > 5) {
                        logger.info(`SetExecuteCount queueId:: ${queueId} :: count: 2 ::: Result:: ${await redisHandler.SetExecuteCount(queueId, 2)}`);
                    } else {
                        logger.info(`SetExecuteCount queueId:: ${queueId} :: count: 1 ::: Result:: ${await redisHandler.SetExecuteCount(queueId, 1)}`);
                    }
                }else {
                    logger.info(`SetExecuteCount queueId:: ${queueId} :: count: 1 ::: Result:: ${await redisHandler.SetExecuteCount(queueId, 1)}`);
                }

                logger.info(`---------------------------------------------------------------`);

            }

        }
    }catch (ex){
        logger.error(`SetArdsSlotCount failed`);
    }

};

let execTimeout = parseInt(config.Host.ExeTimeout)
setInterval(SetArdsSlotCount, execTimeout);