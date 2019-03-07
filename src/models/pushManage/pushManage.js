import { getPushList,addContent,pushMessage,updateContent,recallContent,pushDetailMessage } from '../../services/pushManage';
import Utils from '../../Common/Utils'
const Util = new Utils();
export default {
    namespace: 'pushManage',

    state: {
        data:{list:[],totalCount:0},
        loading: true,
    },

    effects: {
        //获取账户列表
        *fetch({callback,payload}, { call, put }) {
            const response = yield call(getPushList,payload);
            if(!Util.success(response)){
                response.data={list:[],totalCount:0}
            }
            yield put({
                type: 'save',
                payload: response,
            });
            if(callback) callback(response);
        },

        //新增消息
        *addContent({callback,payload}, { call, put }) {
            const response = yield call(addContent,payload);
            if(callback) callback(response);
        },

        //新增推送消息
        *pushMessage({callback,payload}, { call, put }) {
            const response = yield call(pushMessage,payload);
            if(callback) callback(response);
        },

        //详情推送
        *pushDetailMessage({callback,payload}, { call, put }) {
            const response = yield call(pushDetailMessage,payload);
            if(callback) callback(response);
        },

        //修改内容
        *updateContent({callback,payload}, { call, put }) {
            const response = yield call(updateContent,payload);
            if(callback) callback(response);
        },

        //撤回
        *recallContent({callback,payload}, { call, put }) {
            const response = yield call(recallContent,payload);
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
