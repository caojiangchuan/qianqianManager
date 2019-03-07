import { getMessage,readMessage} from '@/services/message';
import Utils from '@/Common/Utils'
const Util = new Utils();
export default {
    namespace: 'messageTip',

    state: {
        readedList: [],
        unReadedCount:0,
        unReadedList:[],
        collapsed: false,
        loading: true,
    },

    effects: {
        //获取账户列表
        *getMessage( {},{ call, put }) {
            const response = yield call(getMessage);
            yield put({
                type: 'save',
                payload: Util.isNotNull(response)?response.data:[],
            });
        },
        //未读变已读
        *readMessage({callback,payload}, { call, put }) {
            const response = yield call(readMessage,payload);
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
