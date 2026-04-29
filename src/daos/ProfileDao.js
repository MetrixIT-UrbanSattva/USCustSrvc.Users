/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const CustsUsrs = require('../schemas/CustsUsrs');
const CustsUsrsInfos = require('../schemas/CustsUsrsInfos');
const SetRes = require('../SetRes');
const logger = require('../lib/logger');

const updateUserDetails = (query, updateObj, callback) => {
  CustsUsrs.findOneAndUpdate(query, { $set: updateObj }, { new: true }).exec((error, resObj) => {
    if (error) {
      logger.error('Unknown Error in daos/ProfileDao.js at updateUserDetails:' + error);
      const errMsg = SetRes.unKnownErr({});
      callback(errMsg);
    } else if (resObj && resObj._id) {
      const resMsg = SetRes.successResponse(resObj);
      callback(resMsg);
    } else {
      const uf = SetRes.updateTxFail();
      callback(uf);
    }
  });
}

const updateUserInfo = (query, updateObj, callback) => {
  CustsUsrsInfos.findOneAndUpdate(query, { $set: updateObj}, { new: true }).exec((error, resObj) => {
    if (error) {
      logger.error('Unknown Error in daos/ProfileDao.js at updateUserInfo:' + error);
      const errMsg = SetRes.unKnownErr({});
      callback(errMsg);
    } else if (resObj && resObj._id) {
      const resMsg = SetRes.successResponse(resObj);
      callback(resMsg);
    } else {
      const uf = SetRes.updateTxFail();
      callback(uf);
    }
  });
}

const updateUserInfoInc = (query, reqBody, callback) => {
  CustsUsrsInfos.findOneAndUpdate(query, {$inc: { soCount: reqBody.soCount, sogCount: reqBody.sogCount, soiCount: reqBody.soiCount, sogActCount: reqBody.sogActCount} }, { new: true }).exec((error, resObj) => {
    if (error) {
      logger.error('Unknown Error in daos/ProfileDao.js at updateUserInfo:' + error);
      const errMsg = SetRes.unKnownErr({});
      callback(errMsg);
    } else if (resObj && resObj._id) {
      const resMsg = SetRes.successResponse(resObj);
      callback(resMsg);
    } else {
      const uf = SetRes.updateTxFail();
      callback(uf);
    }
  });
}

module.exports = {updateUserDetails, updateUserInfo, updateUserInfoInc};
