import { getAccountList,getBankCardList,updateAuth,getContracts,getValidateMessage,getProvince,destroyAccount,getContractDetail,changeMasterCard } from '../../services/accountManage';
import Utils from '../../Common/Utils'
const Util = new Utils();
export default {
    namespace: 'account',

    state: {
        data:{list: [],totalCount:0},
        loading: true,
    },

    effects: {
        //获取账户列表
        *fetch({callback,payload}, { call, put }) {
            const response = yield call(getAccountList,payload);
            if(!Util.success(response)){
                response.data={list:[],totalCount:0}
            }
            yield put({
                type: 'save',
                payload: response,
            });
            if(callback) callback(response);
        },
        //发送短信
        *sendMessage({payload,callback}, { call, put }) {
            const response = yield call(getValidateMessage,payload);
            if(callback) callback(response);
        },
        //获取银行列表
        *getBankCardList({payload,callback}, { call, put }) {
            const response = yield call(getBankCardList,payload);
            if(callback) callback(response);
        },

        *changeMasterCard({payload,callback}, { call, put }) {
            const response = yield call(changeMasterCard,payload);
            if(callback) callback(response);
        },

        //修改认证
        *updateAuth({payload,callback}, { call, put }) {
            const response = yield call(updateAuth,payload);
            if(callback) callback(response);
        },

        //获取合同编号
        *getContracts({payload,callback}, { call, put }) {
            const response = yield call(getContracts,payload);
            if(callback) callback(response);
        },

        //获取合同详情
        *getContractDetail({payload,callback}, { call, put }) {
            const response = yield call(getContractDetail,payload);
            if(callback) callback(response);
        },

        //获取省份
        *getProvince({callback}, { call, put }) {
            const response = yield call(getProvince);
            if(callback) callback(response);
        },

        //注销
        *destroyAccount({callback,payload}, { call, put }) {
            const response = yield call(destroyAccount,payload);
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
