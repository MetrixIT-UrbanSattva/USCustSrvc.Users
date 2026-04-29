/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const LoginCtrl = require('../../controllers/LoginCtrl');

module.exports.controller = (app, passport) => {

  app.get('/', LoginCtrl.apiServerStatus);

  app.post('/kmvcdm/login/send/otp', LoginCtrl.sendLoginOtp);
  app.post('/kmvcdm/login/verify/otp', LoginCtrl.mobVerifyLoginOtp);

  app.post('/kmvcdm/create/custs/guests', LoginCtrl.createCustsGuest);
  app.post('/kmvcdm/custs/guest/login/send/otp', LoginCtrl.sendCustsGstLoginOtp);
  app.post('/kmvcdm/custs/guest/login/verify/otp', LoginCtrl.custsGstVerifyOtp);

  app.post('/kmvcdm/custs/users/list', LoginCtrl.custsUsersList);

  // app.post('/kmvcdw/login/send/otp', LoginCtrl.sendLoginOtp);
  // app.post('/kmvcdw/login/verify/otp', LoginCtrl.webVerifyLoginOtp);

}
