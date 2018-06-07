module.exports = {
    "Redis":
        {
            "mode": "sentinel",//instance, cluster, sentinel
            "ip": "",
            "port": 6389,
            "user": "",
            "password": "",
            "db": 6,
            "sentinels": {
                "hosts": "",
                "port": 16389,
                "name": "redis-cluster"
            }
        },
    "Host":
        {
            "LBIP": "127.0.0.1",
            "LBPort": "8828",
            "Ip": "127.0.0.1",
            "Port": "8830",
            "Version": "1.0.0.0",
        }
};