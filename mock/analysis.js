

// mock data
const allRegist = [
    {
       // 已认证
        percent:30,// 认证百分比
        people:300,// 认证人数
    },
    {
        // 未认证
        percent:70,// 未认证百分比
        people:700// 未认证人数
    }
]; // 注册账户总数
const ydAddRegist = [
    {
        // 已认证
        percent:20,// 认证百分比
        people:200,// 认证人数
    },
    {
        // 未认证
        percent:80,// 未认证百分比
        people:800// 未认证人数
    }
]; // 昨日新增注册
const wkAddRegist = [
    {
        // 已认证
        percent:0,// 认证百分比
        people:0,// 认证人数
    },
    {
        // 未认证
        percent:0,// 未认证百分比
        people:0// 未认证人数
    }
]; // 本周新增注册数
const monthAddRegist = [
    {
        // 已认证
        percent:10,// 认证百分比
        people:100,// 认证人数
    },
    {
        // 未认证
        percent:90,// 未认证百分比
        people:900// 未认证人数
    }
]; // 本月新增注册数
const response ={
    allRegist,
    ydAddRegist,
    wkAddRegist,
    monthAddRegist
}
function genResponse (data,res) {
    return {
        respCode:"0000",
        respMsg:"查询成功",
        data,
    }
}

export default {
    // 'POST /10.8.30.34:8000/frontApi/index/getAnalysis': genResponse(response),
};
