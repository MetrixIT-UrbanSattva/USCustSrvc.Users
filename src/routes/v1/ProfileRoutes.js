/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const ProfileCtrl = require('../../controllers/ProfileCtrl');

module.exports.controller = (app, passport) => {

  app.post('/kmvcdm/profile/pic/update/:type', ProfileCtrl.profilePicUpdate);
  app.put('/kmvcdm/user/details/update', ProfileCtrl.updateUserDetails);
  app.put('/kmvcdm/user/info/update', ProfileCtrl.updateUserInfo);

};
