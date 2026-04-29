/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

var multer = require('multer');
var fs = require('fs');

const CommonSrvc = require('../services/CommonSrvc')
const ProfileSrvc = require('../services/ProfileSrvc');
const ProfileCtrlVal = require('./ProfileCtrlVldtns');
const SetRes = require('../SetRes');
const tokens = require('../tokens');
const util = require('../lib/util');
const logger = require('../lib/logger');

var storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const dtData = tokens.kaiaMartTokenDecode(req.headers.kmvcatoken);
    const currentUTC = CommonSrvc.currUTCObj();
    var uplLoc = 'assets/files/' + (dtData?.tokenData?.uid ? dtData.tokenData.uid : currentUTC.currUTCDtTmNum);
    if (!fs.existsSync(uplLoc)) {
      fs.mkdirSync(uplLoc);
    }
    callback(null, uplLoc);
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  }
});
var upload = multer({ storage }).single('profile');

//  ====== Profile pic Update Starts ======== //
const profilePicUpdate = (req, res, next) => {
  upload(req, res, (err) => {
    const dtData = tokens.kaiaMartRefreshToken(req.headers.kmvcatoken, res);
    const tokenValidation = ProfileCtrlVal.tokenValidation(dtData);
    if (tokenValidation.flag) {
      const type = req.params.type;
      if (req.file && type == 'pic-update') {
        const currentUTC = CommonSrvc.currUTCObj();
        var fd = req.file.destination;
        var fileExt = req.file.filename.split('.');
        var fileName = currentUTC.currUTCDtTmNum + (fileExt.length > 1 ? '.' + fileExt[fileExt.length - 1] : '');
        var fileLoc = fd + '/' + fileName;
        fs.rename(fd + '/' + req.file.filename, fileLoc, (err) => {
          if (!err) {
            ProfileSrvc.updateProfileBackgroundPic(fileLoc, req.file.filename, fileName, dtData, (resObj) => {
              util.sendApiResponse(res, resObj);
            });
          } else {
            fs.unlink(fd + '/' + req.file.filename, (error) => logger.error('Unknown Error at ProfileCtrl.js - profilePicUpdate:' + error));
            const data = SetRes.updateTxFail();
            util.sendApiResponse(res, data);
          }
        });
      } else if(type == 'pic-delete') {
        ProfileSrvc.deleteProfileBackgroundPic(dtData, (resObj) => util.sendApiResponse(res, resObj));
      } else {
        const data = SetRes.updateTxFail();
        util.sendApiResponse(res, data);
      }
    } else {
      util.sendApiResponse(res, tokenValidation.result);
    }
  });
}
//  ====== Profile pic Update End ======== //

const updateUserDetails = (req, res, next) => {
  const proflvldtn = ProfileCtrlVal.usersProflVldtn(req);
  if (proflvldtn.flag) {
    const tData = tokens.kaiaMartRefreshToken(req.headers.kmvcatoken, res);
    const tv = ProfileCtrlVal.tokenValidation(tData);
    if (tv.flag) {
      ProfileSrvc.updateUserDetails(req.body, tData, (resobj) => {
        util.sendApiResponse(res, resobj);
      });
    } else {
      util.sendApiResponse(res, tv.result);
    }
  } else {
    util.sendApiResponse(res, proflvldtn.result);
  }
}

const updateUserInfo = (req, res, next) => {
  const proflvldtn = ProfileCtrlVal.usersInfoVldtn(req);
  if (proflvldtn.flag) {
    const tData = tokens.kaiaMartRefreshToken(req.headers.kmvcatoken, res);
    const tv = ProfileCtrlVal.tokenValidation(tData);
    if (tv.flag) {
      ProfileSrvc.updateUserInfo(req.body, tData, req.headers.kmvcatoken, (resobj) => {
        util.sendApiResponse(res, resobj);
      });
    } else {
      util.sendApiResponse(res, tv.result);
    }
  } else {
    util.sendApiResponse(res, proflvldtn.result);
  }
}

module.exports = {profilePicUpdate, updateUserDetails, updateUserInfo};
