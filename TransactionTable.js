var collectionName = "TransactionTable";
var dbManager = require("./DBManager.js");
var Promise = require("bluebird");

function TransactionTable() {
}


//get inventory details for product
TransactionTable.prototype.insertTransactionForPayer = function (filter) {
    return new Promise(function (resolve, reject) {
        dbManager.getConnection(function (db) {
            db.collection(collectionName).insert({
                // userId: {$regex : new RegExp(filter.userId, "i") },
                
            })
                .toArray(function (err, res) {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(res);
                });
        });
    });
}

module.exports = {
    getInst: function () {
        return new TransactionTable();
    }
}