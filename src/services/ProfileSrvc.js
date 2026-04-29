/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const config = require('config');

const ApiCalls = require('../Apicalls');
const LoginDao = require('../daos/LoginDao');
const LoginDaoImpl = require('../daosimplements/LoginDaoImpl');
const ProfileDao = require('../daos/ProfileDao');
const ProfileDaoImpl = require('../daosimplements/ProfileDaoImpl');
const SetRes = require('../SetRes');

const updateProfileBackgroundPic = (fileLoc, piActualName, pIcon, dtData, cb) => {
  const piPath = config.apiDomain + fileLoc;
  const pObj = ProfileDaoImpl.profilePic(piPath, piActualName, pIcon, dtData.tokenData);
  ProfileDao.updateUserDetails(pObj.query, pObj.updateObj, (upResObj) => {
    if(upResObj.status == '200') {
      const uResObj = upResObj.resData.result;
      setUserResData(uResObj, dtData, cb);
    } else {
      cb(upResObj);
    }
  });
}
const deleteProfileBackgroundPic = (dtData, cb) => {
  const pObj = ProfileDaoImpl.profilePic('', '', '', dtData.tokenData);
  ProfileDao.updateUserDetails(pObj.query, pObj.updateObj, (upResObj) => {
    if(upResObj.status == '200') {
      const uResObj = upResObj.resData.result;
      setUserResData(uResObj, dtData, cb);
    } else {
      cb(upResObj);
    }
  });
}

const updateUserDetails = (reqBody, td, callback) => {
  const pObj = ProfileDaoImpl.updateProfile(reqBody, td.tokenData);
  ProfileDao.updateUserDetails(pObj.query, pObj.updateObj, (upResObj) => {
    if(upResObj.status == '200') {
      const uResObj = upResObj.resData.result;
      setUserResData(uResObj, td, callback);
    } else {
      callback(upResObj);
    }
  });
}

const updateUserInfo = (reqBody, td, kmvcatoken, callback) => {
  if (reqBody.isFOrder == true) {
    const pObj = ProfileDaoImpl.updateUsrInfo(reqBody, td.tokenData);
    ProfileDao.updateUserInfo(pObj.query, pObj.updateObj, (upResObj) => {
      callback(upResObj);
    });
  } else {
    const qry = ProfileDaoImpl.usrId(reqBody);
    ProfileDao.updateUserInfoInc(qry, reqBody, (incResObj) => {
      callback(incResObj);
    });
  }
  ApiCalls.updateFrstOrdr(reqBody, kmvcatoken)
}

module.exports = {updateProfileBackgroundPic, deleteProfileBackgroundPic, updateUserDetails, updateUserInfo};

const setUserResData = (uResObj, td, callback) => {
  const userInfo = LoginDaoImpl.commonfindQuery(uResObj._id, uResObj.vndrOrg, 'info');
  LoginDao.getUserInfoData(userInfo, (err, resObj) => {
    const custsUserData = LoginDaoImpl.setUserResData(uResObj);
    const user = { ...custsUserData, info: resObj };
    ApiCalls.getCartData(uResObj, td.kmvcatoken, (cartRes) => {
      ApiCalls.getAdressData(td.kmvcatoken, (adressRes) => {
        const data = { user, cart: cartRes.result.cartData, cartItems: cartRes.result.cartItemsData, address: adressRes.result }
        const resData = SetRes.successResponse(data);
        callback(resData);
      });
    });
  });
}
