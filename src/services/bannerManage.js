import request from "../utils/request";

//BANNER管理 获取，查询
export async function getBannerList(params) {
    return request('frontApi/Banner/getBannerList', {
        method: 'POST',
        body:{
            ...params,
        }
    });
}

//BANNER管理 增加
export async function insertBanner(params) {
    return request('frontApi/Banner/insertBanner', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}
  
//BANNER管理 修改，启用，停用，删除
export async function updateBannerById(params) {
    return request('frontApi/Banner/updateBannerById', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

//BANNER管理 发布
export async function issueBanner(params) {
    return request('frontApi/Banner/issueBanner', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

//BANNER管理 发布信息对比
export async function comparMsg() {
    return request('frontApi/Banner/comparMsg');
}