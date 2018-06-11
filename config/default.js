module.exports = {
    "Redis":
        {
            "mode":"instance",//instance, cluster, sentinel
            "ip": "45.55.142.207",
            "port": 6389,
            "user": "duo",
            "password": "DuoS123",
            "db":3,
            "sentinels":{
                "hosts": "138.197.90.92,45.55.205.92,138.197.90.92",
                "port":16389,
                "name":"redis-cluster"
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