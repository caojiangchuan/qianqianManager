import moment from 'moment';

// mock data
const data = []; //账户信息
const bankCardList =[]; //银行卡列表
const contract =[]; //合同列表


for (let i = 0; i < 11; i += 1) {
    data.push({
    'id':i,
    'mobile':'1301234569'+i,
    'name':'测试'+i,
    'idNo':'3102***12'+i,
    'date':new Date(),
    'startDate':'2018.11.22',
    'endDate':'2018.11.22',
    'province':'北京',
    'idZ':`https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png`,
    'idF':`https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png`,
    'status':`${i/2===0?0:1}`,
  });
}

for (let i = 0; i < 5; i += 1) {
    bankCardList.push({
        'id':i,
        "carNo":`1234${i}`,
        "bank":'中国银行',
        "batchBank":'陆家嘴分行',
        'mobile':`130***830${i}`,
        'date':'2018.11.28',
        'status':1
    });
}

for (let i = 0; i < 5; i += 1) {
    contract.push({
        'id':i,
        "loanNo":`合同编号${i}`,
        "loanAnount":`10${i}`,
        "loanTerm":`20181010-20191210`,
        "loanTime":`20181010`,
        "cardNo":`10${i}`,
        "bank":'北京银行'
    });
}


const response ={
    data
}
const bankCard ={
    bankCardList
}
const Contracts={
    contract
}

function genResponse (data,res) {
    return {
        respCode:"0000",
        respMsg:"查询成功",
        data:data,
    }
}

export default {
  'GET /frontApi/getAccountList': genResponse(response),
  'GET /frontApi/getBankCardList': genResponse(bankCard),
  'GET /frontApi/getContracts': genResponse(Contracts),
  'PUT /frontApi/updateAuth/id': genResponse(['0000']),
};
