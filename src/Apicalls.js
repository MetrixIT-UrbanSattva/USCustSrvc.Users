/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */
var axios = require('axios');
var config = require('config');


const getCartData = (resObj, kmvcatoken, callback) => {
  const headers = { headers: { kmvcatoken } };
  axios.post(config.cartDomain + 'kmvc/custs/cart/items/list', resObj, headers)
    .then((res) => { callback(res.data.resData) }).catch((err) => callback({}));
}
const updateCartItemsData = (kmvcatoken, userRes, callback) => {
  const headers = { headers: { kmvcatoken } };
  axios.post(config.cartDomain + 'kmvc/custs/cart/items/update', userRes, headers)
    .then((res) => { callback(res.data.resData) }).catch((err) => callback({}));
}
const getAdressData = (kmvcatoken, callback) => {
  const headers = { headers: { kmvcatoken } };
  axios.get(config.addressDomain + 'kmvcd/addresses/list', headers)
    .then((res) => { callback(res.data.resData) }).catch((err) => { callback({}) });
}

const createCart = (resObj, kmvcatoken, callback) => {
  const headers = { headers: { kmvcatoken } };
  axios.post(config.cartDomain + 'kmvc/custs/cart/create', resObj, headers)
    .then((res) => { callback(res.data.resData) }).catch((err) => { callback({}) });
}

const updateCartData = (resObj, kmvcatoken, callback) => {
  const headers = { headers: { kmvcatoken } };
  axios.post(config.cartDomain + 'kmvc/custs/cart/update', resObj, headers)
    .then((res) => { callback(res.data.resData) }).catch((err) => callback({}));
}

const createAdress = (resObj, body, kmvcatoken, callback) => {
  const adrsData = setAdressData(resObj, body);
  const headers = { headers: { kmvcatoken } };
  const data = { userRes: resObj, ...adrsData};
  axios.post(config.addressDomain + 'kmvcd/address/create', data, headers)
    .then((res) => { callback(res.data.resData) }).catch((err) => callback({}));
}

const createUser = (userResObj, userInfo, kmvcatoken, callback) => {
  const headers = { headers: { kmvcatoken } };
  const reqBody = {userResObj, userInfo}
  axios.post(config.custUsersDomain + 'kmvc/vcusrs/create', reqBody, headers)
    .then((res) => { callback(res.data.resData) }).catch((err) => callback({}));
}
const createAdminAdress = (adrsObj, kmvcatoken) => {
  const headers = { headers: { kmvcatoken } };
  axios.post(config.adminadressDomain + 'kmvd/vocu/address/create', adrsObj, headers)
    .then((res) => { }).catch((err) => {});
}

const updateFrstOrdr = (data, kmvcatoken) => {
  const headers = { headers: { kmvcatoken } };
  axios.put(config.custUsersDomain + 'kmvc/user/info/update', data, headers)
    .then((res) => { }).catch((err) => { });
}
module.exports = {
  getCartData,
  updateCartItemsData,
  getAdressData,
  createCart,
  updateCartData,
  createAdress,
  createUser,
  createAdminAdress,
  updateFrstOrdr
}

const setAdressData = (resObj, body) => {
  const obj = {
    mobCc: resObj.mobCc,
    contactName: resObj.pName,
    contactMobCC: resObj.mobCcNum,
    contactMobNumber: resObj.mobNum,
    locationName: 'Home',
    pincode: body.postal,
    district: body.city,
    districtCode: resObj.idSeq.jillaCode,
    state: body.region,
    stateCode: resObj.idSeq.rastrCode,
    country: body.country_name,
    countryCode: resObj.idSeq.desamCode,
  }
  return obj;
}