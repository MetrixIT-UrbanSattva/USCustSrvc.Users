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

// --- Begin: Customers Users Sessions Schema --- //
var schema = new Schema({
  _id: {type: String, default: uuidv4()},
  uid: {type: String, required: true, ref: config.collCustsUsrs},
  atoken: {type: String, required: true}, // 5 min
  uHoda: {type: String, required: true}, // User Status: Active, Inactive, Hold(24Hrs), Blocked(1Hr)

  vndrOrg: {type: String, required: true}, // ref: config.collVndrsOrgs: VNDR0001
  voName: {type: String, required: true}, // Urban Sattva
  voCode: {type: String, required: true}, // US0001

  at: {type: String, required: true, trim: true}, // App Type: Web App, Mobile App
  dt: {type: String, required: true, trim: true}, // Device Type: Desktop, Mobile, Tab
  dos: {type: String, required: true, trim: true}, // Device OS
  duId: {type: String, required: false, trim: true}, // Device Unique Id
  ma: {type: String, required: false, trim: true}, // Mac Address
  ipa: {type: String, required: true, trim: true}, // IP Address
  ipv: {type: String, required: true, trim: true}, // IP Version
  bn: {type: String, required: false, trim: true}, // Browser Name
  bv: {type: String, required: false, trim: true}, // Browser Version
  ua: {type: String, required: true, trim: true}, // USer Agent
  ip: {type: Object},

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

schema.index({delFlag: -1, uHoda: 1});

module.exports = mongoose.model(config.collCustsUsrsSsns, schema);
// --- End: Customers Users Sessions Schema --- //
