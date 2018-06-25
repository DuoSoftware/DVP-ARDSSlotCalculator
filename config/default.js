module.exports = {
    "Redis":
        {
            "mode":"instance",//instance, cluster, sentinel
            "ip": "",
            "port": 6389,
            "user": "",
            "password": "",
            "db":6,
            "sentinels":{
                "hosts": "",
                "port":16389,
                "name":"redis-cluster"
            }
        },
    "Host":{
        "ExeTimeout":"10000"
    }
};
