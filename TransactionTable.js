var collectionName = "TransactionTable";
var dbManager = require("./DBManager.js");
var Promise = require("bluebird");

function TransactionTable() {
}

//Get transaction details for an account
TransactionTable.prototype.getTransactionDetails = function (filter) {
    return new Promise(function (resolve, reject) {
        dbManager.getConnection(function (db) {
            db.collection(collectionName).find({
                accountNumber: filter.accountNumber
            },{sort:{txnDate:-1}})
                .toArray(function (err, res) {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(res);
                });
        });
    });
}

//adding transaction details in Transaction table for payer
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

//adding transaction details in Transaction table for payee
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