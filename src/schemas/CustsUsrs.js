/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

var config = require('config');
var mongoose = require('mongoose');
var {v4: uuidv4} = require('uuid');

mongoose.createConnection(config.mongoDBConnection, {useUnifiedTopology: true, useNewUrlParser: true});
const Schema = mongoose.Schema;

// --- Begin: Customers Users Schema --- //
const schema = new Schema({
  _id: {type: String, default: uuidv4()},
  idSeq: {
    seq: {type: String, required: true}, // Country, State and Dist Code and Year(2022) Moth(10) Day(10)
    desamCode: {type: String, required: true}, // Country Code: IND
    rastrCode: {type: String, required: true}, // TS
    jillaCode: {type: String, required: true}, // HYD
    pincode: {type: String, required: false},
    mandal: {type: String, required: false}, // Mandal
    vuru: {type: String, required: false}, // Village / Area Locality
    year: {type: Number, required: true},
    month: {type: Number, required: true},
    day: {type: Number, required: true}
  },

  vndrOrg: {type: String, required: true}, // ref: config.collVndrsOrgs: VNDR0001
  voName: {type: String, required: true}, // Urban Sattva
  voCode: {type: String, required: true}, // US0001

  pName: {type: String, required: false, trim: true}, // Purti Peru - Full Name
  mName: {type: String, required: false, trim: true}, // Muddu Name - Short Name
  mobCc: {type: String, required: false}, // cc - Country Code: +91
  mobNum: {type: String, required: false}, // Mobile Number
  mobCcNum: {type: String, required: false}, // Mobile Number with Country Code
  emID: {type: String, required: false, trim: true}, // Email ID
  refUID: {type: String, required: true}, // Reference Unique ID
  myPrimary: {type: String, required: true}, // Mobile Number or Email
  mpType: {type: String, required: true}, // My Primary Type:  Email or Mobile
  mpVerifyFlag: {type: Boolean, default: false},
  altMobCc: {type: String, required: false}, // cc - Country Code
  altMobNum: {type: String, required: false},
  altMobCcNum: {type: String, required: false},
  altEmID: {type: String, required: false, trim: true},
  ptRoju: {type: String, required: false}, // Puttina Roju - Date of Birth - Format = YYYY-MM-DD
  lingam: {type: String, required: false}, // Gender

  uHoda: {type: String, required: true, trim: true}, // User Status: Active, Inactive(Contact Support), Hold(24Hrs), Blocked(1Hr)
  mPin: {type: String, required: false},
  mPinLav: {type: String, required: false}, // Lav(Lavanam) - Salt
  logPswd: {type: String, required: false},
  logPswdLav: {type: String, required: false}, // Lav(Lavanam) - Salt
  otp: {type: String, required: false},
  otpLav: {type: String, required: false}, // Lav(Lavanam) - Salt
  mdTokens: {type: [String], required: false, default: []}, // Mobile Device Tokens
  wdTokens: {type: [String], required: false, default: []}, // Web Device Tokens
  cart: {type: String, required: false}, //ref: config.collVocCustsCart

  pIcon: {type: String, required: false}, // Profile Icon
  piActualName: {type: String, required: false},
  piPath: {type: String, required: false},
  bgPic: {type: String, required: false},
  bgPicActualName: {type: String, required: false},
  bgPicPath: {type: String, required: false},

  delFlag: {type: Boolean, default: false}, // Deleted Flag
  cuRakam: {type: String, required: true}, // Created User Type
  cUser: {type: String, required: true, trim: true}, // Created Users._id
  cUserName: {type: String, required: true}, // Created Users.pName
  cDtStr: {type: String, required: true}, // Date & Time String - Format = YYYY-MM-DD HH:mm:ss
  cDtNum: {type: Number, required: true}, // Date & Time Number
  uuRakam: {type: String, required: true}, // Updated User Type
  uUser: {type: String, required: true, trim: true}, // Updated Users._id
  uUserName: {type: String, required: true}, // Updated Users.pName
  uDtStr: {type: String, required: true}, // Date & Time String - Format = YYYY-MM-DD HH:mm:ss
  uDtNum: {type: Number, required: true}, // Date & Time Number
});

// schema.index({'$**': 'text'});
// schema.index({idSeq: 'text', pName: 'text', mName: 'text', mobCcNum: 'text', emID: 'text', refUID: 'text'});
schema.index({vndrOrg: 1, refUID: 1}, {unique: true});
schema.index({vndrOrg: 1, myPrimary: 1}, {unique: true});
schema.index({mobCcNum: 1, emID: 1, idSeq: 1});
schema.index({delFlag: -1, uHoda: 1});

module.exports = mongoose.model(config.collCustsUsrs, schema);
// --- End: Customers Users Schema --- //
