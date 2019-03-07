/**
 * Created by spark on 2018/11/28.
 */

import { getUserInfo } from "@/services/frontApi";
export default {
    namespace:'userInfo',
    state:{
        userInfo:{}
    },

    effects:{
        *fetchCurrentUser(_,{call,put}){
            const response = yield call(getUserInfo);

            yield put({
                type:"saveCurrentUser",
                payload:response,
            });
        }

    },

    reducers:{
        saveCurrentUser(state,action) {
            return {
                ...state,
                userInfo: action.payload.userInfo,
            };
        }
    }
}