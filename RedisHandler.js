const config = require('config');
const redis = require('ioredis');
//const Redlock = require('redlock');
const util = require('util');
const logger = require("dvp-common/LogHandler/CommonLogHandler.js").logger;

const redisip = config.Redis.ip;
const redisport = config.Redis.port;
const redispass = config.Redis.password;
const redismode = config.Redis.mode;
const redisdb = config.Redis.db;

var redisSetting = {
    port: redisport,
    host: redisip,
    family: 4,
    password: redispass,
    db: redisdb,
    retryStrategy: function (times) {
        var delay = Math.min(times * 50, 2000);
        return delay;
    },
    reconnectOnError: function (err) {

        return true;
    }
};

if (redismode == 'sentinel') {

    if (config.Redis.sentinels && config.Redis.sentinels.hosts && config.Redis.sentinels.port, config.Redis.sentinels.name) {
        var sentinelHosts = config.Redis.sentinels.hosts.split(',');
        if (Array.isArray(sentinelHosts) && sentinelHosts.length > 2) {
            var sentinelConnections = [];

            sentinelHosts.forEach(function (item) {

                sentinelConnections.push({host: item, port: config.Redis.sentinels.port})

            });

            redisSetting = {
                sentinels: sentinelConnections,
                name: config.Redis.sentinels.name,
                password: redispass,
                db: redisdb
            }

        } else {

            logger.error("No enough sentinel servers found .........");
        }

    }
}

var client = undefined;

if (redismode != "cluster") {
    client = new redis(redisSetting);
} else {

    var redisHosts = redisip.split(",");
    if (Array.isArray(redisHosts)) {


        redisSetting = [];
        redisHosts.forEach(function (item) {
            redisSetting.push({
                host: item,
                port: redisport,
                family: 4,
                password: redispass,
                db: redisdb
            });
        });

        var client = new redis.Cluster([redisSetting]);

    } else {

        client = new redis(redisSetting);
    }


}

client.on("error", function (err) {
    logger.error('Redis connection error :: %s', err);
});

client.on("connect", function (err) {
    logger.info("Redis Connect Success");
});


// var redlock = new Redlock(
//     [client],
//     {
//         driftFactor: 0.01,
//
//         retryCount: 10000,
//
//         retryDelay: 200
//
//     }
// );


function ScanAsync(pattern) {

    let matchingKeys = [];
    let promiseFunc = new Promise(function (resolve, reject) {
        try {
            let stream = client.scanStream({
                match: pattern,
                count: 1000
            });

            stream.on('data', function (resultKeys) {
                for (let i = 0; i < resultKeys.length; i++) {
                    matchingKeys.push(resultKeys[i]);
                }
            });
            stream.on('end', function () {
                resolve(matchingKeys);
            });
        } catch (ex) {
            logger.error('ScanAsync failed:: ' + ex);
            reject(ex);
        }
    });


    return promiseFunc;

}

async function SetExecuteCount(queueId, count) {

    try {

        let execCountKey = util.format('ExecCount:%s', queueId);
        return await client.set(execCountKey, count);

    } catch (ex) {
        logger.error('SetExecuteCount failed:: ' + ex);
        throw ex;
    }

}

async function GetAllQueues(tenant, company) {
    try {

        let keyPattern = util.format('Queue:%s:%s:CALLSERVER:CALL:*', company, tenant);
        let queueIds = new Set(await ScanAsync(keyPattern));

        let queueList = new Map();
        let totalQueueCount = 0;
        let minQueueCount = 0;

        for (let queueId of queueIds.values()) {

            let queueSessions = await client.lrange(queueId, 0, -1);
            if (queueSessions) {
                queueList.set(queueId, queueSessions);
                totalQueueCount += queueSessions.length;

                if(minQueueCount > queueSessions.length)
                    minQueueCount = queueSessions.length;
            }

        }

        return {QueueList: queueList, TotalQueueCount: totalQueueCount, MinQueueCount: minQueueCount};

    } catch (ex) {
        logger.error('GetAllQueues failed:: ' + ex);
        throw ex;
    }
}

async function GetAllRegisteredMetaInfo() {

    try {

        let keyPattern = util.format('ReqMETA:*:*:CALLSERVER:CALL');
        let metaInfoKeys = await ScanAsync(keyPattern);

        let tenantCompanySet = new Set();
        for (let key of metaInfoKeys) {

            let splitKeyInfo = key.split(':');
            if (splitKeyInfo.length === 5) {
                tenantCompanySet.add({Tenant: splitKeyInfo[2], Company: splitKeyInfo[1]});
            }

        }

        return tenantCompanySet;

    } catch (ex) {
        logger.error('GetAllRegisteredMetaInfo failed:: ' + ex);
        throw ex;
    }

}


module.exports.SetExecuteCount = SetExecuteCount;
module.exports.GetAllQueues = GetAllQueues;
module.exports.GetAllRegisteredMetaInfo = GetAllRegisteredMetaInfo;