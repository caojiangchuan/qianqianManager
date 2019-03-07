import request from "../utils/request";

//推送信息查询
export async function getPushList(params) {
    return request('/frontApi/Push/pushManagementRecordList', {
        method: 'POST',
        body:{
            ...params
        }
    });
}

//新增推送消息
export async function addContent(params) {
    return request('frontApi/Push/insertContent', {
        method: 'POST',
        body:{
            ...params
        }
    });
}

//新增推送消息
export async function pushMessage(params) {
    return request('frontApi/Push/insertPush', {
        method: 'POST',
        body:{
            ...params
        }
    });
}


//详情推送消息
export async function pushDetailMessage(params) {
    return request('frontApi/Push/pushInfo', {
        method: 'POST',
        body:{
            ...params
        }
    });
}

//修改内容
export async function updateContent(params) {
    return request('frontApi/Push/updateContentById', {
        method: 'POST',
        body:{
            ...params
        }
    });
}

//修改内容
export async function recallContent(params) {
    return request('frontApi/Push/undoPush', {
        method: 'POST',
        body:{
            ...params
        }
    });
}

