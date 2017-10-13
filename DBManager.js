var config = require("./config.js");
var mongodb = require("mongodb");
var url = "mongodb://" + config.db.ip + ":" + config.db.port + "/" + config.db.cn;

function getConnection(callback) {
    if(!global.MongoClient){
        global.MongoClient = mongodb.MongoClient; 
    }
    global.MongoClient.connect(url, function (err, db) {
        if (err)
            throw err;
        callback(db);
    });
}

module.exports.getConnection = getConnection;
