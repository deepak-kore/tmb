var mongodb = require("mongodb");
//To create only one mongoclient object. 
//It will avoid creating multiple instances of mngo clients. 
//Inside MongoClient, connection pools will be maintained
if(!global.MongoClient) {
    global.MongoClient = require('mongodb').MongoClient;
}
