import moment from 'moment';

// mock data
//产线配置
const data = {
    'verCode':90,
    'verBetween':150,
    'logout':2,
    'bannerFrontCount':5,
    'bannerBackCount':4,
};
//保存的配置
const record = {
    'verCode':90,
    'verBetween':150,
    'logout':2,
    'bannerFrontCount':5,
    'bannerBackCount':4,
}

const response ={
    data,
    record
}


function genResponse (data) {
    return {
        respCode:"0000",
        respMsg:"查询成功",
        data:{data},
    }
}

export default {
  'GET /frontApi/ConfigManage/getConfigData': genResponse(response),
};
