import request from "../utils/request";

//获取配置信息
export async function getConfigData(params) {
    return request('/frontApi/Setting/getSettingByType', {
        method: 'POST',
        body:{
            ...params
        }
    });
}


//保存系统配置
export async function saveSysConfig(reqJson) {
    return request('frontApi/Setting/saveSetting ', {
        method: 'POST',
        body:{
            reqJson
        }
    });
}
//推送系统配置
export async function pushSysConfig(reqJson) {
    return request('frontApi/Setting/issueSetting', {
        method: 'POST',
        body:{
            ...reqJson
        }
    });
}

//检查配置项
export async function checkData(reqJson) {
    return request('frontApi/Setting/check', {
        method: 'POST',
        body:{
            ...reqJson
        }
    });
}
