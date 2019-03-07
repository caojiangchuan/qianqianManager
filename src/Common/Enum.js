//账户状态
export const accountStatus = [
  { name: "正常", value: "1" },
  { name: "注销", value: "0" }
];

//认证状态
export const authStatus=[{value:'001001',name:'新建'},{value:'001002',name:'身份校验通过'},{value:'001003',name:'工号校验通过'},{value:'001004',name:'注册'}]

//发送状态
export const sendStatus=[{value:'0',name:'未发送'},{value:'1',name:'已发送'},{value:'2',name:'撤回'}];

//BANNER管理 发布状态
export const releaseStatus = [
    { name: "已发布", value: "1" },
    { name: "未发布", value: "0" }
  ];

//BANNER管理 链接类型
export const linkType = [
    { name: "外部网页", value: "1" },
    { name: "图片", value: "2" },
    { name: "无链接", value: "3" }
];

//BANNER管理 手机适配
export const phoneConfiguration = [
    { label: "苹果", value: "1" },
    { label: "安卓", value: "2" }
];
//身份证校验规则
export const idNoValidate = /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9X]$/;

//姓名校验规则,限制中文符号
export const nameValidate = /^([\u4e00-\u9Fa5]+(·[\u4e00-\u9Fa5]+)?)$/;

//秒数限制为 0 或者30
export const seconds = /^0|30$/;

//验证码时间1-5分钟
export const verMinutes = /^[1-5]$/;

//验证码时间1-15分钟
export const mesMinutes = /^[1-9]$|1[0-5]$/;

//1-10个数
export const bannerCounts = /^[1-9]$|10$/;

//强制登出时间
export const layoutTime = /^[1-9]$|^[1-9][0-9]$|^1[0-1]\d$|120$/;


//期数限制
export const tearms = /^12|24|36$/;

//身份证日期格式
export const dateFormat = 'YYYY.MM.DD';

//银行卡管理按钮权限
export const buttonList = [
    {url:'manage/customer/bankListManage',value:'bankCardManage',name:'银行卡管理'},
    {url:'manage/customer/destroy',value:'destroy',name:'注销'},
    {url:'manage/customer/reAuth',value:'updateAuth',name:'修改认证'},
    {url:'manage/customer/changeBankCard',value:'updateBankCard',name:'变更银行卡'},
];

//banner按钮权限
export const buttonBannerList = [
    {url:'manage/banner/release',value:'release',name:'发布'},
    {url:'manage/banner/addOn',value:'addOn',name:'新增已启用'},
    {url:'manage/banner/updateOn',value:'updateOn',name:'修改已启用'},
    {url:'manage/banner/delOn',value:'delOn',name:'删除已启用'},
    {url:'manage/banner/stop',value:'stop',name:'停用'},
    {url:'manage/banner/addOff',value:'addOff',name:'新增未启用'},
    {url:'manage/banner/updateOff',value:'updateOff',name:'修改未启用'},
    {url:'manage/banner/delOff',value:'delOff',name:'删除未启用'},
    {url:'manage/banner/start',value:'start',name:'启用'},
];

//推送管理按钮权限
export const pustButtonList = [
    {url:'manage/push/newContent',value:'newContent',name:'新建'},
    {url:'manage/push/detailSave',value:'detailSave',name:'详情保存'},
    {url:'manage/push/recall',value:'recall',name:'详情撤回'},
    {url:'manage/push/newPush',value:'newPush',name:'新增推送'},
    {url:'manage/push/detailPush',value:'detailPush',name:'详情推送'},
];

//系统配置按钮权限
export const configButtonList = [
    {url:'manage/sysConfig/save',value:'sysSave',name:'系统保存'},
    {url:'manage/sysConfig/push',value:'sysPush',name:'系统推送'},
    {url:'manage/bizConfig/save',value:'bizSave',name:'业务保存'},
    {url:'manage/bizConfig/push',value:'bizPush',name:'业务推送'},
];