/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const SetRes = require('../SetRes');
const tType = 'VC User';
const ptObj = {mob: 'Mobile', eId: 'Email'};

const tokenValidation = (tData) => {
  if (!tData) {
    const it = SetRes.invalidToken();
    return { flag: false, result: it };
  } else if (tData.isExpired) {
    const te = SetRes.tokenExpired();
    return { flag: false, result: te };
  } else if (tData.tokenData && tData.tokenData.ur !== tType) {
    const ad = SetRes.invalidAccess();
    return { flag: false, result: ad };
  } else {
    return { flag: true };
  }
}

const usersProflVldtn = (req) => {
  const reqBody = req.body;
  if (!req.headers.kmvcatoken) {
    const tokenResult = SetRes.tokenRequired();
    return { flag: false, result: tokenResult };
  } else {
    const data = userProfileEditData(reqBody);
    if (!data || (ptObj.mob === reqBody.primaryType && (!reqBody.mobCc || !reqBody.mobNumber)) ||
    (ptObj.eId === reqBody.primaryType && !reqBody.emailId)) {
      const msId = SetRes.mandatoryFileds();
      return { flag: false, result: msId };
    } else {
      return { flag: true };
    }
  }
}

const usersInfoVldtn = (req) => {
  const reqBody = req.body;
  if (!req.headers.kmvcatoken) {
    const tokenResult = SetRes.tokenRequired();
    return { flag: false, result: tokenResult };
  } else if (!reqBody.uid) {
    const msId = SetRes.mandatoryFileds();
    return { flag: false, result: msId };
  } else {
    return { flag: true };
  }
}

module.exports = {tokenValidation, usersProflVldtn, usersInfoVldtn};

// ===== sub functions =======
const userProfileEditData = (reqBody) => {
  if (reqBody.recordId && reqBody.custName && reqBody.displayName && reqBody.emailId && reqBody.primaryType && reqBody.primary) {
    return true;
  } else {
    return false;
  }
}
