import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
    Form,
    Input,
    DatePicker,
    Select,
    Button,
    Card,
    InputNumber,
    Radio,
    Icon,
    Tooltip,
    Row,
    Col,Divider,Tabs
} from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import ConfigManageModal from './ConfigManageModal'
import {message, Modal} from "antd/lib/index";
import Utils from "../../Common/Utils";
import {seconds,configButtonList,verMinutes,mesMinutes,bannerCounts,layoutTime} from "../../Common/Enum";

const Util = new Utils();
const {BizConfig,SysConfig} = new ConfigManageModal();
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;

@connect(({ configManage,loading }) => ({
    configManage,
    loading:loading.effects['configManage/fetch'],
}))
@Form.create()
class ConfigManage extends PureComponent {

    state = {
        tips:'',
        smsValid:{}, //验证码有效时间
        smsSendSeconds:{}, //验证码发送间隔时间
        logoutSeconds:{}, //强制登出时间
        bannerCount:{}, //前台BANNER图位置个数
        bannerUnValidCount:{}, //后台BANNER已启用未发布个数
        bizConfig:{min:'',max:'',tearm:''},//业务项配置
        bizConfigTemp:{min:'',max:'',tearm:''},//业务项配置发布项
        sysSave:false,     //系统保存
        sysPush:false,     //系统推送
        bizSave:false,     //业务保存
        bizPush:false,     //业务推送
        handleSeconds:false,    //置灰秒选按钮
        handleVerSeconds:false, //置灰秒选按钮
        pushButton:false, //置灰推送按钮
        disabledBizPushButton:false,
        disabledSysPushButton:false,
    }

    componentDidMount() {
        const buttonAuth = localStorage.getItem('buttonAuth');
        const list = buttonAuth.split(',')
        this.checkButton(list)
        this.getData()
        this.getBizData();
        this.changeTab('1');
    }


    //判断按钮是否可见
    checkButton = (buttonAuth) => {
        const list = configButtonList;
        list.forEach((item) => {
            buttonAuth.find(element => {
                if (item.url === element) {
                    if ('sysSave' === item.value) {
                        this.setState({
                            sysSave: true
                        })
                    } else if ('sysPush' === item.value) {
                        this.setState({
                            sysPush: true
                        })
                    } else if ('bizSave' === item.value) {
                        this.setState({
                            bizSave: true
                        })
                    } else if ('bizPush' === item.value) {
                        this.setState({
                            bizPush: true
                        })
                    }
                }
            })
        })
    }


    //获取数据
    getData =()=>{
        const { dispatch } = this.props;
        dispatch({
            type: 'configManage/fetch',
            payload: {dataType:'sysConfig'},
            callback: response => {
                if (Util.success(response)) {
                    const  list = response.data;
                    if(Util.isNotNull(response.data)){
                        list.forEach((item)=>{
                            if('sms_valid'===item.dataCode){
                                item.value =item.dataValue/60;
                                item.minute = Math.floor(item.dataValueTemp/60)
                                item.seconds =item.dataValueTemp%60
                                if(item.minute>=15){
                                    this.handleMinute(item.minute)
                                }
                                this.setState({
                                    smsValid:item
                                })
                            }else if('sms_send_seconds'===item.dataCode){
                                item.value =item.dataValue/60;
                                item.verMinute = Math.floor(item.dataValueTemp/60)
                                item.verSeconds =item.dataValueTemp%60
                                if(item.verMinute>=5){
                                    this.handleVerMinute(item.verMinute)
                                }
                                this.setState({
                                    smsSendSeconds:item
                                })
                            }else if('logout_seconds'===item.dataCode){
                                item.value =item.dataValue/3600;
                                item.logout = Math.floor(item.dataValueTemp/3600)
                                this.setState({
                                    logoutSeconds:item
                                })
                            }else if('banner_count'===item.dataCode){
                                item.bannerFrontCount = item.dataValueTemp;
                                this.setState({
                                    bannerCount:item
                                })
                            }else if('banner_unValid_count'===item.dataCode){
                                item.bannerBackCount = item.dataValueTemp;
                                this.setState({
                                    bannerUnValidCount:item
                                })
                            }
                        })
                    }
                }else{
                    message.error('查询数据失败')
                }
            }
        });

    }
    //获取业务配置
    getBizData =()=>{
        const { dispatch } = this.props;
        dispatch({
            type: 'configManage/fetch',
            payload: {dataType: 'businessConfig'},
            callback: response => {
                if(Util.success(response)){
                    const data = response.data[0].dataValue.split('-');
                    const temp = response.data[0].dataValueTemp.split('-');
                    this.setState({
                        bizConfig:{
                            min:data[0],
                            max:data[1],
                            tearm:data[2],
                        },
                        bizConfigTemp:{
                            min:temp[0],
                            max:temp[1],
                            tearm:temp[2],
                        }
                    })
                }else{
                    message.error('查询数据失败')
                }

            }
        })
    }

    //系统项配置保存
    handleSysConfigSave = values => {
        const { dispatch } = this.props;
            Modal.confirm({
                content: '确定要保存吗？',
                okText: '确认',
                cancelText: '取消',
                onOk: () => {
                    const list = this.changeToList(values)
                    dispatch({
                        type: 'configManage/saveSysConfig',
                        payload: list,
                        callback: response => {
                            if (Util.success(response)) {
                                this.getData()
                                this.setState({
                                    disabledSysPushButton:false
                                })
                                message.success('保存成功',1)
                            }else{
                                message.error('保存失败',1)
                            }
                        }
                    });
                }})
    };

    //对象转list
    changeToList =(formValue)=>{
        let list =[];
        const smsValid  = formValue.minute*60+(Util.isNotNull(formValue.seconds)?formValue.seconds:0);
        const smsSendSeconds  = formValue.verMinute*60+(Util.isNotNull(formValue.verSeconds)?formValue.verSeconds:0);
        list.push({dataCode:'sms_valid',dataValue:smsValid})
        list.push({dataCode:'sms_send_seconds',dataValue:smsSendSeconds})
        list.push({dataCode:'logout_seconds',dataValue:3600*(formValue.logout)})
        list.push({dataCode:'banner_count',dataValue:formValue.bannerFrontCount})
        list.push({dataCode:'banner_unValid_count',dataValue:formValue.bannerBackCount})
        return list;
    }

    //系统项配置推送
    handleSysConfigPush = values => {
        const { dispatch } = this.props;
        Modal.confirm({
            content: '确定要发布吗？',
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                    dispatch({
                        type: 'configManage/pushSysConfig',
                        payload: values,
                        callback: response => {
                            if (Util.success(response)) {
                                this.getData()
                                message.success('发布成功',1)
                            }else{
                                message.error('发布失败',1)
                            }
                        }
                    });

            }})

    };


    //修改最小金额
    changeMinHandle =(value)=>{
        const {form} = this.props;
        const fieldValue = form.getFieldsValue();

    }
    //修改最大金额
    changeMaxHandle =(value)=>{
        const {form} = this.props;
        const fieldValue = form.getFieldsValue();

    }

    changeTips = (flag,str)=>{
        if(flag){
            this.setState({
                tips:''
            })
        }else {
            this.setState({
                tips:str
            })
        }
    }
    //保存业务配置
    saveBizConfig =(value)=>{
        const { dispatch } = this.props;
        Modal.confirm({
            content: '确定要保存吗？',
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                dispatch({
                    type: 'configManage/saveSysConfig',
                    payload: value,
                    callback: response => {
                        if (Util.success(response)) {
                            message.success('保存成功',1)
                            this.setState({
                                disabledBizPushButton:false,
                            })
                            this.getBizData();
                        }else{
                            message.error('保存失败',1)
                        }
                    }
                });
            }})
    }

    //推送系统配置
    pushBizConfig=(value)=>{
        const { dispatch } = this.props;
        Modal.confirm({
            content: '确定要发布吗？',
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                dispatch({
                    type: 'configManage/pushSysConfig',
                    payload: value,
                    callback: response => {
                        if (Util.success(response)) {
                            message.success('发布成功',1)
                            this.getBizData();
                        }else{
                            message.error('发布失败',1)
                        }
                    }
                });
            }})
    }
    //切换tab提示
    changeTab =(key)=>{
        const { dispatch } = this.props;
        dispatch({
            type: 'configManage/checkData',
            payload: {dataType:'1'===key?'sysConfig':'businessConfig'},
            callback: response => {
                if (Util.success(response)) {
                    if(!response.data){
                        message.error('配置已变更，请确认是否进行发布')
                    }
                }else{
                    message.error('获取配置项对比异常')
                }
            }
        });
    }

    //验证码有效时间
    handleMinute = (value,form)=>{
        if(value>=15){
            if(form){
                form.setFieldsValue({'seconds':0})
            }
            this.setState({
                handleSeconds:true,
            })
        }else{
            this.setState({
                handleSeconds: false,
            })
        }
    }

    //验证码发送间隔时间
    handleVerMinute = (value,form)=>{
        if(value>=5){
            if(form){
                form.setFieldsValue({'verSeconds':0})
            }
            this.setState({
                handleVerSeconds:true,
            })
        }else{
            this.setState({
                handleVerSeconds: false,
            })
        }
    }

    //置灰业务发布按钮
    disabledBizPush =(allValues)=>{
        const temp = this.state.bizConfigTemp;
        if(temp.min === `${allValues.min}` && temp.max === `${allValues.max}` && temp.tearm === `${allValues.tearm}`){
            this.setState({
                disabledBizPushButton:false,
            })
        }else{
            this.setState({
                disabledBizPushButton:true,
            })
        }
    }

    //置灰系统发布按钮
    disabledSysPush =(allValues)=>{
        const {smsValid,smsSendSeconds,logoutSeconds,bannerCount,bannerUnValidCount}= this.state;

        if(smsValid.minute===allValues.minute && smsValid.seconds===allValues.seconds
            && smsSendSeconds.verMinute===allValues.verMinute && smsSendSeconds.verSeconds=== allValues.verSeconds
            && logoutSeconds.logout===allValues.logout
            && bannerCount.bannerFrontCount===`${allValues.bannerFrontCount}`
            && bannerUnValidCount.bannerBackCount === `${allValues.bannerBackCount}`
        ){
            this.setState({
                disabledSysPushButton:false
            })

        }else {
            this.setState({
                disabledSysPushButton:true
            })
        }
    }




    render() {
        const { submitting } = this.props;
        const {form: { getFieldDecorator}} = this.props;
        const submitFormLayout = {wrapperCol: {xs: { span: 24, offset: 0 }, sm: { span: 10, offset: 7 },},};
        const {tips,smsValid,smsSendSeconds,logoutSeconds,bannerCount,bannerUnValidCount,bizConfig,bizConfigTemp,
            sysSave,sysPush,bizSave,bizPush,handleSeconds,handleVerSeconds,disabledBizPushButton,disabledSysPushButton} = this.state
        const parentMethod = {
            changeTips:this.changeTips,
            pushBizConfig:this.pushBizConfig,
            saveBizConfig:this.saveBizConfig,
            disabledBizPush:this.disabledBizPush,
            handleMinute:this.handleMinute,
            handleVerMinute:this.handleVerMinute,
            handleSysConfigSave:this.handleSysConfigSave,
            handleSysConfigPush:this.handleSysConfigPush,
            disabledSysPush:this.disabledSysPush

        }

        return (
            <GridContent>
                <Tabs style={{background:'white'}} defaultActiveKey="1" onChange={this.changeTab} >
                <TabPane tab="系统配置项" key="1"  >
                <Card bordered={false} >
                        <SysConfig {...parentMethod} smsValid={smsValid} handleSeconds ={handleSeconds }
                                   smsSendSeconds={smsSendSeconds} handleVerSeconds={handleVerSeconds} logoutSeconds={logoutSeconds}
                                   bannerCount={bannerCount} sysSave={sysSave} sysPush={sysPush}  bannerUnValidCount={bannerUnValidCount}
                                   disabledSysPushButton={disabledSysPushButton}  />
                        </Card>
                    </TabPane>
                    <TabPane tab="业务配置项" key="2">
                        <Card bordered={false}>
                            <BizConfig tips={tips} {...parentMethod} disabledBizPushButton={disabledBizPushButton} bizConfig={bizConfig} bizConfigTemp={bizConfigTemp} bizSave={bizSave} bizPush={bizPush}/>
                        </Card>
                    </TabPane>
                </Tabs>
            </GridContent>
        );
    }
}

export default ConfigManage;
