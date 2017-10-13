var collectionName = "TransactionTable";
var dbManager = require("./DBManager.js");
var Promise = require("bluebird");

function TransactionTable() {
}


//get inventory details for product
TransactionTable.prototype.insertTransactionForPayer = function (filter) {
    return new Promise(function (resolve, reject) {
        dbManager.getConnection(function (db) {
            db.collection(collectionName).insert(
                filter, function (err, res) {
                    console.log(res);
                    if (err) {
                        return reject(err);
                    }
                    return resolve(res.ops[0]);
                }
            )
        });
    });
}

TransactionTable.prototype.insertTransactionForPayee = function (filter) {
    return new Promise(function (resolve, reject) {
        dbManager.getConnection(function (db) {
            db.collection(collectionName).insert(
                filter, function (err, res) {
                    console.log(res);
                    if (err) {
                        return reject(err);
                    }
                    return resolve(res.ops[0]);
                }
            )
        });
    });
}
module.exports = {
    getInst: function () {
        return new TransactionTable();
    }
}