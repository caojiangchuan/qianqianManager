import React from 'react';
import {Form, Input, Modal, Col, Row, Upload, Icon, Table, Tag, Button, Select, InputNumber,Divider} from 'antd';
import {formatMessage} from 'umi/locale';
import Utils from '../../Common/Utils';
import moment from "moment";
import {bannerCounts, layoutTime, mesMinutes, seconds, sendStatus, tearms, verMinutes} from '../../Common/Enum';
import {message} from "antd/lib/index";

const textarea = Input.TextArea;
const FormItem = Form.Item;
const Util = new Utils();

class ConfigManageModal extends React.Component{

    //各项配置
    BizConfig = Form.create({
        onValuesChange:(props,changedValues,allValues)=>{
            const {disabledBizPush}= props
            disabledBizPush(allValues)
        }
    })(props => {
        const {form,submitting,tips,changeTips,saveBizConfig,pushBizConfig,bizConfig,bizConfigTemp,bizSave,bizPush,disabledBizPushButton} = props;
        const {getFieldDecorator} = form;
        const submitFormLayout = {wrapperCol: {xs: { span: 24, offset: 0 }, sm: { span: 10, offset: 7 },},};


        //保存
        //业务配置提交
        const bizSubmit= e => {
            e.preventDefault();
            form.validateFields((err, fields) => {
                // if(err) return;
                if(!Util.isNotNull(fields.min) || !Util.isNotNull(fields.max)||fields.min<=0 || fields.min>9999999999 || fields.max<=0 || fields.max>9999999999){
                    changeTips(false,'金额上下限，1~9999999999')
                    return;
                }

               if(fields.max-fields.min<0){
                   changeTips(false,'输入不合法,最大金额不能小于最小金额')
                   return;
               }

                changeTips(true,'')
                const value = []
                value.push({dataCode:'rateCal',dataValue:`${fields.min}-${fields.max}-${fields.tearm}`});
                saveBizConfig(value)
            });
        };
        //发布
        const pushConfig=(e)=>{
            e.preventDefault();
            form.validateFields((err, fields) => {
                if(err) return;
                if(!Util.isNotNull(fields.min) || !Util.isNotNull(fields.max)||fields.min<=0 || fields.min>9999999999 || fields.max<=0 || fields.max>9999999999){
                    changeTips(false,'金额上下限，1~9999999999')
                    return;
                }

                if(fields.max-fields.min<0){
                    changeTips(false,'输入不合法,最大金额不能小于最小金额')
                    return;
                }

                changeTips(true,'')
                const value = []
                value.push({dataCode:'rateCal',dataValue:`${fields.min}-${fields.max}-${fields.tearm}`});
                pushBizConfig({dataType:'businessConfig'})
            });
        }

        return (
            <Form onSubmit={bizSubmit} hideRequiredMark style={{ marginTop: 8 }}>
                <Row>
                    <div style={{textAlign:'center'}}>
                        <Col span={6}>
                            <span style={{fontSize:18,fontWeight:'bold'}} >配置项名称</span>
                        </Col>
                        <Col span={6}>
                            <span style={{fontSize:18,fontWeight:'bold'}}>生产配置</span>
                        </Col>
                        <Col span={12}>
                            <span style={{fontSize:18,fontWeight:'bold'}}>修改配置</span>
                        </Col>
                    </div>
                </Row>
                <Divider style={{marginTop:1}} />
                <Row>
                    <div style={{textAlign:'center'}}>
                        <Col span={6}>
                            <span>费率试算</span>
                        </Col>
                        <Col span={6}>
                            <span>{bizConfig.min}元-{bizConfig.max}元 {bizConfig.tearm}期</span>
                        </Col>
                        <Col span={4} >
                            <FormItem help={tips} validateStatus={tips ? 'error' : 'success'} >{getFieldDecorator('min', {rules: [{required: true}],
                                initialValue:Util.isNotNull(bizConfigTemp.min)?bizConfigTemp.min: ''})
                            (<InputNumber formatter={value =>`${value}元`}  style={{width:'60%'}}    />)}</FormItem>
                        </Col>
                        <Col span={1}>
                            <span>——</span>
                        </Col>
                        <Col span={4}>
                            <FormItem help={tips} validateStatus={tips ? 'error' : 'success'} >{getFieldDecorator('max', {rules: [{required: true}],
                                initialValue: Util.isNotNull(bizConfigTemp.max)?bizConfigTemp.max: ''})
                            (<InputNumber formatter={value =>`${value}元`}  style={{width:'60%'}} min={1}  />)}</FormItem>
                        </Col>
                        <Col span={3}>
                            <FormItem>{getFieldDecorator('tearm', {rules: [{required: true,message:'期数只能为12、24、36',pattern:tearms}],
                                initialValue: Util.isNotNull(bizConfigTemp.tearm)?bizConfigTemp.tearm: ''})
                            (<InputNumber formatter={value =>`${value}期`} style={{width:'50%'}} min={12}  step={12} />)}</FormItem>
                        </Col>
                    </div>
                </Row>

                <Divider style={{marginTop:0}} />
                <div style={{textAlign:'center'}}>
                    <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
                        <Button hidden={!bizSave} type="primary" htmlType="submit" loading={submitting}>保存</Button>
                        <Button hidden={!bizPush} disabled={disabledBizPushButton} style={{ marginLeft: 80 }} onClick={pushConfig}>发布</Button>
                    </FormItem>
                </div>
            </Form>
        );
    })


    SysConfig = Form.create({
        onValuesChange:(props,changedValues,allValues)=>{
            const {disabledSysPush}= props
            disabledSysPush(allValues)
        }
    })(props => {
        const {form,submitting,smsValid,handleSeconds,smsSendSeconds,sysPush,
            sysSave,bannerUnValidCount,bannerCount,logoutSeconds,handleVerSeconds,handleMinute,
            handleVerMinute,handleSysConfigSave,handleSysConfigPush,disabledSysPushButton} = props;
        const {getFieldDecorator} = form;
        const submitFormLayout = {wrapperCol: {xs: { span: 24, offset: 0 }, sm: { span: 10, offset: 7 },},};


        //保存
        const handleSubmit = e => {
            e.preventDefault();
            form.validateFields((err, values) => {
                if (err) return;
                handleSysConfigSave(values);
            });

        };

        //发布
        const pushSysConfig=(e)=>{
            e.preventDefault();
            form.validateFields((err, fields) => {
                if(err) return;
                handleSysConfigPush({dataType:'sysConfig'})
            });
        }
        //验证码发送间隔时间
        const changeMinute =(value)=>{
            handleMinute(value,form)
        }

        //验证码发送间隔时间
        const changeVerMinute =(value)=>{
            handleVerMinute(value,form)
        }

        return (
            <Form onSubmit={handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
                <Row>
                    <div style={{textAlign:'center'}}>
                        <Col span={3}></Col>
                        <Col span={6}>
                            <span style={{fontSize:18,fontWeight:'bold'}} >配置项名称</span>
                        </Col>
                        <Col span={6}>
                            <span style={{fontSize:18,fontWeight:'bold'}}>生产配置</span>
                        </Col>
                        <Col span={6}>
                            <span style={{fontSize:18,fontWeight:'bold'}}>修改配置</span>
                        </Col>
                        <Col span={3}></Col>
                    </div>
                </Row>
                <Divider style={{marginTop:1}} />
                <Row>
                    <div style={{textAlign:'center'}}>
                        <Col span={3}></Col>
                        <Col span={6}>
                            <span>验证码有效时间</span>
                        </Col>
                        <Col span={6}>
                            <span>{smsValid.value} 分钟</span>
                        </Col>
                        <Col span={3} >
                            <FormItem  >{getFieldDecorator('minute', {rules: [{pattern:mesMinutes,required: true, message: '验证码有效时间范围请设置为1~15分钟'},],
                                initialValue:Util.isNotNull(smsValid.minute)?smsValid.minute: ''})
                            (<InputNumber formatter={value =>`${value}分钟`} min={1} onChange={changeMinute} />)}</FormItem>
                        </Col>
                        <Col span={3}>
                            <FormItem>{getFieldDecorator('seconds',{ rules: [{pattern:seconds,message:'秒数只能是0或者30'}],
                                initialValue:Util.isNotNull(smsValid.seconds)?smsValid.seconds:0})
                            (<InputNumber  disabled={handleSeconds} formatter={value =>`${value}秒`} min={0} max={30}  step={30} />)}</FormItem>
                        </Col>
                    </div>
                </Row>
                <Divider style={{marginTop:0}} />
                <Row>
                    <div style={{textAlign:'center'}}>
                        <Col span={3}></Col>
                        <Col span={6}>
                            <span>验证码发送间隔时间</span>
                        </Col>
                        <Col span={6}>
                            <span>{smsSendSeconds.value} 分钟</span>
                        </Col>
                        <Col span={3} >
                            <FormItem  >{getFieldDecorator('verMinute', {rules: [{pattern:verMinutes,required: true, message: '验证码发送间隔时间范围请设置为1~5分钟'},],
                                initialValue: Util.isNotNull(smsSendSeconds.verMinute)?smsSendSeconds.verMinute:''})
                            (<InputNumber formatter={value =>`${value}分钟`} min={1} onChange={changeVerMinute} />)}</FormItem>
                        </Col>
                        <Col span={3}>
                            <FormItem>{getFieldDecorator('verSeconds',{rules: [{pattern:seconds,message:'秒数只能是0或者30'}],
                                initialValue:Util.isNotNull(smsSendSeconds.verSeconds)?smsSendSeconds.verSeconds:0})
                            (<InputNumber disabled={handleVerSeconds} formatter={value =>`${value}秒`} min={0} max={30}  step={30} />)}</FormItem>
                        </Col>
                    </div>
                </Row>
                <Divider style={{marginTop:0}} />
                <Row>
                    <div style={{textAlign:'center'}}>
                        <Col span={3}></Col>
                        <Col span={6}>
                            <span>强制登出时间</span>
                        </Col>
                        <Col span={6}>
                            <span>{logoutSeconds.value} 小时</span>
                        </Col>
                        <Col span={6} >
                            <FormItem  >{getFieldDecorator('logout', {rules: [{pattern:layoutTime,required: true, message: '强制登出时间范围请设置为1~120小时'},],
                                initialValue: Util.isNotNull(logoutSeconds.logout)?logoutSeconds.logout:''})
                            (<InputNumber formatter={value =>`${value}小时`} min={1} />)}</FormItem>
                        </Col>
                    </div>
                </Row>
                <Divider style={{marginTop:0}} />

                <Row>
                    <div style={{textAlign:'center'}}>
                        <Col span={3}></Col>
                        <Col span={6}>
                            <span>前台BANNER图位置个数</span>
                        </Col>
                        <Col span={6}>
                            <span>{bannerCount.dataValue}</span>
                        </Col>
                        <Col span={6} >
                            <FormItem  >{getFieldDecorator('bannerFrontCount', {rules: [{pattern:bannerCounts,required: true, message: '前台BANNER图位置个数请设置为1~10的整数'},],
                                initialValue: Util.isNotNull(bannerCount.bannerFrontCount)?bannerCount.bannerFrontCount:''})
                            (<InputNumber min={1}   />)}</FormItem>
                        </Col>
                    </div>
                </Row>
                <Divider style={{marginTop:0}} />
                <Row>
                    <div style={{textAlign:'center'}}>
                        <Col span={3}></Col>
                        <Col span={6}>
                            <span>后台BANNER已启用未发布个数</span>
                        </Col>
                        <Col span={6}>
                            <span>{bannerUnValidCount.dataValue}</span>
                        </Col>
                        <Col span={6} >
                            <FormItem  >{getFieldDecorator('bannerBackCount', {rules: [{pattern:bannerCounts,required: true, message: '后台BANNER已启用未发布个数请设置为1~10的整数'},],
                                initialValue: Util.isNotNull(bannerUnValidCount.bannerBackCount)?bannerUnValidCount.bannerBackCount:''})
                            (<InputNumber min={1}  />)}</FormItem>
                        </Col>
                    </div>
                </Row>
                <Divider style={{marginTop:0}} />
                <div style={{textAlign:'center'}}>
                    <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
                        <Button hidden={!sysSave} type="primary" htmlType="submit" loading={submitting}>保存</Button>
                        <Button hidden={!sysPush} disabled={disabledSysPushButton} style={{ marginLeft: 80 }} onClick={pushSysConfig}>发布</Button>
                    </FormItem>
                </div>
            </Form>
        );
    })

}

export default ConfigManageModal;
