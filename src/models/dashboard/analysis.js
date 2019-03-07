import { getAnalysis } from '../../services/Analysis';
import Utils from '../../Common/Utils'

const Util = new Utils();


export default {
    namespace: 'analysis',

    state: {
        data: [],
        respCode:'',
        respMsg:'',
        loading: true,
    },

    effects: {
        // 获取账户列表
        *fetch({callback,payload}, { call, put }) {
            const response = yield call(getAnalysis,payload);
            if(!Util.success(response)){
                response.data=[]
            }
            yield put({
                type: 'save',
                payload: response,
            });
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
