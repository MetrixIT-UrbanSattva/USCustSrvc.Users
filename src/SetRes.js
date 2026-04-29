/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const apiServerStatus = () => {
  return { httpStatus: 200, status: '200', resData: { message: 'Urban Sattva Customers - Users API server is running' } };
}
const unKnownErr = () => {
  return { httpStatus: 500, status: '199', resData: { message: '500 - Unknown Error' } };
}
const noData = () => {
  return { httpStatus: 204, status: '204', resData: { message: '204 - No Data Found' } };
}
const sendLoginOtpFail = () => {
  return { httpStatus: 400, status: '197', resData: { message: 'User Id is required' } };
}
const updateFail = () => {
  return { httpStatus: 400, status: '195', resData: { message: 'OTP Sent Failed' } };
}
const accBlocked = () => {
  return { httpStatus: 400, status: '150', resData: { message: 'Your account is blocked, try after 1 hour' } };
}
const accHold = () => {
  return { httpStatus: 400, status: '151', resData: { message: 'Your account is on hold, try after 24 hours' } };
}
const accInactive = () => {
  return { httpStatus: 400, status: '152', resData: { message: 'Your account is inactive, contact support' } };
}
const invalid = () => {
  return { httpStatus: 400, status: '100', resData: { message: 'Invalid credentials' } };
}
const otpSentSuc = (otpNum) => {
  return { httpStatus: 200, status: '200', resData: { message: 'OTP Sent', otpNum } };
}
const otpTokenExpired = () => {
  return { httpStatus: 200, status: '190', resData: { message: 'OTP Token Expired' } };
}
const invalidOtp = () => {
  return { httpStatus: 400, status: '100', resData: { message: 'Provided Invalid OTP' } };
}
const loginSuccess = (result) => {
  return { httpStatus: 200, status: '200', resData: { message: 'Login Success', result } };
}

const saveFailed = () => {
  return { httpStatus: 400, status: '196', resData: { message: 'Save Trx failed' } };
}
const tokenRequired = () => {
  return { httpStatus: 400, status: '192', resData: { message: 'Token is required' } };
}
const invalidToken = () => {
  return { httpStatus: 400, status: '191', resData: { message: 'Invalid Token' } };
}
const tokenExpired = () => {
  return { httpStatus: 400, status: '190', resData: { message: 'Token Expired' } };
}
const invalidAccess = () => {
  return { httpStatus: 400, status: '193', resData: { message: 'You do not have access' } };
}
const deleteFail = () => {
  return { httpStatus: 400, status: '194', resData: { message: 'Delete Trx failed' } };
}
const successResponse = (result) => {
  return { httpStatus: 200, status: '200', resData: { message: 'Success', result } };
}

const mandatoryFileds = () => {
  return { httpStatus: 400, status: '197', resData: { message: 'Provide required field(s) data' } };
}

const updateTxFail = () => {
  return { httpStatus: 400, status: '195', resData: { message: 'Update Trx failed' } };
}

const responseData = (result) => {
  return {httpStatus: 200, status: '200', resData: {message: 'Succes', result}};
}

module.exports = {
  apiServerStatus, unKnownErr, noData,
  sendLoginOtpFail, updateFail, accBlocked,
  accHold, accInactive, invalid,
  otpSentSuc, saveFailed,
  tokenRequired, invalidToken, tokenExpired,
  invalidAccess, otpTokenExpired, invalidOtp,
  loginSuccess, deleteFail,
  successResponse, mandatoryFileds,
  updateTxFail, responseData
}
