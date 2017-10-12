var collectionName = "AccountTable";
var dbManager = require("./DBManager.js");
var Promise = require("bluebird");

function AccountTable() {
}


//get inventory details for product
AccountTable.prototype.getAccountDetails = function (filter) {
    return new Promise(function (resolve, reject) {
        dbManager.getConnection(function (db) {
            db.collection(collectionName).find({
                // userId: {$regex : new RegExp(filter.userId, "i") },
                userId: filter.userId
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

//Get account list of people for tranfer
AccountTable.prototype.getAccountBalance = function (filter) {
    var accids = [];
    accids.push(filter.fromAccount);
    accids.push(filter.toAccount);
    return new Promise(function (resolve, reject) {
        dbManager.getConnection(function (db) {
            db.collection(collectionName).find({
                accountNumber: { $in: accids }
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

//Update account table for payer
AccountTable.prototype.updatedBalanceForPayer = function (filter) {
    return new Promise(function (resolve, reject) {
        dbManager.getConnection(function (db) {
            db.collection(collectionName)
            .update({ accountNumber: filter.fromAccount }, { $set: { availableBalance: filter.fromBalance, currentBalance: filter.fromBalance, remainingFreeTransfers: filter.fromRemainingFreeTransfer }}, function (err, result) {
                if (err)
                    return reject(err);
                if (result) {
                   return resolve(result)
                }
            });
        });
    });
};

//Update account table for payee
AccountTable.prototype.updatedToBalance = function (filter) {
    console.log("filter values",filter);
    return new Promise(function (resolve, reject) {
        dbManager.getConnection(function (db) {
            db.collection(collectionName)
            .update({ accountNumber: filter.toAccount }, { $set: { availableBalance: filter.availableBalance, currentBalance: filter.availableBalance }}, function (err, result) {
                if (err)
                    return reject(err);
                db.close();
                if (result.result.ok == 1) {
                    return resolve({ isSuccess: true })
                } else {
                    return resolve({ isSuccess: false })
                }
            });
        });
    });
};

module.exports = {
    getInst: function () {
        return new AccountTable();
    }
}