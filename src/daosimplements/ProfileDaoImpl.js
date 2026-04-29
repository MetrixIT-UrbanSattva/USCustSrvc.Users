/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const CommonSrvc = require('../services/CommonSrvc')

const profilePic = (piPath, piActualName, pIcon, tokenData) => {
  const currentUTC = CommonSrvc.currUTCObj();
  const query = { delFlag: false, _id: tokenData.iss };
  const updateObj = {
    pIcon, piActualName, piPath,

    uuRakam: tokenData.ur,
    uUser: tokenData.iss,
    uUserName: tokenData.pn,
    uDtStr: currentUTC.currUTCDtTmStr,
    uDtNum: currentUTC.currUTCDtTmNum
  };
  return { query, updateObj };
}

const updateProfile = (reqBody, tokenData) => {
  const currentUTC = CommonSrvc.currUTCObj();
  const mobCcNum = (reqBody.mobNumber ? (reqBody.mobCc + reqBody.mobNumber) : '');
  const query = { _id: reqBody.recordId, delFlag: false };

  const updateObj = {
    pName: reqBody.custName,
    mName: reqBody.displayName,
    mobCc: reqBody.mobCc || '',
    mobNum: reqBody.mobNumber || '',
    mobCcNum,
    emID: reqBody.emailId || '',
    mpType: reqBody.primaryType,
    myPrimary: reqBody.primary,
    altMobCc: reqBody.altMobCc || '',
    altMobNum: reqBody.altMobNumber || '',
    altMobCcNum: reqBody.altMobNumber ? reqBody.altMobCc + reqBody.altMobNumber : '',
    altEmID: reqBody.altEmailId || '',
    ptRoju: reqBody.dob || '',
    lingam: reqBody.gender || '',

    uuRakam: tokenData.ur || tokenData.tt,
    uUser: tokenData.iss,
    uUserName: tokenData.pn,
    uDtStr: currentUTC.currUTCDtTmStr,
    uDtNum: currentUTC.currUTCDtTmNum
  };
  return  {query, updateObj};
}

const updateUsrInfo = (reqBody, tokenData) => {
  const currentUTC = CommonSrvc.currUTCObj();
  const query = { uid: reqBody.uid, delFlag: false };
  const updateObj = {
    fOrder: reqBody.fOrder,
    uuRakam: tokenData.ur || tokenData.tt,
    uUser: tokenData.iss,
    soCount: reqBody.soCount,
    sogCount: reqBody.sogCount,
    soiCount: reqBody.soiCount,
    sogActCount: reqBody.sogActCount,

    uUserName: tokenData.pn,
    uDtStr: currentUTC.currUTCDtTmStr,
    uDtNum: currentUTC.currUTCDtTmNum
  }
  return {query, updateObj}
}

const usrId = (reqBody) => {
  return {uid: reqBody.uid, delFlag: false}
}

module.exports = {profilePic, updateProfile, updateUsrInfo, usrId};
