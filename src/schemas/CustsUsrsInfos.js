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

// --- Begin: Customers User Informations Schema --- //
const schema = new Schema({
  _id: {type: String, default: uuidv4()},

  uid: {type: String, index: true, required: true, unique: true, ref: config.collCustsUsrs},
  refUID: {type: String, required: true}, // Reference Unique ID
  myPrimary: {type: String, required: true}, // Mobile Number or Email
  uHoda: {type: String, required: true, trim: true}, // User Status: Active, Inactive, Hold, Blocked

  vndrOrg: {type: String, required: true}, // ref: config.collVndrsOrgs: VNDR0001
  voName: {type: String, required: true}, // Urban Sattva
  voCode: {type: String, required: true}, // US0001

  crtc: {type: Number, default: 0}, // Cart Items Count
  svdc: {type: Number, default: 0}, // Saved Items Count
  wslc: {type: Number, default: 0}, // Wish List Items Count
  vwdc: {type: Number, default: 0}, // Viewed Items Count
  bktc: {type: Number, default: 0}, // Basket Items Count
  bsktsCount: {type: Number, default: 0}, // Baskets Counts
  fOrder: {
    so: {type: String, required: false}, // 
    dtStr: {type: String, required: false}, // YYYY-MM-DD HH:mm:ss
    dtYear: {type: Number, default: 0}, // 
    dtMonth: {type: Number, default: 0}, // 
    dtDay: {type: Number, default: 0}, // 
  },

  ntfcts: {type: Number, default: 0}, // Notifications Count
  rNtfcts: {type: Number, default: 0}, // Read Notifications Count
  urNtfcts: {type: Number, default: 0}, // Unread Notifications Count
  sTckts: {type: Number, default: 0}, // Support Tickets Count
  saTckts: {type: Number, default: 0}, // Support Tickets Active Count
  scTckts: {type: Number, default: 0}, // Support Tickets Closed Count
  soCount: {type: Number, default: 0}, // Sales Orders Count
  soiCount: {type: Number, default: 0}, // Sales Orders Items Count,
  sogCount: {type: Number, default: 0}, // Sales Orders Groups Count,
  sogActCount: {type: Number, default: 0}, // Sales Orders Groups Active Count,

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
schema.index({vndrOrg: 1, refUID: 1}, {unique: true});
schema.index({delFlag: -1, uHoda: 1});

module.exports = mongoose.model(config.collCustsUsrsInfos, schema);
// --- End: Customers User Informations Schema --- //
