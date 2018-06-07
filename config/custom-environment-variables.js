module.exports = {
    "Redis":
        {
            "mode": "SYS_REDIS_MODE",
            "ip": "SYS_REDIS_HOST",
            "port": "SYS_REDIS_PORT",
            "user": "SYS_REDIS_USER",
            "password": "SYS_REDIS_PASSWORD",
            "sentinels": {
                "hosts": "SYS_REDIS_SENTINEL_HOSTS",
                "port": "SYS_REDIS_SENTINEL_PORT",
                "name": "SYS_REDIS_SENTINEL_NAME"
            }
        },
    "Host":
        {
            "LBIP": "LB_FRONTEND",
            "LBPort": "LB_PORT",
            "Port": "HOST_ARDSLITESERVICE_PORT",
            "Version": "HOST_VERSION",
            "UseMsgQueue": "HOST_USE_MSG_QUEUE",
            "UseDashboardMsgQueue": 'HOST_USE_DASHBOARD_MSG_QUEUE'
        }
};