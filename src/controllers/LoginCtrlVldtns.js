/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const logger = require('../lib/logger');
const SetRes = require('../SetRes');
const tokenType = 'VO Admin'

const tType = 'VC User'

const sendLoginOtp = (req) => {
  if (!req.headers.apikey) {
    logger.error('controllers/LoginCtrlVldtns.js - sendLoginOtp: API Key is required');
    return { isTrue: false, result: { httpStatus: 400, status: '197', resData: { message: 'API Key is required' } } };
  } else if (!req.body.userId) {
    logger.error('controllers/LoginCtrlVldtns.js - sendLoginOtp: User Id is required');
    return { isTrue: false, result: { httpStatus: 400, status: '197', resData: { message: 'User Id is required' } } };
  } else {
    return { isTrue: true };
  }
}

const mobVerifyLoginOtp = (req) => {
  const reqBody = req.body;
  if (!req.headers.kmvcotoken) {
    logger.error('controllers/LoginCtrlVldtns.js - mobVerifyLoginOtp: kmvcotoken is required');
    return { isTrue: false, result: { httpStatus: 400, status: '192', resData: { message: 'kmvcotoken is required' } } };
  } else if (!reqBody.otpNum || !reqBody.ip || !reqBody.version || !reqBody.country_name || !reqBody.country_code_iso3 || !reqBody.region || !reqBody.region_code || !reqBody.city || !reqBody.cityCode || !reqBody.postal) {
    logger.error('controllers/LoginCtrlVldtns.js - mobVerifyLoginOtp: Provide required field(s) data');
    return { isTrue: false, result: { httpStatus: 400, status: '197', resData: { message: 'Provide required field(s) data' } } }
  } else {
    return { isTrue: true };
  }
}

const createGuests = (req) => {
  const reqBody = req.body;
  if (!reqBody.ip || !reqBody.version || !reqBody.country_name || !reqBody.country_code_iso3 || !reqBody.region || !reqBody.region_code || !reqBody.city || !reqBody.cityCode || !reqBody.postal) {
    logger.error('controllers/LoginCtrlVldtns.js - createGuests: Provide required field(s) data');
    return { isTrue: false, result: { httpStatus: 400, status: '197', resData: { message: 'Provide required field(s) data' } } };
  } else {
    return { isTrue: true };
  }
}

const sendCustsGstsLoginOtp = (req) => {
  if (!req.headers.apikey) {
    logger.error('controllers/LoginCtrlVldtns.js - sendCustsGstsLoginOtp: API Key is required');
    return { isTrue: false, result: { httpStatus: 400, status: '197', resData: { message: 'API Key is required' } } };
  } else if (!req.headers.kmvcatoken) {
    logger.error('controllers/LoginCtrlVldtns.js - sendCustsGstsLoginOtp: kmvcatoken is required');
    return { isTrue: false, result: { httpStatus: 400, status: '192', resData: { message: 'kmvcatoken is required' } } };
  } else if (!req.body.name || !req.body.mobileCode || !req.body.mobileNumber || !req.body.mobileCcNumber || !req.body.name || !req.body.shortName || !req.body.primary || !req.body.primaryType) {
    logger.error('controllers/LoginCtrlVldtns.js - sendCustsGstsLoginOtp: Provide required field(s) data');
    return { isTrue: false, result: { httpStatus: 400, status: '197', resData: { message: 'Provide required field(s) data' } } };
  } else {
    return { isTrue: true };
  }
}
const tknVldn = (tokenData) => {
  if (!tokenData) {
    const it = SetRes.invalidToken();
    return { isTrue: false, result: it };
  } else if (tokenData.isExpired) {
    const te = SetRes.tokenExpired();
    return { isTrue: false, result: te };
  } else if (tokenData.tokenData && tokenData.tokenData.ur !== tType) {
    const ad = SetRes.accessDenied();
    return { isTrue: false, result: ad };
  } else {
    return { isTrue: true };
  }
}

const listValidation = (req) => {
  if (!req.headers.kmvadatoken) {
    const tr = SetRes.tokenRequired();
    return { flag: false, result: tr };
  }  else {
    return { flag: true };
  }
}

const tokenValidation = (tData) => {
  if (!tData) {
    const it = SetRes.tokenInvalid();
    return { flag: false, result: it };
  } else if (tData.isExpired) {
    const te = SetRes.tokenExpired();
    return { flag: false, result: te };
  } else if (tData.tokenData && tData.tokenData.tt !== tokenType) {
    const ad = SetRes.invalidAccess();
    return { flag: false, result: ad };
  } else {
    return { flag: true };
  }
}
module.exports = {
  sendLoginOtp, mobVerifyLoginOtp, createGuests, sendCustsGstsLoginOtp, tknVldn, listValidation, tokenValidation
};
