import { getConfigData,pushSysConfig,saveSysConfig,checkData} from '../../services/configManage';
import Utils from '../../Common/Utils'
const Util = new Utils();
export default {
    namespace: 'configManage',

    state: {
        respCode:'',
        respMsg:'',
        data:[],
        loading: true,
    },

    effects: {
        //获取配置信息
        *fetch({callback,payload}, { call, put }) {
            const response = yield call(getConfigData,payload);
            if(callback) callback(response);
        },

        //保存系统配置
        *saveSysConfig({callback,payload}, { call, put }) {
            const response = yield call(saveSysConfig,payload);
            if(callback) callback(response);
        },

        //推送系统配置
        *pushSysConfig({callback,payload}, { call, put }) {
            const response = yield call(pushSysConfig,payload);
            if(callback) callback(response);
        },

        *checkData({callback,payload}, { call, put }) {
            const response = yield call(checkData,payload);
            if(callback) callback(response);
        },
    },


    reducers: {
        save(state, { payload }) {
            return {
                ...state,
                ...payload,
            };
        },
    },
};
