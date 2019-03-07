import request from "../utils/request";

//获取用户消息
export async function getMessage(params) {
    return request('frontApi/System/getMessageList');
}

//读取站内消息
export async function readMessage(params) {
    return request('frontApi/System/detailMsgById ', {
        method: 'POST',
        body:{
            id:params.id
        }
    });
}

