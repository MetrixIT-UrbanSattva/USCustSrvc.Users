/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

var config = require('config');

const CommonSrvc = require('./CommonSrvc');
const LoginDao = require('../daos/LoginDao');
const LoginDaoImpl = require('../daosimplements/LoginDaoImpl');
const SetRes = require('../SetRes');
// const SendSms = require('../SendSms');
const logger = require('../lib/logger');
const tokens = require('../tokens');
const ApiCalls = require('../Apicalls');
const CustsGsts = require('../schemas/CustsGsts');
const CustsGstsSsns = require('../schemas/CustsGstsSsns');
const CustsUsrs = require('../schemas/CustsUsrs');
const CustsUsrsInfos = require('../schemas/CustsUsrsInfos');
const CustsUsrsSsns = require('../schemas/CustsUsrsSsns');
const CustsGstsClsd = require('../schemas/CustsGstsClsd');
const CustsGstsSsnsClsd = require('../schemas/CustsGstsSsnsClsd');

const ot = { login: 'Login', signup: 'Signup' };
const tt = { mob: 'Mobile', web: 'Web' };

const updateUserOtpData = (uObj, otpNum, res, callback) => {
  const salt = CommonSrvc.genSalt(config.mySaltLen);
  const otpObj = CommonSrvc.encryptStr(otpNum, salt);
  const uOtpObj = LoginDaoImpl.setUserOtpObj(uObj, otpObj);
  LoginDao.updateUserData(uOtpObj, (err, uResObj) => {
    if (err) {
      logger.error('Unknown Error at services/LoginSrvcImpl.js - updateUserOtpData:' + err);
      const uke = SetRes.unKnownErr();
      callback(uke);
    } else if (uResObj) {
      sendOtp(uResObj, otpNum, ot.login, res, callback);
    } else {
      const updateFail = SetRes.updateFail();
      callback(updateFail);
    }
  });
}

const mobVerifyLoginOtp = (uResObj, kmvcatoken, otpNum, res, body, deviceInfo, callback) => {
  const tData = tokens.kaiaMartRefreshToken(kmvcatoken, res);
  const query = LoginDaoImpl.setOtpVrfQuery(tData.tokenData);
  const otpObj = CommonSrvc.encryptStr(otpNum, uResObj.otpLav);
  if (uResObj.otp === otpObj.strHash) {
    deleteCustomerGuest(uResObj, tData.tokenData, query, kmvcatoken, body, deviceInfo, res, callback, 'old user');
  } else {
    const invOtp = SetRes.invalidOtp();
    callback(invOtp);
  }
}

const createGuestData = (vndrObj, res, body, deviceInfo, callback) => {
  const createObj = LoginDaoImpl.custsGuestCreateObj(body, vndrObj);
  const createData = new CustsGsts(createObj);
  LoginDao.commonCreateFunc(createData, (err, resObj) => {
    if (err) {
      logger.error('Unknown Error at services/LoginSrvcImpl.js - createGuestData:' + err);
      const uke = SetRes.unKnownErr();
      callback(uke);
    } else if (resObj && resObj._id) {
      const csData = LoginDaoImpl.custGstSsnCreateObj(body, resObj, deviceInfo);
      const atoken = tokens.kaiaMartTokenGeneration(resObj, res, tt.mob, { ...csData, usType: 'Guest' }, 0);
      const custSession = { ...csData, atoken };
      setGuestSession(custSession, resObj, atoken, callback);
    } else {
      const sF = SetRes.saveFailed();
      callback(sF);
    }
  })
}

const updateGuestUserOtpData = (reqBody, tData, otpNum, res, callback) => {
  const salt = CommonSrvc.genSalt(config.mySaltLen);
  const otpObj = CommonSrvc.encryptStr(otpNum, salt);
  const uOtpObj = LoginDaoImpl.setCustsGuestUserOtpObj(tData, otpObj, reqBody);
  LoginDao.updateCustGuestData(uOtpObj, (err, uResObj) => {
    if (err) {
      logger.error('Unknown Error at services/LoginSrvcImpl.js - updateGuestUserOtpData:' + err);
      const uke = SetRes.unKnownErr();
      callback(uke);
    } else if (uResObj && uResObj._id) {
      sendOtp(uResObj, otpNum, ot.signup, res, callback);
    } else {
      const updateFail = SetRes.updateFail();
      callback(updateFail);
    }
  });
}

const mobGuestVerifyLoginOtp = (uResObj, query, kmvcatoken, otpNum, body, deviceInfo, res, callback) => {
  const otpObj = CommonSrvc.encryptStr(otpNum, uResObj.otpLav);
  if (uResObj.otp === otpObj.strHash) {
    deleteCustomerGuest(uResObj, '', query, kmvcatoken, body, deviceInfo, res, callback, 'new user')
  } else {
    const invOtp = SetRes.invalidOtp();
    callback(invOtp);
  }
}
module.exports = {
  updateUserOtpData,
  mobVerifyLoginOtp,
  createGuestData,
  updateGuestUserOtpData,
  mobGuestVerifyLoginOtp
};

const sendOtp = (uResObj, otpNum, otpType, res, callback) => {
  const otpToken = tokens.otpTokenGeneration(uResObj, otpType, res);
  if (otpToken) {
    const mp = uResObj.myPrimary;
    console.log(mp, '===Login otpNumber:', otpNum);
    const resObj = SetRes.otpSentSuc(otpNum);
    callback(resObj);
  } else {
    const uke = SetRes.unKnownErr();
    callback(uke);
  }
};
const deleteCustomerGuest = (uResObj, tData, query, kmvcatoken, body, deviceInfo, res, callback, value) => {
  LoginDao.deleteCustGuest(query, (err, uResObj1) => {
    if (err) {
      logger.error('Unknown Error at services/LoginSrvcImpl.js - deleteCustGuest:' + err);
      const uke = SetRes.unKnownErr();
      callback(uke);
    } else if (uResObj1 && uResObj1.deletedCount > 0) {
      const clsdGuestObj = LoginDaoImpl.custGuestClosed(uResObj);
      const clsdGuest = new CustsGstsClsd(clsdGuestObj);
      clsdGuest.save();
      getCustGuestSession(uResObj, tData, kmvcatoken, body, deviceInfo, res, callback, value);
    } else {
      const deleteFail = SetRes.deleteFail();
      callback(deleteFail);
    }
  })
}

const getCustGuestSession = (uResObj, tData, guestToken, body, deviceInfo, res, callback, value) => {
  const id = value == 'old user' ? tData.iss : uResObj._id;
  const query = LoginDaoImpl.guestSessionFindQuery(id);
  LoginDao.getCustGuestSsnData(query, (err, uResObj1) => {
    if (err) {
      logger.error('Unknown Error at services/LoginSrvcImpl.js - deleteCustGuest:' + err);
      const uke = SetRes.unKnownErr();
      callback(uke);
    } else if (uResObj1 && uResObj1._id) {
      deleteCustGuestSession(uResObj, guestToken, uResObj1, query, body, deviceInfo, res, callback, value);
    } else {
      const noData = SetRes.noData();
      callback(noData);
    }
  })
}

const deleteCustGuestSession = (uResObj, guestToken, guestSsnRes, query, body, deviceInfo, res, callback, value) => {
  LoginDao.deleteCustGuestSession(query, (err, uResObj1) => {
    if (err) {
      logger.error('Unknown Error at services/LoginSrvcImpl.js - deleteCustGuest:' + err);
      const uke = SetRes.unKnownErr();
      callback(uke);
    } else if (uResObj1 && uResObj1.deletedCount > 0) {
      const clsdGuestObj = LoginDaoImpl.custGuestSsnClosed(guestSsnRes);
      const clsdGuest = new CustsGstsSsnsClsd(clsdGuestObj);
      clsdGuest.save();
      value == 'new user' ? createUser(uResObj, guestToken, body, deviceInfo, res, callback) :  getUserInfoData(uResObj, guestToken, body, deviceInfo, res, callback);
    } else {
      const deleteFail = SetRes.deleteFail();
      callback(deleteFail);
    }
  })
}

const createUser = (resObj, guestToken, body, deviceInfo, res, callback) => {
  const userObj = LoginDaoImpl.setUserData(resObj)
  const userData = new CustsUsrs(userObj)
  LoginDao.commonCreateFunc(userData, (err, uResObj) => {
    if (err) {
      logger.error('Unknown Error at services/LoginSrvcImpl.js - (createUser):' + err);
      const uke = SetRes.unKnownErr();
      callback(uke);
    } else if (uResObj) {
      const csData = LoginDaoImpl.custUserSsnCreateObj(uResObj, body, deviceInfo);
      const atoken = tokens.kaiaMartTokenGeneration(uResObj, res, tt.mob, { ...csData, usType: 'User' }, 0);
      const custSession = { ...csData, atoken };
      setUserSession(custSession, guestToken, uResObj, body, atoken, {}, callback, 'new user');
    } else {
      const saveF = SetRes.saveFailed();
      callback(saveF);
    }
  });
}
const setUserSession = (custSession, guestToken, userObj, body, atoken, userInfo, callback, value) => {
  const csObj = new CustsUsrsSsns(custSession);
  LoginDao.commonCreateFunc(csObj, (err, resObj) => {
    if (err) {
      logger.error('Unknown Error at services/LoginSrvcImpl.js - setUserSession(createUser):' + err);
      const uke = SetRes.unKnownErr();
      callback(uke);
    } else if (resObj && resObj._id) {
      value == 'new user' ? setUserInfoData(userObj, body, atoken, callback) : getUserData(guestToken, userObj, atoken, userInfo, callback);
    } else {
      const sF = SetRes.saveFailed();
      callback(sF);
    }
  });
};

const getUserData = (guestToken, uResObj, accessToken, userInfo, callback) => {
  const custsUserData = LoginDaoImpl.setUserResData(uResObj);
  const user = { ...custsUserData, info: userInfo };
  ApiCalls.updateCartItemsData(guestToken, uResObj, (resObj) => {
    ApiCalls.getCartData(uResObj, accessToken, (cartRes) => {
      ApiCalls.getAdressData(accessToken, (adressRes) => {
        const data = { user, cart: cartRes.result.cartData, cartItems: cartRes.result.cartItemsData, address: adressRes.result }
        const resData = SetRes.successResponse(data);
        callback(resData);
      })
    });
  });
}

const setUserInfoData = (userObj, body, atoken, callback) => {
  const userInfoObj = LoginDaoImpl.setUserInfoData(userObj);
  const userInfo = new CustsUsrsInfos(userInfoObj);
  LoginDao.commonCreateFunc(userInfo, (err, resObj) => {
    if (err) {
      logger.error('Unknown Error at services/LoginSrvcImpl.js - setUserInfoData(createUser):' + err);
      const uke = SetRes.unKnownErr();
      callback(uke);
    } else if (resObj && resObj._id) {
      const custsUserData = LoginDaoImpl.setUserResData(userObj);
      const user = { ...custsUserData, info: resObj };
      ApiCalls.updateCartData(userObj, atoken, (resObj1) => {
        ApiCalls.getCartData(resObj, atoken, (cartRes) => {
          ApiCalls.createAdress(userObj, body, atoken, (adressRes) => {
            const data = { user, cart: cartRes.result.cartData, cartItems: cartRes.result.cartItemsData, address: [adressRes.result] }
            const resData = SetRes.successResponse(data);
            callback(resData);
            ApiCalls.createUser(userObj, userInfo, atoken, (resObj2) => {
              ApiCalls.createAdminAdress(adressRes.result, atoken);
            });
          })
        });
      });
    } else {
      const sF = SetRes.saveFailed();
      callback(sF);
    }
  });
}


const getUserInfoData = (uResObj, guestToken, body, deviceInfo, res, callback) => {
  const userInfo = LoginDaoImpl.commonfindQuery(uResObj._id, uResObj.vndrOrg, "info");
  LoginDao.getUserInfoData(userInfo, (err, resObj) => {
    if (err) {
      logger.error('Unknown Error at services/LoginSrvcImpl.js - getUserInfoData(createGuestData):' + err);
      const uke = SetRes.unKnownErr();
      callback(uke);
    } else if (resObj && resObj._id) {
      setSessionData(uResObj, guestToken, body, deviceInfo, res, resObj, callback);
    } else {
      const sF = SetRes.noData();
      callback(sF);
    }
  });
}

const setSessionData = (uResObj, guestToken, body, deviceInfo, res, userInfo, callback) => {
  const csData = LoginDaoImpl.custUserSsnCreateObj(uResObj, body, deviceInfo);
  const soCount = userInfo.soCount;
  const atoken = tokens.kaiaMartTokenGeneration(uResObj, res, tt.mob, { ...csData, usType: 'User' }, soCount);
  const custSession = { ...csData, atoken };
  setUserSession(custSession, guestToken, uResObj, body, atoken, userInfo, callback, 'old user');
}

const setGuestSession = (custSession, guestObj, atoken, callback) => {
  const csObj = new CustsGstsSsns(custSession);
  LoginDao.commonCreateFunc(csObj, (err, resObj) => {
    if (err) {
      logger.error('Unknown Error at services/LoginSrvcImpl.js - setGuestSession(createGuestData):' + err);
      const uke = SetRes.unKnownErr();
      callback(uke);
    } else if (resObj && resObj._id) {
      const custsGuestData = LoginDaoImpl.setCustGuestData(guestObj);
      const user = { ...custsGuestData, info: {} };
      ApiCalls.createCart(guestObj, atoken, (cartRes) => {
        const data = { user, cart: cartRes.result, cartItems: [], address: [] };
        const resData = SetRes.successResponse(data);
        callback(resData);
      });
    } else {
      const sF = SetRes.saveFailed();
      callback(sF);
    }
  });
}

