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
        }
};