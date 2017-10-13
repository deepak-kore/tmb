var express = require("express");
var bodyParser = require('body-parser');
var AccountTable = require("./AccountTable.js").getInst();
var payeeList = require("./payeeList.js").getInst();
var ProfileInfo = require("./ProfileInfo.js").getInst();
var TransactionTable = require("./TransactionTable.js").getInst();

var app = express();
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

//get account Info
app.post('/tmb/bot/getAccountDetails', function (request, response) {
    var filter = {};
    filter.userId = request.body.userId;
    return AccountTable.getAccountDetails(filter)
        .then(function (res) {
            var data = {};

            data.account = res[0];
            if (res.length > 0) {
                payeeList.getPayeeListForAccountNumber(res[0]).then(function (paylist) {
                    data['payeeList'] = paylist || [];
                    return response.send(data);
                });

            }

            else {
                return response.send(data);
            }
        })
        .catch(function (err) {
            console.log(err);
            return response.status(500).send(err);
        });
});

//Account validation
app.post('/tmb/bot/validateAccount', function (request, response) {
    var filter = {};
    filter.mobileNumber = request.body.mobileNumber;
    filter.otp = request.body.otp;
    return ProfileInfo.validateAccount(filter)
        .then(function (res) {
            return response.send(res);
        })
        .catch(function (err) {
            console.log(err);
            return response.status(500).send(err);
        });
});

//Fund transfer
app.post('/tmb/bot/fundsTransfer', function (request, response) {
    var toAccountDetails = [];
    var filter = {};
    filter.toAccount = request.body.toAccount;
    filter.fromAccount = request.body.fromAccount;
    filter.amount = request.body.amount;
    return AccountTable.getAccountBalance(filter)
        .then(function (res) {
            var transfer = false;
            var fromBalance = 0;
            var fromRemainingFreeTransfer = 0;
            var toBalance = 0;
            if (res[0].availableBalance <= filter.amount) {
                return resolve({ error: "Insufficient balance" })
            } else {
                if (res[0].remainingFreeTransfers > 0) {
                    fromBalance = res[0].availableBalance - filter.amount;
                    fromRemainingFreeTransfer = res[0].remainingFreeTransfers - 1;
                    transfer = true;
                } else {
                    if (res[0].availableBalance <= filter.amount+2) {
                        return resolve({ error: "Insufficient balance" })
                    }
                    fromBalance = parseFloat(res[0].availableBalance) - (parseFloat(filter.amount) + 2);
                    transfer = true;
                }
            }
            //updating the fromAccount available balance in the database.
            var accountUpdate = {};
            accountUpdate.fromBalance = fromBalance;
            accountUpdate.fromAccount = filter.fromAccount;
            accountUpdate.fromRemainingFreeTransfer = fromRemainingFreeTransfer
            AccountTable.updatedBalanceForPayer(accountUpdate)
            .then(function (result) {
                //calculating the to balnace and updating the payee account available balance in the database.
                toBalance = parseFloat(res[1].availableBalance) + (parseFloat(filter.amount));
                var toAccountUpdate = {};
                toAccountUpdate.toAccount = request.body.toAccount
                toAccountUpdate.availableBalance = toBalance
                return AccountTable.updatedToBalance(toAccountUpdate);
            })
            .then(function (myresponse) {
                return response.send(res);
            })
            .catch(function (err) {
                console.log(err);
                return response.status(500).send(err);
            });
        })
        .catch(function (err) {
            console.log(err);
            return response.status(500).send(err);
        });
});


var port = 3050;
app.listen(port, function () {
    console.log('Example app listening on port !', port)
});
