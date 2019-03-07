/**
 * Created by spark on 2018/11/21.
 */
import { stringify } from 'qs';
import request from "../utils/request";

export async function getDynamicmenu() {
  return request('/frontApi/System/findMenuResByAccount');
}

export async function getUserInfo() {
  return request('/frontApi/System/findEmpRoles');
}


export async function getProvinces() {
  return request('/frontApi/Account/getProvinces');

}

export async function getServerTest() {
  return request('/credit-server/FrontServer/getServiceMenus');
}

export async function healthCheck() {
  return request('/credit-server/healthCheck/test');
}
