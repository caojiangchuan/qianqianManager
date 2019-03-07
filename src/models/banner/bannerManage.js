import { getBannerList, insertBanner, updateBannerById, issueBanner, comparMsg } from '../../services/bannerManage';
import Utils from '../../Common/Utils';

const Util = new Utils();

export default {
    namespace: 'banner',

    state: {
        data: [],
        totalCount:0,
        loading: true,
    },
    effects: {
        //BANNER管理 获取，查询
        *fetch({payload,callback}, { call, put }) {
            const response = yield call(getBannerList,payload);
            if(!Util.success(response)) {
                response.data = {}
            }
            yield put({
                type: 'save',
                payload: response,
            });
            if(callback) callback(response);
        },
        //BANNER管理 增加
        *addBanner({payload,callback}, { call, put }) {
            const response = yield call(insertBanner,payload);
            if(!Util.success(response)) {
                response.data = {}
            }
            if(callback) callback(response);
        },
        //BANNER管理 修改，启用，停用，删除
        *updateBanner({payload,callback}, { call, put }) {
            const response = yield call(updateBannerById,payload);
            if(!Util.success(response)) {
                response.data = {}
            }
            if(callback) callback(response);
        },
        //BANNER管理 发布
        *issueBanners({payload,callback}, { call, put }) {
            const response = yield call(issueBanner,payload);            
            if(!Util.success(response)) {
                response.data = {}
            }
            if(callback) callback(response);
        },
        //BANNER管理 发布信息对比
        *comparMsg({payload,callback}, { call, put }) {
            const response = yield call(comparMsg,payload);            
            if(!Util.success(response)) {
                response.data = {}
            }
            if(callback) callback(response);
        }
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
