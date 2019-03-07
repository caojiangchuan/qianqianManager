import request from "../utils/request";

//账户管理数据
export async function getAccountList(params) {
    return request('frontApi/Account/getAccountList', {
        method: 'POST',
        body:{
            ...params
        }
    });
}

//银行卡列表
export async function getBankCardList(params) {
    return request('/frontApi/Account/queryBankCards', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

//修改认证
export async function updateAuth(params) {
    return request(`/frontApi/Account/updateAuth`, {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

//获取借款合同
export async function getContracts(params) {
    return request(`/frontApi/Account/findContractNumList`, {
        method: 'POST',
        body:{
            ...params
        }
    });
}

//请求验证码
export async function getValidateMessage(params) {
    return request('frontApi/Message/sendSmsCode', {
        method: 'POST',
        body:{
            ...params
        }
    });
}


//获取省份
export async function getProvince() {
    return request('/frontApi/Account/getProvinces');
}

//请求验证码
export async function destroyAccount(params) {
    return request('frontApi/Account/offAccount', {
        method: 'POST',
        body:{
            ...params
        }
    });
}


//获取合同详情
export async function getContractDetail(params) {
    return request('frontApi/Account/findLoanByContractNum', {
        method: 'POST',
        body:{
            ...params
        }
    });
}

//确认变更银行卡
export async function changeMasterCard(params) {
    return request('frontApi/Account/changeGiveBackBankCard', {
        method: 'POST',
        body:{
            ...params
        }
    });
}


