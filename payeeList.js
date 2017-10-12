var collectionName = "payeeList";
var dbManager = require("./DBManager.js");
var Promise = require("bluebird");

function payeeList() {
}


//get inventory details for product
payeeList.prototype.getPayeeListForAccountNumber = function (filter) {
    return new Promise(function(resolve, reject){
        dbManager.getConnection(function (db) {
            db.collection(collectionName).find({
               // userId: {$regex : new RegExp(filter.userId, "i") },
               userLinkedAccountNumber: filter.accountNumber

            })
            .toArray(function(err, res){
                if(err){
                    return reject(err);
                }
                return resolve (res);
            });
        });
    });
}

module.exports = {
    getInst: function () {
        return new payeeList();
    }
}