/**
 * Created by spark on 2018/11/21.
 */

import { getDynamicmenu,getUserInfo} from "@/services/frontApi";
import { setAuthority } from '@/utils/authority';


export default {
  namespace: "dynamicmenu",

  state: {
    menuData: [],
    buttonAuth: {},
    userInfo:{},
    buttonData:{}
  },

  effects: {
    *getDynamicMenu({callback,payload}, { call, put }) {
      const response = yield call(getDynamicmenu,payload);
      yield put({
        type: "getDynamicmenuSuccess",
        payload: response.data
      });
        if(callback) callback(response);
    },

    *getUserInfo(payload,{call,put}){
      const response = yield call(getUserInfo,payload);
      const {code,msg,data} = response;
      yield put ({
        type:"getUserInfoSuccess",
        payload:response

      })
    },

  },

  reducers: {
    getDynamicmenuSuccess(state, action) {
      return {
        ...state,
        menuData: action.payload.menuData,
        buttonAuth: action.payload.buttonData
      };
    },
    getUserInfoSuccess(state,action){
      setAuthority(action.payload.data.roleCodes);


      return{
        ...state,
        userInfo:action.payload.data,
      }
    }
  }
};
