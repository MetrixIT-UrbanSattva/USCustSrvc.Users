/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const LoginCtrlVldtns = require('./LoginCtrlVldtns');
const LoginSrvc = require('../services/LoginSrvc');
const SetRes = require('../SetRes');
const tokens = require('../tokens');
const util = require('../lib/util');

const apiServerStatus = (req, res) => {
  const resObj = SetRes.apiServerStatus();
  util.sendApiResponse(res, resObj);
}
const sendLoginOtp = (req, res) => {
  const vldRes = LoginCtrlVldtns.sendLoginOtp(req);
  if(vldRes.isTrue) {
    LoginSrvc.sendLoginOtp(req, res, (resObj) => {
      util.sendApiResponse(res, resObj);
    });
  } else {
    util.sendApiResponse(res, vldRes.result);
  }
}

// ---------------------- BEGIN: Mobile Login APIs ---------------------- //
const mobVerifyLoginOtp = (req, res) => {
  const vldRes = LoginCtrlVldtns.mobVerifyLoginOtp(req);
  const deviceInfo = JSON.parse(req.headers.kmvcuiinfo);
  if(vldRes.isTrue) {
    LoginSrvc.mobVerifyLoginOtp(req, deviceInfo, res, (resObj) => {
      util.sendApiResponse(res, resObj);
    });
  } else {
    util.sendApiResponse(res, vldRes.result);
  }
}

const custsUsersList = (req, res, next) => {
  const listValidation = LoginCtrlVldtns.listValidation(req);
  if (listValidation.flag) {
    const decodedData = tokens.kaiaMartRefreshToken(req.headers.kmvadatoken, res);
    const tokenValidation = LoginCtrlVldtns.tokenValidation(decodedData);
    if (tokenValidation.flag) {
      LoginSrvc.getCustUsersList(req.body, decodedData.tokenData, (resObj) => {
        util.sendApiResponse(res, resObj);
      });
    } else {
      const tokenRes = tokenValidation.result;
      util.sendApiResponse(res, tokenRes);
    }
  } else {
    const reqRes = listValidation.result;
    util.sendApiResponse(res, reqRes);
  }
}

// ---------------------- END: Mobile Login APIs ---------------------- //

const createCustsGuest = (req, res) => {
  const vldRes = LoginCtrlVldtns.createGuests(req);
  const deviceInfo = JSON.parse(req.headers.kmvcuiinfo);
  if (vldRes.isTrue) {
    LoginSrvc.createCustsGuest(req.body, res, req.headers.apikey, deviceInfo, (resObj) => {
      util.sendApiResponse(res, resObj);
    });
  } else {
    util.sendApiResponse(res, vldRes.result);
  }
}

const sendCustsGstLoginOtp = (req, res) => {
  const vldRes = LoginCtrlVldtns.sendCustsGstsLoginOtp(req);
  if (vldRes.isTrue) {
    const tData = tokens.kaiaMartRefreshToken(req.headers.kmvcatoken, res);
    const tknVldn = LoginCtrlVldtns.tknVldn(tData);
    if (tknVldn.isTrue) {
      LoginSrvc.sendCustsGstLoginOtp(req.body, res, tData.tokenData, (resObj) => {
        util.sendApiResponse(res, resObj);
      });
    } else {
      util.sendApiResponse(res, tknVldn.result);
    }
  } else {
    util.sendApiResponse(res, vldRes.result);
  }
}

const custsGstVerifyOtp = (req, res) => {
  const vldRes = LoginCtrlVldtns.mobVerifyLoginOtp(req);
  if (vldRes.isTrue) {
    const tData = tokens.kaiaMartRefreshToken(req.headers.kmvcatoken, res);
    const tknVldn = LoginCtrlVldtns.tknVldn(tData);
    const deviceInfo = JSON.parse(req.headers.kmvcuiinfo);
    if (tknVldn.isTrue) {
      LoginSrvc.custsGstVerifyOtp(req, deviceInfo, res, (resObj) => {
        util.sendApiResponse(res, resObj);
      });
    } else {
      util.sendApiResponse(res, tknVldn.result);
    }
  } else {
    util.sendApiResponse(res, vldRes.result);
  }
}

// ---------------------- BEGIN: Web Login APIs ---------------------- //
// const webVerifyLoginOtp = (req, res) => {
//   util.sendApiResponse(res, {});
// }
// ---------------------- END: Web Login APIs ---------------------- //

module.exports = {
  apiServerStatus,
  sendLoginOtp, mobVerifyLoginOtp, custsUsersList,

  createCustsGuest, sendCustsGstLoginOtp, custsGstVerifyOtp,
}
