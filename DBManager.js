var mongodb = require("mongodb");
var url = "mongodb://52.71.161.217:27017/tmb";

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
