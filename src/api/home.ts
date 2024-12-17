import { LocationQueryValue } from 'vue-router';
import request from '@/utils/request';


export function getData() {
  return request({
    url: '/api/SysStatus/Get',
    method: 'GET',
  });
}
export function SetRafflePrize(data: object) {
  return request({
    url: '/api/SetData/SetRafflePrize',
    method: 'POST',
    data
  });
}
export function SysStatusStart() {
  return request({
    url: '/api/SysStatus/Start',
    method: 'POST',
  });
}
export function BackToPrizeListPage() {
  return request({
    url: '/api/SysStatus/BackToPrizeListPage',
    method: 'POST',
  });
}
export function StartRoll(params: any) {
  return request({
    url: '/api/SysStatus/StartRoll',
    method: 'POST',
    params
  });
}
export function ResetSystem(params: any) {
  return request({
    url: '/api/SysStatus/ResetSystem',
    method: 'POST',
    params
  });
}
export function StopRoll() {
  return request({
    url: '/api/SysStatus/StopRoll',
    method: 'POST',
  });
}
export function UploadEmployees(file: any) {
  return request({
    url: '/api/SetData/UploadEmployees',
    method: 'POST',
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: {
      file
    }
  });
}
export function AddBonusPrize(data: object) {
  return request({
    url: '/api/SetData/AddBonusPrize',
    method: 'POST',
    data
  });
}

export function ChangeHideEmployeeInfoStatus(hideEmployeeInfo: boolean) {
  return request({
    url: `/api/SysStatus/ChangeHideEmployeeInfoStatus?hideEmployeeInfo=${hideEmployeeInfo}`,
    method: 'POST',
  })
}

export function SetNotary(notary: String) {
  return request({
    url: `/api/SetData/SetNotary?notary=${notary}`,
    method: 'POST',
  })
}
