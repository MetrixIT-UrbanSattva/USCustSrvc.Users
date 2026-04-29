/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

var config = require('config');
var jwt = require('jsonwebtoken');
var moment = require('moment');

'use strict';
var crypto = require('crypto');

var logger = require('./lib/logger');

const ENCRYPTION_KEY = config.criptoEncryptKey; // process.env.ENCRYPTION_KEY; // Must be 256 bits (32 characters)
const IV_LENGTH = 16; // For AES, this is always 16
const userType = 'VC User';

const decodeApiKey = (apiKey) => {
  const voStr = decrypt(apiKey);
  const vndrObj = voStr ? JSON.parse(voStr) : {};
  return vndrObj;
}

// --- Begin: kaiaMartTokenGeneration: Mobile Token Generation Code
const kaiaMartTokenGeneration = (usrObj, res, tokenType, sObj, soCount) => {
  try {
    const exp = (tokenType === 'Mobile') ? moment().add(config.mobSessionExpire, config.mobSessionExpireType).valueOf() : (moment().add(config.webSessionExpire, config.webSessionExpireType).valueOf());
    const aSsn = moment().add(config.accessSsnExpire, config.accessSsnExpireType).valueOf();
    const payload = {
      iss: usrObj._id,
      uid: usrObj.refUID,
      mp: usrObj.myPrimary,
      mpt: usrObj.myPrimaryType,
      mpv: usrObj.myPrimaryVerifyFlag,
      pn: usrObj.pName || '',
      mn: usrObj.mobCcNum || '',
      eid: usrObj.emID || '',
      vid: usrObj.vndrOrg,
      voc: usrObj.voCode,
      von: usrObj.voName,
      ur: userType,
      tt: tokenType,
      ust: sObj.usType,
      sid: sObj._id,
      asn: aSsn,
      uso: soCount > 0,
      exp
    };

    const jwtToken = jwt.sign(payload, config.jwtSecretKey);
    const token = encrypt(jwtToken);
    res.header('kmvcatoken', token);
    return token;
  } catch(error) {
    logger.error('src/tokens.js - kaiaMartTokenGeneration: Un-Known Error: ' + error);
    return null;
  }
}
// --- End: kaiaMartTokenGeneration: Mobile Token Generation Code

/**
 * Begin: kaiaMartRefreshToken
 * @param {string} reqToken string
 * @param {object} res
 * @return {function} callback function
 */
const kaiaMartRefreshToken = (reqToken, res) => {
  try {
    const currentDtNum = moment().valueOf();
    const jwtToken = decrypt(reqToken);
    const tokenData = jwt.verify(jwtToken, config.jwtSecretKey);
    const exp = (tokenData.tt === 'Mobile') ? moment().add(config.mobSessionExpire, config.mobSessionExpireType).valueOf() : (moment().add(config.webSessionExpire, config.webSessionExpireType).valueOf());
    const asn = currentDtNum > tokenData.asn ? moment().add(config.accessSsnExpire, config.accessSsnExpireType).valueOf() : tokenData.asn;
    if(tokenData.exp >= currentDtNum) {
      const payload = {
        iss: tokenData.iss,
        uid: tokenData.uid,
        mp: tokenData.mp,
        mpt: tokenData.mpt,
        mpv: tokenData.mpv,
        pn: tokenData.pn,
        mn: tokenData.mn,
        eid: tokenData.eid,
        vid: tokenData.vid,
        voc: tokenData.voc,
        von: tokenData.von,
        ur: tokenData.ur,
        tt: tokenData.tt,
        ust: tokenData.ust,
        sid: tokenData.sid,
        uso: tokenData.uso,
        asn, exp
      };

      const jwtNewToken = jwt.sign(payload, config.jwtSecretKey);
      const token = encrypt(jwtNewToken);
      res.header('kmvcatoken', token);
      return {tokenData, isExpired: false, kmvcatoken: token};
    } else {
      res.header('kmvcatoken', reqToken);
      return {tokenData, isExpired: true, kmvcatoken: reqToken};
    }
  } catch(error) {
    logger.error('src/tokens.js - kaiaMartRefreshToken: Un-Known Error: ' + error);
    return null;
  }
}
// --- End: kaiaMartRefreshToken

// --- Begin: otpTokenGeneration
const otpTokenGeneration = (usrObj, otpType, res) => {
  try {
    const exp = moment().add(config.otpSessionExpire, config.otpSessionExpireType).valueOf();
    const payload = {
      iss: usrObj._id,
      mn: usrObj.mobCcNum || '',
      mp: usrObj.myPrimary,
      eid: usrObj.emID || '',
      uid: usrObj.refUID,
      pn: usrObj.pName || '',
      vid: usrObj.vndrOrg,
      voc: usrObj.voCode,
      von: usrObj.voName,
      ur: userType,
      ot: otpType,
      exp
    };

    const jwtToken = jwt.sign(payload, config.jwtSecretKey);
    const token = encrypt(jwtToken);
    res.header('kmvcotoken', token);
    return token;
  } catch(error) {
    logger.error('src/tokens.js - otpTokenGeneration: Un-Known Error: ' + error);
    return null;
  }
}
// --- End: otpTokenGeneration

// --- Begin: kaiaMartTokenDecode
const kaiaMartTokenDecode = (reqToken) => {
  try {
    const currentDtNum = moment().valueOf();
    const jwtToken = decrypt(reqToken);
    const tokenData = jwt.decode(jwtToken, config.jwtSecretKey);
    if(tokenData.exp >= currentDtNum) {
      return {tokenData, isExpired: false};
    } else {
      return {tokenData, isExpired: true};
    }
  } catch(error) {
    logger.error('src/tokens.js - kaiaMartTokenDecode: Un-Known Error: ' + error);
    return null;
  }
}
// --- End: kaiaMartTokenDecode

// --- Begin: accessTokenValidation
const accessTokenValidation = (reqToken, res, tokenType, callback) => {
  try {
    if(reqToken) {
      const tokenObj = kaiaMartRefreshToken(reqToken, res, tokenType);
      if (tokenObj && !tokenObj.isExpired) {
        callback({httpStatus: 200, status: '200', tokenData: tokenObj.tokenData});
      } else if (tokenObj && tokenObj.isExpired) {
        logger.error('src/tokens.js - accessTokenValidation: Error: Access token has been expired');
        callback({httpStatus: 400, status: '190', tokenData: {}});
      } else {
        logger.error('src/tokens.js - accessTokenValidation: Error: Access token decode failed');
        callback({httpStatus: 400, status: '191', tokenData: {}});
      }
    } else {
      logger.error('src/tokens.js - accessTokenValidation: Error: Access token is required');
      callback({httpStatus: 400, status: '192', tokenData: {}});
    }
  } catch(error) {
    logger.error('src/tokens.js - accessTokenValidation: Un-Known Error: ' + error);
    callback({httpStatus: 500, status: '199', tokenData: {}});
  }
}
// --- End: accessTokenValidation

/**
 * @param {string} text string
 * @return {string}
 */
const encrypt = (text) => {
  let iv = crypto.randomBytes(IV_LENGTH);
  let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text);

  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

/**
 * @param {string} text string
 * @return {string}
 */
const decrypt = (text) => {
  let textParts = text.split(':');
  let iv = Buffer.from(textParts.shift(), 'hex');
  let encryptedText = Buffer.from(textParts.join(':'), 'hex');
  let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let decrypted = decipher.update(encryptedText);

  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

module.exports = {
  decodeApiKey, kaiaMartTokenGeneration, kaiaMartRefreshToken,
  otpTokenGeneration, kaiaMartTokenDecode, accessTokenValidation,

  decrypt, encrypt
}
