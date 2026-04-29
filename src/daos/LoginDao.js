/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const CustsUsrs = require('../schemas/CustsUsrs');
const CustsGsts = require('../schemas/CustsGsts');
const CustsGstsSsns = require('../schemas/CustsGstsSsns');
const CustsUsrsInfos = require('../schemas/CustsUsrsInfos');
const SetRes = require('../SetRes');

const getUserData = (query, callback) => {
  CustsUsrs.findOne(query).exec((error, resObj) => callback(error, resObj));
}

const updateUserData = (usrObj, callback) => {
  CustsUsrs.findOneAndUpdate(usrObj.query, {$set: usrObj.updateObj}, { new: true }).exec((error, resObj) => callback(error, resObj));
}

const commonCreateFunc = (createObj, callback) => {
  createObj.save((error, resObj) => callback(error, resObj));
}

const updateCustGuestData = (usrObj, callback) => {
  CustsGsts.findOneAndUpdate(usrObj.query, {$set: usrObj.updateObj}, { new: true }).exec((error, resObj) => callback(error, resObj));
}

const getCustGstData = (query, callback) => {
  CustsGsts.findOne(query).exec((error, resObj) => callback(error, resObj));
}

const getCustGstSsnData = (query, callback) => {
  CustsGstsSsns.findOne(query).exec((error, resObj) => callback(error, resObj));
}

const deleteCustGuest = (obj, callback) => {
  CustsGsts.deleteOne(obj).exec((error, resObj) => callback(error, resObj));
}

const getCustGuestSsnData = (obj, callback) => {
  CustsGstsSsns.findOne(obj).exec((error, resObj) => callback(error, resObj));
}
const deleteCustGuestSession = (obj, callback) => {
  CustsGstsSsns.deleteOne(obj).exec((error, resObj) => callback(error, resObj));
}
const getUserInfoData = (obj, callback) => {
  CustsUsrsInfos.findOne(obj).exec((error, resObj) => callback(error, resObj));
}

const getCustUsersList = (obj, callback) => {
  CustsUsrs.findOne(obj).exec((err, resObj) => {
    if (err) {
      logger.error('Unknown Error in daos/LoginDao.js.js at getCustUsersList: ' + err);
      const errMsg = SetRes.unKnownErr({});
      callback(errMsg);
    } else if (resObj && resObj._id) {
      const resMsg = SetRes.responseData(resObj);
      callback(resMsg);
    } else {
      const noData = SetRes.noData({});
      callback(noData);
    }
  });
}

module.exports = {
  getUserData, updateUserData, commonCreateFunc, updateCustGuestData, getCustGstData, getCustGstSsnData, deleteCustGuest, deleteCustGuestSession, getCustGuestSsnData, getUserInfoData,
  getCustUsersList
};
