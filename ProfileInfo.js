var collectionName = "ProfileInfo";
var dbManager = require("./DBManager.js");
var Promise = require("bluebird");

function ProfileInfo() {
}

//Account validation for otp and mobile number
ProfileInfo.prototype.validateAccount = function (filter) {
    return new Promise(function(resolve, reject){
        dbManager.getConnection(function (db) {
            db.collection(collectionName).find({
                mobileNumber: {$regex : new RegExp(filter.mobileNumber, "i") },
                otp : filter.otp
            })
            .toArray(function(err, res){
                console.log(res);
                if(err){
                    return reject(err);
                }
                if(res.length>0){
                    return resolve(res)
                }else{
                    return resolve({error:"Wrong mobile number or otp"})
                }
            });
        });
    });
}

module.exports = {
    getInst: function () {
        return new ProfileInfo();
    }
}