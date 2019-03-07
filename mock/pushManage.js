import moment from 'moment';

// mock data
const data = {}; //推送信息
const list = [];


for (let i = 0; i < 11; i += 1) {
    list.push({
    'id':i,
    'createDate':new Date(),
    'sendDate':new Date(),
    'createBy':'创建人'+i,
    'modifiedBy':'修改人'+i,
    'status':`${i/2===0?0:1}`,
    'content':'五十个字五十个字五十个字五十个字五十个字五十个字五十个字五十个字五十个字五十个字',
    'recallDate':new Date(),
    'recallBy': `撤回人${i}`
  });
}


const response ={
    list
}


function genResponse (list) {
    return {
        respCode:"0000",
        respMsg:"查询成功",
        data:{list:list.list,totalCount:list.list.size},
    }
}

export default {
  'GET /frontApi/PushManage/getPushList': genResponse(response),
};
