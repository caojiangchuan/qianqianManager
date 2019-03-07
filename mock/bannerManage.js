import moment from 'moment';

// mock data
const data = {
    'onBannerList' : [],  //已启用
    'offBannerList' : [], //未启用
} 

//BANNER数据
for (let i = 0; i < 11; i += 1) {
    data.onBannerList.push({
        'id':i,
        'imgSort': i,
        'thumbnail':'https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png',
        'imgInfo':'这里是图片说明-启用',
        'uploader':'张三 ym10219',
        'lastUpdater':'李四 ym10219',
        'linkType':`${i/2===0? '外部网页' : '图片'}`,
        'linkContent':'https://www.baidu.com/',
        'releaseStatus':`${i/2===0?0:1}`,
        'PhoneConfiguration': `${i/2===0? 'apple' : 'android'}`,
        'webSiteUrl': 'https://www.Google.com/',
        'qianqianPage':'页面一',
        'linkThumbnail':'https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png',
    });
    data.offBannerList.push({
        'id':i,
        'imgSort': i,
        'thumbnail':'https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png',
        'imgInfo':'这里是图片说明-未启用',
        'uploader':'张三 ym10219',
        'lastUpdater':'李四 ym10219',
        'linkType':`${i/2===0? '文字链接' : '内部链接'}`,
        'linkContent':'https://www.baidu.com/',
        'releaseStatus':`${i/2===0?0:1}`,
        'PhoneConfiguration': `${i/2===0? 'apple' : 'android'}`,
        'webSiteUrl': 'https://www.Google.com/',
        'qianqianPage':'页面一',        
        'linkThumbnail':'https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png',
    });
}



const response ={
    data
}

function genResponse (data,res) {
    return {
        respCode:"0000",
        respMsg:"查询成功",
        data:data,
    }
}

export default {
    'GET /frontApi/Banner/getBannerList': genResponse(response)
};
