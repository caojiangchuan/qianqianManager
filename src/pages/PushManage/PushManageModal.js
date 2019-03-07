import React from 'react';
import {Form, Input, Modal, Col, Row, Upload, Icon, Table, Tag, Button, Select, DatePicker} from 'antd';
import {formatMessage} from 'umi/locale';
import Utils from '../../Common/Utils';
import moment from "moment";
import {sendStatus} from '../../Common/Enum';

const textarea = Input.TextArea;
const FormItem = Form.Item;
const Util = new Utils();

class PushManageModal {

    //新增推送消息
    AddContent = Form.create()(props => {
        const {addContentVisible,showAddModal,form,handleAddContent,pushMessage,newPush} = props;
        //取消
        const cancelHandle = () => {
            showAddModal(false)
        }
        //保存
        const okHandle = () => {
            form.validateFields((err, fieldsValue) => {
                if (err) return;
                handleAddContent(fieldsValue);

            });
        };
        //推送
        const pushContent=()=>{
            form.validateFields((err, fieldsValue) => {
                if (err) return;
                pushMessage(fieldsValue);

            })
        }

        const formItemLayout = {labelCol: {span: 4}, wrapperCol: {span: 20}};
        return (
            <Modal
                maskClosable={false}
                title="新建"
                visible={addContentVisible}
                onCancel={cancelHandle}
                width={500}
                destroyOnClose={true}
                footer={<div>
                    <Button type="primary" onClick={okHandle}>保存</Button>
                    <Button  type="primary" onClick={cancelHandle}>取消</Button>
                    {/*<Button hidden={!newPush} onClick={pushContent}>推送</Button>*/}
                </div>}
            >
                <Form>
                    <Row >
                        <Col span={24}>
                            <FormItem {...formItemLayout} label="推送内容:">{form.getFieldDecorator('content',
                                {rules: [{required: true,message: '请输入内容'}]})(
                                <textarea   style={{height:130,width:300}} maxLength={50}/>)}</FormItem>
                        </Col>
                    </Row>
                </Form>

            </Modal>
        );
    })

    //查看详情
    Detail = Form.create({
        onValuesChange:(props,changedValues,allValues)=>{
            const {changeContent}= props
            changeContent(allValues)
        }
    })(props => {
        const {form,detailVisible,pushMessage,handleDetail,detail,updateDetail,recallMessage,detailSave,recall,detailPush,notAllowPush} = props;
        //取消
        const cancelHandle = () => {
            handleDetail(false,{})
        }
        //保存
        const okHandle = () => {
            form.validateFields((err, fieldsValue) => {
                if (err) return;
                fieldsValue.id = detail.id;
                updateDetail(fieldsValue)

            });
        };

        //推送
        const pushContent=()=>{
            form.validateFields((err, fieldsValue) => {
                if (err) return;
                fieldsValue.id = detail.id;
                pushMessage(fieldsValue);

            })
        }
        //撤回
        const recallContent =()=>{
            recallMessage({id:detail.id})
        }

        const formItemLayout = {labelCol: {span: 5}, wrapperCol: {span: 15}};
        return (
            <Modal
                maskClosable={false}
                title="查看详情"
                visible={detailVisible}
                onCancel={cancelHandle}
                width={600}
                destroyOnClose={true}
                footer={<div>
                    <Button hidden={!detailSave} disabled={detail.status==='0'?false:true} type="primary" onClick={okHandle}>保存</Button>
                    <Button hidden={!detailPush} disabled={(detail.status==='0'&& false===notAllowPush)?false:true} onClick={pushContent}>推送</Button>
                    <Button hidden={!recall} disabled={detail.status==='1'?false:true} onClick={recallContent}>撤回</Button></div>}
            >
                <FormItem  {...formItemLayout} label="创建时间">
                    {form.getFieldDecorator('createTimeStr', {
                        initialValue: Util.isNotNull(detail.createTimeStr) ? detail.createTimeStr : '',
                    })(<Input disabled={true} />)}
                </FormItem>
                <FormItem   {...formItemLayout} label="创建人">
                    {form.getFieldDecorator('creater', {
                        initialValue: Util.isNotNull(detail.creater) ? detail.creater : '',
                    })(<Input disabled={true} />)}
                </FormItem>

                <FormItem {...formItemLayout} label="最后修改人">
                    {form.getFieldDecorator('lastUpdater', {
                        initialValue: Util.isNotNull(detail.lastUpdater) ? detail.lastUpdater:''
                    })(<Input disabled={true} />)}
                </FormItem>
                <FormItem {...formItemLayout} label="推送内容">
                    {form.getFieldDecorator('content', {
                        rules: [{required: true, message: '请输入推送内容'}],
                        initialValue: Util.isNotNull(detail.content) ?detail.content : ''
                    })(<textarea disabled={detail.status==='0'?false:true}  maxLength={50} style={{height:130,width:345}} />)}
                </FormItem>
                <FormItem {...formItemLayout} label="推送状态">
                    {form.getFieldDecorator('status', {
                        initialValue: Util.isNotNull(detail.status) ? detail.status : '',
                    })(<Select disabled={true} style={{width:345}}>{Util.dropDownOption(sendStatus,'value','name')}</Select>)}
                </FormItem>
                <FormItem {...formItemLayout} label="撤回时间">
                    {form.getFieldDecorator('retractTimeStr', {
                        initialValue: Util.isNotNull(detail.retractTimeStr) ? detail.retractTimeStr : '',
                    })(<Input disabled={true} />)}
                </FormItem>
                <FormItem {...formItemLayout} label="撤回人">
                    {form.getFieldDecorator('retractUpdater', {
                        initialValue: Util.isNotNull(detail.retractUpdater) ? detail.retractUpdater : '',
                    })(<Input disabled={true} />)}
                </FormItem>
            </Modal>
        );
    })

}

export default PushManageModal;
