/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const CommonSrvc = require('../services/CommonSrvc');
var moment = require('moment');
var { v4: uuidv4 } = require('uuid');

const userType = 'VC User';
const user = 'App Owner';
const userId = 'KMVAADMNUID0001';
const userName = 'Super Admin';
const status = 'Active';

const setLoginQuery = (vndrOrg, myPrimary) => {
  return { vndrOrg, myPrimary, delFlag: false };
}
const setUserOtpObj = (uObj, otpObj) => {
  const currUTCObj = CommonSrvc.currUTCObj();
  const updateObj = {
    otp: otpObj.strHash,
    otpLav: otpObj.salt,

    uuRakam: userType,
    uUser: uObj._id,
    uUserName: uObj.pName || 'NA',
    uDtStr: currUTCObj.currUTCDtTmStr,
    uDtNum: currUTCObj.currUTCDtTmNum
  };
  const query = { _id: uObj._id };

  return { query, updateObj };
}

const setOtpVrfQuery = (otpTd) => {
  return { vndrOrg: otpTd.vid, _id: otpTd.iss, delFlag: false };
}

const setUserResData = (uResObj) => {
  const userResObj = setUserResponseData(uResObj);
  return userResObj;
}

const custsGuestCreateObj = (body, vndrData) => {
  const obj = createCustsGuestData(body, vndrData);
  return obj;
}
const custGstSsnCreateObj = (body, resObj, deviceData) => {
  const obj = createSsnData(body, resObj, deviceData);
  return { ...obj, gid: resObj._id };
}

const setCustsGuestUserOtpObj = (tData, otpObj, reqBody) => {
  const currUTCObj = CommonSrvc.currUTCObj();
  const updateObj = {

    otp: otpObj.strHash,
    otpLav: otpObj.salt,

    pName: reqBody.name,
    mName: reqBody.shortName,
    mobCc: reqBody.mobileCode,
    mobNum: reqBody.mobileNumber,
    mobCcNum: reqBody.mobileCcNumber,
    emID: reqBody.emailId || '',
    myPrimary: reqBody.primary,
    mpType: reqBody.primaryType,

    cuRakam: user,
    cUser: userId,
    cUserName: userName,
    uDtStr: currUTCObj.currUTCDtTmStr,
    uDtNum: currUTCObj.currUTCDtTmNum
  };
  const query = { _id: tData.iss };

  return { query, updateObj };
}

const commonfindQuery = (id, vndrOrg, value) => {
  const uHoda = value == 'info' ? {uHoda: status} : {};
  return { delFlag: false, ...uHoda, _id: id, vndrOrg };
}
const setCustGuestData = (res) => {
  const userResObj = setGuestUserResponseData(res);
  return userResObj;
}

const guestSessionFindQuery = (id) => {
  return { delFlag: false, gid: id }
}
const custGuestClosed = (uResObj) => {
  const obj = createCustGuestClosed(uResObj);
  return obj;
}

const custGuestSsnClosed = (uResObj) => {
  const obj = createCustGuestSsnClosed(uResObj);
  return obj;
}
const setUserData = (resObj) => {
  const obj = createUserData(resObj);
  const refUID = generateRefuid(resObj);
  return { ...obj, _id: resObj._id, refUID }
}

const setUserInfoData = (resObj) => {
  const obj = createUserData(resObj);
  return { ...obj, _id: resObj._id, uid: resObj._id, refUID: resObj.refUID }
}

const custUserSsnCreateObj = (uResObj, body, deviceInfo) => {
  const obj = createSsnData(body, uResObj, deviceInfo);
  return { ...obj, uid: uResObj._id, uHoda: uResObj.uHoda };
}

const getCustUsersList = (reqBody, tokenData) => {
return { _id: reqBody._id, delFlag: false }
}

module.exports = {
  setLoginQuery, setUserOtpObj, getCustUsersList,
  setOtpVrfQuery, setUserResData,/* custGstSsnQuery, */
  custsGuestCreateObj, custGstSsnCreateObj, setCustsGuestUserOtpObj,
  commonfindQuery, setCustGuestData, guestSessionFindQuery,
  setUserData, setUserInfoData,
  custUserSsnCreateObj, custGuestClosed, custGuestSsnClosed
};

// ----------- Start Sub Functions ------------------ //
const setUserResponseData = (uResObj) => {
  return {
    createdBy: uResObj.idSeq ? uResObj.idSeq.seq : '',

    fullName: uResObj.pName || '',
    displayName: uResObj.mName || '',
    mobCc: uResObj.mobCc || '',
    mobNum: uResObj.mobNum || '',
    emID: uResObj.emID || '',
    userId: uResObj.refUID,
    primary: uResObj.mpType,
    primaryVerified: uResObj.mpVerifyFlag,
    altMobCc: uResObj.altMobCc || '',
    altMobNum: uResObj.altMobNum || '',
    altEmID: uResObj.altEmID || '',
    dob: uResObj.ptRoju || '',
    gender: uResObj.lingam || '',
    cartId: uResObj.cart || '',

    mobPushNotifTokens: uResObj.mdTokens || [],
    webPushNotifTokens: uResObj.wdTokens || [],

    ppPath: uResObj.piPath || '',
    ppName: uResObj.pIcon || '',
    ppDisplay: uResObj.piActualName || '',
    bgppPath: uResObj.bgPicPath || '',
    bgppName: uResObj.bgPic || '',
    bgPicDisplay: uResObj.bgPicActualName || ''
  };
}

const createCustsGuestData = (body, vndrData) => {
  let desamCode = body.country_code_iso3, rastrCode = body.region_code;
  let year = moment().year(), month = moment().month(), day = moment().day();
  const seq = desamCode + rastrCode + body.cityCode + year + month + day;
  const currentUTC = CommonSrvc.currUTCObj();
  const _id = uuidv4();
  return {
    _id, cart: _id,
    idSeq: {
      seq, desamCode, rastrCode,
      jillaCode: body.cityCode,
      pincode: body.postal,
      year, month, day
    },

    vndrOrg: vndrData.vndrOrg,
    voName: vndrData.voName,
    voCode: vndrData.voCode,

    mdTokens: body.mdTokens || [],
    wdTokens: body.wdTokens || [],

    cuRakam: user,
    cUser: userId,
    cUserName: userName,
    cDtStr: currentUTC.currUTCDtTmStr,
    cDtNum: currentUTC.currUTCDtTmNum,
    uuRakam: user,
    uUser: userId,
    uUserName: userName,
    uDtStr: currentUTC.currUTCDtTmStr,
    uDtNum: currentUTC.currUTCDtTmNum
  };
}
const createSsnData = (body, resData, deviceData) => {
  return {
    _id: uuidv4(),

    vndrOrg: resData.vndrOrg,
    voName: resData.voName,
    voCode: resData.voCode,

    at: 'Mobile App',
    dt: deviceData.deviceType,
    dos: deviceData.osName,
    duId: deviceData.deviceUniqueId || '',
    ma: deviceData.macAddress || '',
    ipa: body.ip,
    ipv: body.version,
    bn: deviceData.browserName,
    bv: deviceData.browserVersion,
    ua: deviceData.ua,
    ip: body,

    cuRakam: resData.cuRakam,
    cUser: resData.cUser,
    cUserName: resData.cUserName,
    cDtStr: resData.cDtStr,
    cDtNum: resData.cDtNum,
    uuRakam: resData.uuRakam,
    uUser: resData.uUser,
    uUserName: resData.uUserName,
    uDtStr: resData.uDtStr,
    uDtNum: resData.uDtNum
  };
}

const setGuestUserResponseData = (uResObj) => {
  return {
    createdBy: uResObj.idSeq ? uResObj.idSeq.seq : '',

    cartId: uResObj.cart,
    mobPushNotifTokens: uResObj.mdTokens || [],
    webPushNotifTokens: uResObj.wdTokens || [],
  };
}

const createCustGuestClosed = (resObj) => {
  const currentUTC = CommonSrvc.currUTCObj();
  return {
    _id: uuidv4(),
    cart: resObj.cart,
    idSeq: resObj.idSeq,

    vndrOrg: resObj.vndrOrg,
    voName: resObj.voName,
    voCode: resObj.voCode,

    pName: resObj.pName,
    mName: resObj.mName,
    mobCc: resObj.mobCc,
    mobNum: resObj.mobNum,
    mobCcNum: resObj.mobCcNum,
    emID: resObj.emID,
    myPrimary: resObj.myPrimary,
    mpType: resObj.mpType,

    mPin: resObj.mPin,
    mPinLav: resObj.mPinLav,
    logPswd: resObj.logPswd,
    logPswdLav: resObj.logPswdLav,
    otp: resObj.otp,
    otpLav: resObj.otpLav,

    mdTokens: resObj.mdTokens,
    wdTokens: resObj.wdTokens,

    cuRakam: resObj.cuRakam,
    cUser: resObj.cUser,
    cUserName: resObj.cUserName,
    cDtStr: currentUTC.currUTCDtTmStr,
    cDtNum: currentUTC.currUTCDtTmNum,
    uuRakam: resObj.cuRakam,
    uUser: resObj.cUser,
    uUserName: resObj.cUserName,
    uDtStr: currentUTC.currUTCDtTmStr,
    uDtNum: currentUTC.currUTCDtTmNum
  };
}

const createCustGuestSsnClosed = (resData) => {
  return {
    _id: uuidv4(),

    gid: resData._id,

    vndrOrg: resData.vndrOrg,
    voName: resData.voName,
    voCode: resData.voCode,

    atoken: resData.atoken,
    at: resData.at,
    dt: resData.dt,
    dos: resData.dos,
    duId: resData.duId,
    ma: resData.ma,
    ipa: resData.ipa,
    ipv: resData.ipv,
    bn: resData.bn,
    bv: resData.bv,
    ua: resData.ua,
    ip: resData.ip,

    cuRakam: resData.cuRakam,
    cUser: resData.cUser,
    cUserName: resData.cUserName,
    cDtStr: resData.cDtStr,
    cDtNum: resData.cDtNum,
    uuRakam: resData.uuRakam,
    uUser: resData.uUser,
    uUserName: resData.uUserName,
    uDtStr: resData.uDtStr,
    uDtNum: resData.uDtNum
  }
}
const createUserData = (resObj) => {
  return {
    idSeq: resObj.idSeq,

    vndrOrg: resObj.vndrOrg,
    voName: resObj.voName,
    voCode: resObj.voCode,

    pName: resObj.pName,
    mName: resObj.mName,
    mobCc: resObj.mobCc,
    mobNum: resObj.mobNum,
    mobCcNum: resObj.mobCcNum,
    emID: resObj.emID,
    myPrimary: resObj.myPrimary,
    mpType: resObj.mpType,
    altMobCc: resObj.altMobCc || '',
    altMobNum: resObj.altMobNum || '',
    altMobCcNum: resObj.altMobNum || '',
    altEmID: resObj.altEmID || '',
    ptRoju: resObj.ptRoju || '',
    lingam: resObj.lingam || '',

    cart: resObj.cart,

    uHoda: "Active",

    mdTokens: resObj.mdTokens,
    wdTokens: resObj.wdTokens,

    cuRakam: resObj.cuRakam,
    cUser: resObj.cUser,
    cUserName: resObj.cUserName,
    cDtStr: resObj.cDtStr,
    cDtNum: resObj.cDtNum,
    uuRakam: resObj.uuRakam,
    uUser: resObj.uUser,
    uUserName: resObj.uUserName,
    uDtStr: resObj.uDtStr,
    uDtNum: resObj.uDtNum
  };
}
const generateRefuid = (resObj) => {
  const currentUTC = CommonSrvc.currUTCObj();
  const itemName = resObj.pName.replaceAll(' ', '').toUpperCase();
  const num = (currentUTC.currUTCYear - 2022);
  const currentDay = currentUTC.currUTCDayOfYear.toString();
  const date = new Date();
  const time = (date.getHours()) * (60) + (date.getMinutes());
  const rdmStr = CommonSrvc.randomStrGen(itemName, 3);
  const rdmStr2 = CommonSrvc.randomStrGen(resObj.mobNum, 4);
  const day = (currentDay.length == 1 ? '00' + currentDay : currentDay.length == 2 ? '0' + currentDay : currentDay);
  const code = rdmStr2 + rdmStr + num + day + time;
  return code
};
