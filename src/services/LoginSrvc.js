/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

var randomNumber = require('random-number');

const LoginDao = require('../daos/LoginDao');
const LoginDaoImpl = require('../daosimplements/LoginDaoImpl');
const SetRes = require('../SetRes');
const LoginSrvcImpl = require('./LoginSrvcImpl');
const logger = require('../lib/logger');
const tokens = require('../tokens');

const us = { active: 'Active', blocked: 'Blocked', hold: 'Hold', inactive: 'Inactive' };

const sendLoginOtp = (req, res, callback) => {
  const vndrObj = tokens.decodeApiKey(req.headers.apikey);
  const query = LoginDaoImpl.setLoginQuery(vndrObj.vndrOrg, req.body.userId);
  LoginDao.getUserData(query, (err, uResObj) => {
    if (err) {
      logger.error('Unknown Error at services/LoginSrvc.js - sendLoginOtp:' + err);
      const uke = SetRes.unKnownErr();
      callback(uke);
    } else if (uResObj && uResObj._id) {
      const vr = validateUser(uResObj);
      if (vr.status === '200') {
        callSendOtp(uResObj, res, callback);
      } else {
        callback(vr);
      }
    } else {
      const noData = SetRes.noData();
      callback(noData);
    }
  });
}

const mobVerifyLoginOtp = (req, deviceInfo, res, callback) => {
  const dtData = tokens.kaiaMartTokenDecode(req.headers.kmvcotoken);
  if (!dtData.isExpired) {
    const otpTd = dtData.tokenData;
    mobVrfLoginOtp(otpTd, req.headers.kmvcatoken, req.body.otpNum, res, req.body, deviceInfo, callback);
  } else {
    logger.error('Error at services/LoginSrvc.js - mobVerifyLoginOtp: OTP Token(kmvcotoken) expired, try again');
    callback(SetRes.otpTokenExpired());
  }
}

const createCustsGuest = (body, res, apiKey, deviceInfo, callback) => {
  const vndrObj = tokens.decodeApiKey(apiKey);
  LoginSrvcImpl.createGuestData(vndrObj, res, body, deviceInfo, callback);
}

const sendCustsGstLoginOtp = (reqBody, res, tData, callback) => {
  const otpNumLimit = { min: 1000, max: 9999, integer: true };
  const otpNum = randomNumber(otpNumLimit).toString();
  LoginSrvcImpl.updateGuestUserOtpData(reqBody, tData, otpNum, res, callback);
}

const custsGstVerifyOtp = (req, deviceInfo, res, callback) => {
  const dtData = tokens.kaiaMartTokenDecode(req.headers.kmvcotoken);
  if (!dtData.isExpired) {
    const otpTd = dtData.tokenData;
    mobGuestVrfLoginOtp(otpTd, req.body.otpNum, req.headers.kmvcatoken, req.body, deviceInfo, res, callback);
  } else {
    logger.error('Error at services/LoginSrvc.js - custsGstVerifyOtp: OTP Token(kmvcotoken) expired, try again');
    callback(SetRes.otpTokenExpired());
  }
}

const getCustUsersList = (reqBody, tokenData, callback) => {
  const obj = LoginDaoImpl.getCustUsersList(reqBody, tokenData);
  LoginDao.getCustUsersList(obj, callback);
}

module.exports = {
  sendLoginOtp, mobVerifyLoginOtp, createCustsGuest, sendCustsGstLoginOtp, custsGstVerifyOtp, getCustUsersList
};

const validateUser = (uObj) => {
  if (uObj.uHoda === us.active) {
    return { status: '200' };
  } else if (uObj.uHoda === us.blocked) {
    const bAcc = SetRes.accBlocked();
    return bAcc;
  } else if (uObj.uHoda === us.hold) {
    const hAcc = SetRes.accHold();
    return hAcc;
  } else if (uObj.uHoda === us.inactive) {
    const iaAcc = SetRes.accInactive();
    return iaAcc;
  } else {
    const invd = SetRes.invalid();
    return invd;
  }
}

/**
 * @param {object} uObj object
 * @param {function} callback, is a callback function
 */
const callSendOtp = (uObj, res, callback) => {
  const otpNumLimit = { min: 1000, max: 9999, integer: true };
  const otpNum = randomNumber(otpNumLimit).toString();
  LoginSrvcImpl.updateUserOtpData(uObj, otpNum, res, callback);
};

const mobVrfLoginOtp = (otpTd, kmvcatoken, otpNum, res, reqBody, deviceInfo, callback) => {
  const query = LoginDaoImpl.setOtpVrfQuery(otpTd);
  LoginDao.getUserData(query, (err, uResObj) => {
    if (err) {
      logger.error('Unknown Error at services/LoginSrvc.js - mobVrfLoginOtp:' + err);
      const uke = SetRes.unKnownErr();
      callback(uke);
    } else if (uResObj) {
      const vr = validateUser(uResObj);
      if (vr.status === '200') {
        LoginSrvcImpl.mobVerifyLoginOtp(uResObj, kmvcatoken, otpNum, res, reqBody, deviceInfo, callback);
      } else {
        callback(vr);
      }
    } else {
      const noData = SetRes.noData();
      callback(noData);
    }
  });
}

const mobGuestVrfLoginOtp = (otpTd, otpNum, kmvcatoken, body, deviceInfo, res, callback) => {
  const query = LoginDaoImpl.setOtpVrfQuery(otpTd);
  LoginDao.getCustGstData(query, (err, uResObj) => {
    if (err) {
      logger.error('Unknown Error at services/LoginSrvc.js - mobGuestVrfLoginOtp:' + err);
      const uke = SetRes.unKnownErr();
      callback(uke);
    } else if (uResObj && uResObj._id) {
      LoginSrvcImpl.mobGuestVerifyLoginOtp(uResObj, query, kmvcatoken, otpNum, body, deviceInfo, res, callback);
    } else {
      const noData = SetRes.noData();
      callback(noData);
    }
  });
}
