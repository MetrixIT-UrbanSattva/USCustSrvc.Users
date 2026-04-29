/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const config = require('config');
const request = require('request');
const logger = require('./lib/logger');

const msg91Sms = (mobiles, otp, callback) => {
  const authkey = config.msg91AuthKey;
  const sender = config.msg91SenderID;
  const flow_id = config.msg91FlowId;
  const data = {flow_id, sender, mobiles, otp};
  request.post({
    headers: {authkey, 'content-type': 'application/JSON'},
    url: config.msg91Url,
    body: JSON.stringify(data)
  }, (error, response, body) => {
    if (error) {
      logger.error('Unknown Error in SendSms.js, at function msg91Sms:' + error);
      callback(error, {});
    } else if (response.statusCode == 200) {
      callback(error, body);
    } else {
      callback(error, {});
    }
  });
}

module.exports = {
  msg91Sms
};
