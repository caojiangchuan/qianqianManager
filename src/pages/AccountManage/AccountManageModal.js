import React from 'react';
import {Form, Input, Modal, Col, Row, Upload, Icon, Table, Tag, Button, Select, DatePicker} from 'antd';
import {formatMessage} from 'umi/locale';
import styles from './AccountManage.less';
import Utils from '../../Common/Utils';
import moment from "moment";
import {idNoValidate, nameValidate, dateFormat} from '../../Common/Enum'

const FormItem = Form.Item;
const Util = new Utils();

class AccountManageModal {
    //银行卡管理
    BankCardManageList = Form.create()(props => {
        const {bankCardManageVisible, closeBankCardManageModalVisible, bankCardList, handleChangeBankCardVisible, Contracts,updateBankCard,
            form, ContractRecord, setContractRecord} = props;
        //取消
        const cancelHandle = () => {
            closeBankCardManageModalVisible(false)
        }
        //变更还款卡
        const changeBankCard = (flag, record) => {
            handleChangeBankCardVisible(flag, record);
        }

        //获取合同信息
        const getContract = (value) => {
            //根据value过滤出合同对象
            let contract = Contracts.find(function (item, index) {
                return item.loanNo === value;
            })
            if (!Util.isNotNull(contract)) {
                contract = {};
            }
            contract.contractNum = contract.loanNo;
            setContractRecord(contract)
        }

        const columns = [
            {
                title: '序号',
                dataIndex: 'index',
                render: (text, record, index) => `${index + 1}`
            },
            {
                title: '卡号',
                dataIndex: 'account',
                render: Util.handleAccountNo
            },
            {
                title: '所属银行',
                dataIndex: 'bankName',
            },
            {
                title: '所属支行',
                dataIndex: 'bankBranchName',
            },
            {
                title: '银行绑定手机',
                dataIndex: 'mobileStr',
            },
            {
                title: '还款卡',
                dataIndex: 'masterCard',
                render: (text, index) => {
                    if ('00' === text) {
                        return '是'
                    } else {
                        return ''
                    }
                }
            }, {
                title: '操作',
                render: (text, record) => {
                    return (
                        <div>
                            <a hidden={!updateBankCard} disabled={('00' === record.masterCard || '0' === record.changeFlag) ? true : false}
                               className={styles.tagStyle} onClick={() => changeBankCard(true, record)}>变更还款卡</a>
                        </div>
                    );
                }
            }
        ]
        const formItemLayout = {labelCol: {span: 8}, wrapperCol: {span: 16}};
        const formItemStytle = {labelCol: {span: 9}, wrapperCol: {span: 15}};
        return (
            <Modal
                maskClosable={false}
                title="银行卡管理"
                visible={bankCardManageVisible}
                onCancel={cancelHandle}
                width={1000}
                cancelText="取消"
                footer={null}
                destroyOnClose={true}
            >
                <Form>
                    <Row><Col span={7}>
                        <FormItem {...formItemLayout} label={'关联借款合同'}>{form.getFieldDecorator('loanNo', {
                            rules: [{required: false, message: '请选择关联借款合同'}]
                        })
                        (<Select
                            onSelect={getContract}>{Util.dropDownOption(Contracts, 'loanNo', 'loanNo')}</Select>)}</FormItem>
                    </Col>
                        <Col span={5}>
                            <FormItem {...formItemStytle} label={'放款额'}>
                                {(
                                    <span>{`${Util.isNotNull(ContractRecord.grantMoney) ? ContractRecord.grantMoney : ''}`}</span>)}</FormItem>
                        </Col>
                        <Col span={5}>
                            <FormItem {...formItemStytle} label={'放款期限'}>
                                {(
                                    <span>{`${Util.isNotNull(ContractRecord.grantTime) ? ContractRecord.grantTime : ''}`}</span>)}</FormItem>
                        </Col>
                        <Col span={7}>
                            <FormItem {...formItemStytle} label={'放款时间'}>
                                {(
                                    <span>{`${Util.isNotNull(ContractRecord.grantMoneyDate) ? ContractRecord.grantMoneyDate : ''}`}</span>)}</FormItem>
                        </Col>
                    </Row>
                </Form>
                <Table dataSource={bankCardList} columns={columns} rowKey={'id'} bordered/>
            </Modal>
        );
    });

    //注销
    Cancellation = Form.create()(props => {
        const {cancellationManageVisible, handleCancellationVisible, form, getCaptcha, count, selectedRecord, handleCancellation, handleSendMessage} = props;
        //取消
        const cancelHandle = () => {
            handleCancellationVisible(false, {})
        }
        //发送验证码
        const sendMessage = () => {
            handleSendMessage(selectedRecord.mobile)
        }
        //注销
        const cancellation = () => {
            form.validateFields((err, fieldsValue) => {
                if (err) return;
                fieldsValue.mobile = selectedRecord.mobile;
                fieldsValue.cid = selectedRecord.id;
                fieldsValue.smsType = 9; //注销
                handleCancellation(fieldsValue)
            })
        }

        const onGetCaptcha = () => {
            sendMessage()
            getCaptcha()
        };

        const formItemLayout = {labelCol: {span: 8}, wrapperCol: {span: 16}};
        return (
            <Modal
                maskClosable={false}
                title="注销"
                visible={cancellationManageVisible}
                onCancel={cancelHandle}
                cancelText="取消"
                footer={null}
                destroyOnClose={true}
            >
                <Form>
                    <Row>
                        <Col span={12}><FormItem {...formItemLayout} label="注册手机:">{(
                            <span>{`${Util.isNotNull(selectedRecord.mobile) ? Util.handleSensitiveField(selectedRecord.mobile) : ''}`}</span>)}</FormItem></Col>
                        <Col span={12}><FormItem {...formItemLayout}>
                            {(<Button size="large"
                                      disabled={count}
                                      className={styles.getCaptcha}
                                      onClick={() => onGetCaptcha()}>{count ? `${count} s` : formatMessage({id: 'app.register.get-verification-code'})}</Button>)}</FormItem></Col>
                    </Row>
                    <Row>
                        <Col span={12}><FormItem {...formItemLayout} label="验证码:">{form.getFieldDecorator('smsCode', {
                            rules: [{required: true, message: '请输入验证码'}]
                        })(<Input/>)}</FormItem></Col>
                    </Row>
                    <Row style={{textAlign: 'center'}}><Col span={24}>
                        <Button type="primary" htmlType="submit" onClick={() => {
                            cancellation()
                        }}>注销</Button></Col></Row>
                </Form>
            </Modal>
        );
    })

    //修改认证
    UpdateAuth = Form.create()(props => {
        const {
            updateAuthVisible, handleUpdateAuthVisible, form, selectedRecord, tips, handleIdTimeRange,
            handleImageView, viewImage, imageUrl, updateAuth, province
        } = props;
        //取消
        const cancelHandle = () => {
            handleUpdateAuthVisible(false, {})
        }
        const okHandle = () => {
            form.validateFields((err, fieldsValue) => {
                if (err || Util.isNotNull(tips)) return;
                fieldsValue.id = selectedRecord.id;
                fieldsValue.startDate = Util.formatDateYYYYMMDD(fieldsValue.startDate)
                fieldsValue.endDate = Util.formatDateYYYYMMDD(fieldsValue.endDate)
                handleIdTimeRange(fieldsValue)
                updateAuth(fieldsValue)
            });
        };
        //取消预览
        const handleCancel = (flag, url) => {
            handleImageView(flag, url)
        }

        //监听日期变化
        const changeDate = (value) => {
            let params = {
                startDate: Util.isNotNull(value.startDate) ? value.startDate : form.getFieldsValue().startDate,
                endDate: Util.isNotNull(value.endDate) ? value.endDate : form.getFieldsValue().endDate
            }

            handleIdTimeRange(params)

        }

        const formItemLayout = {labelCol: {span: 9}, wrapperCol: {span: 15}};
        return (
            <Modal
                maskClosable={false}
                title="修改认证"
                visible={updateAuthVisible}
                onCancel={cancelHandle}
                width={800}
                onOk={okHandle}
                cancelText="取消"
                destroyOnClose={true}
            >
                <Form>
                    <Row>
                        <Col span={6}><FormItem {...formItemLayout}
                                                className={styles.itemSpaceBetween}></FormItem></Col>
                        <Col span={8}><FormItem {...formItemLayout} className={styles.itemSpaceBetween}>{(
                            <span>认证信息</span>)}</FormItem></Col>
                        <Col span={10}><FormItem {...formItemLayout} className={styles.itemSpaceBetween}>{(
                            <span>修改信息</span>)}</FormItem></Col>
                    </Row>
                    <Row>
                        <Col span={6}><FormItem {...formItemLayout} className={styles.itemSpaceBetween}><span>姓名:</span></FormItem></Col>
                        <Col span={8}><FormItem {...formItemLayout} className={styles.itemSpaceBetween}>{(
                            <span>{`${Util.isNotNull(selectedRecord.name) ? selectedRecord.name : ''}`}</span>)}</FormItem></Col>
                        <Col span={10}><FormItem {...formItemLayout}
                                                className={styles.itemSpaceBetween}>{form.getFieldDecorator('name', {
                            rules: [{required: true, pattern: nameValidate, message: '姓名有误，请重新输入'}],
                            initialValue: Util.isNotNull(selectedRecord.name) ? selectedRecord.name : ''
                        })(<Input maxLength={20}/>)}</FormItem></Col>
                    </Row>
                    <Row>
                        <Col span={6}><FormItem {...formItemLayout} className={styles.itemSpaceBetween}><span>身份证号:</span></FormItem></Col>
                        <Col span={8}><FormItem {...formItemLayout} className={styles.itemSpaceBetween}>{(
                            <span>{`${Util.isNotNull(selectedRecord.idNo) ? selectedRecord.idNo : ''}`}</span>)}</FormItem></Col>
                        <Col span={10}><FormItem {...formItemLayout} className={styles.itemSpaceBetween}>{
                            form.getFieldDecorator('idNo', {
                                rules: [{
                                    required: true, message: '身份证信息有误,请重新输入',
                                    pattern: idNoValidate
                                }],
                                initialValue: Util.isNotNull(selectedRecord.idNo) ? selectedRecord.idNo : ''
                            })(<Input/>)}</FormItem></Col>
                    </Row>
                    <Row>
                        <Col span={6}><FormItem {...formItemLayout} className={styles.itemSpaceBetween}><span>身份证有效期起:</span></FormItem></Col>
                        <Col span={8}><FormItem {...formItemLayout} className={styles.itemSpaceBetween}>{(
                            <span>{`${Util.isNotNull(selectedRecord.startDate) ? selectedRecord.startDate : ''}`}</span>)}</FormItem></Col>
                        <Col span={10}><FormItem {...formItemLayout} help={tips}
                                                validateStatus={tips ? 'error' : 'success'}
                                                className={styles.itemSpaceBetween}>{form.getFieldDecorator('startDate', {
                            rules: [{required: true}],
                            initialValue: Util.isNotNull(selectedRecord.startDate)?moment(selectedRecord.startDate, dateFormat):''
                        })(<DatePicker showToday={false} allowClear={false} style={{width: 199}} format={dateFormat}
                                       onChange={(event) => {
                                           changeDate({startDate: Util.formatDateYMD(moment(event._d, dateFormat))})
                                       }}/>)}</FormItem></Col>
                    </Row>
                    <Row>
                        <Col span={6}><FormItem {...formItemLayout} className={styles.itemSpaceBetween}><span>身份证有效期止:</span></FormItem></Col>
                        <Col span={8}><FormItem {...formItemLayout} className={styles.itemSpaceBetween}>{(
                            <span>{`${Util.isNotNull(selectedRecord.endDate) ? selectedRecord.endDate : ''}`}</span>)}</FormItem></Col>
                        <Col span={10}><FormItem {...formItemLayout} help={tips}
                                                validateStatus={tips ? 'error' : 'success'}
                                                className={styles.itemSpaceBetween}>{form.getFieldDecorator('endDate', {
                            rules: [{required: true}],
                            initialValue: Util.isNotNull(selectedRecord.endDate)?moment(selectedRecord.endDate, dateFormat):''
                        })(<DatePicker showToday={false} allowClear={false} style={{width: 199}} format={dateFormat}
                                       onChange={(event) => {
                                           changeDate({endDate: Util.formatDateYMD(moment(event._d, dateFormat))})
                                       }}/>)}</FormItem></Col>
                    </Row>
                    <Row>
                        <Col span={6}><FormItem {...formItemLayout} className={styles.itemSpaceBetween}><span>户籍所在省:</span></FormItem></Col>
                        <Col span={8}><FormItem {...formItemLayout} className={styles.itemSpaceBetween}>{(
                            <span>{`${Util.isNotNull(selectedRecord.province) ? selectedRecord.province : ''}`}</span>)}</FormItem></Col>
                        <Col span={10}><FormItem {...formItemLayout}
                                                className={styles.itemSpaceBetween}>{form.getFieldDecorator('province', {
                            rules: [{required: true, message: '请选择户籍所在省'}],
                            initialValue: Util.isNotNull(selectedRecord.province) ? selectedRecord.province : ''
                        })(<Select showSearch
                                   >{Util.dropDownOption(province, 'dataValue', 'dataValue')}</Select>)}</FormItem></Col>
                    </Row>
                    <Row>
                        <Col span={24} style={{textAlign: 'center'}}><FormItem {...formItemLayout}
                                                                               className={styles.itemSpaceBetween}>{(
                            <div><div>
                                <Col span={12}>
                                    <img className={styles.cardIcon}
                                         onClick={() => handleCancel(true, selectedRecord.idZ)}
                                         src={`${selectedRecord.idZ}`} style={{width: '100px', height: '100px'}}/>
                                    <br/><span>身份证正面</span>
                                </Col></div><div>
                                <Col span={12} >
                                    <img className={`${styles.cardIcon}`}
                                         onClick={() => handleCancel(true, selectedRecord.idF)}
                                         src={`${selectedRecord.idF}`} style={{width: '100px', height: '100px'}}/>
                                    <br/><span>身份证反面</span>
                                </Col></div>
                            </div>
                            )}
                        </FormItem></Col>
                    </Row>
                </Form>
                <Modal style={{textAlign: 'center'}} visible={viewImage} footer={null} maskClosable={false}
                       onCancel={() => handleCancel(false)}>
                    <div>
                        <img src={`${imageUrl}`} style={{height: 280, width: 460}}/>
                    </div>
                </Modal>
            </Modal>
        );
    })

    //变更银行卡
    ChangeBankCard = Form.create()(props => {
        const {changeBankCardVisible, form, carRecord, handleChangeBankCardVisible, ContractRecord, changeMasterCard, selectedRecord} = props;
        //取消
        const cancelHandle = () => {
            handleChangeBankCardVisible(false, {})
        }
        const okHandle = () => {
            let value = {};
            //客户id
            value.id = selectedRecord.id;
            //合同号
            value.contractNum = ContractRecord.contractNum;
            //当前合同银行卡号
            value.account = ContractRecord.currentAccount;
            //拟变更的银行卡
            value.toBeAccount = carRecord.account;
            //拟变更的银行名称
            value.toBeBankName = carRecord.bankName;
            //拟变更的支行名称
            value.toBeBankBranchName = carRecord.bankBranchName;
            //拟变更的手机号
            value.mobile = carRecord.mobile;
            //借款编号
            value.loanNo = ContractRecord.loanNo;
            //合同债权去向
            value.loanBelongCode = ContractRecord.loanBelongCode
            changeMasterCard(value);
        };

        const formItemLayout = {labelCol: {span: 10}, wrapperCol: {span: 14}};
        return (
            <Modal
                maskClosable={false}
                title="变更银行卡"
                visible={changeBankCardVisible}
                onCancel={cancelHandle}
                onOk={okHandle}
                cancelText="取消"
                destroyOnClose={true}
            >
                <Form>
                    <Col><FormItem {...formItemLayout} label={'卡号'} className={styles.itemSpaceBetween}>
                        {form.getFieldDecorator('account')(
                            <span>{`${Util.isNotNull(carRecord.account) ? Util.handleAccountNo(carRecord.account) : ''}`}</span>)}</FormItem></Col>
                    <Col><FormItem {...formItemLayout} label={'所属银行'} className={styles.itemSpaceBetween}>
                        {form.getFieldDecorator('bankName')(
                            <span>{`${Util.isNotNull(carRecord.bankName) ? carRecord.bankName : ''}`}</span>)}</FormItem></Col>
                    <Col><FormItem {...formItemLayout} className={styles.itemSpaceBetween} label={'关联借款合同'}>{
                        form.getFieldDecorator('contractNum')(
                            <span>{`${Util.isNotNull(ContractRecord.contractNum) ? ContractRecord.contractNum : ''}`}</span>)}</FormItem></Col>
                    <Col><FormItem {...formItemLayout} className={styles.itemSpaceBetween} label={'放款额'}>{
                        form.getFieldDecorator('grantMoney')(
                            <span>{`${Util.isNotNull(ContractRecord.grantMoney) ? ContractRecord.grantMoney : ''}`}</span>)}</FormItem></Col>
                    <Col><FormItem {...formItemLayout} className={styles.itemSpaceBetween} label={'放款期限'}>{
                        form.getFieldDecorator('grantTime')(
                            <span>{`${Util.isNotNull(ContractRecord.grantTime) ? ContractRecord.grantTime : ''}`}</span>)}</FormItem></Col>
                    <Col><FormItem {...formItemLayout} className={styles.itemSpaceBetween} label={'放款时间'}>{
                        form.getFieldDecorator('grantMoneyDate')(
                            <span>{`${Util.isNotNull(ContractRecord.grantMoneyDate) ? ContractRecord.grantMoneyDate : ''}`}</span>)}</FormItem></Col>
                    <Col><FormItem {...formItemLayout} className={styles.itemSpaceBetween} label={'所选账户当前还款号'}>{
                        form.getFieldDecorator('currentAccount')(
                            <span>{`${Util.isNotNull(ContractRecord.currentAccount) ? Util.handleAccountNo(ContractRecord.currentAccount) : ''}`}</span>)}</FormItem></Col>
                    <Col><FormItem {...formItemLayout} className={styles.itemSpaceBetween} label={'所选账户当前还款银行'}>{
                        form.getFieldDecorator('currentBankName')(
                            <span>{`${Util.isNotNull(ContractRecord.currentBankName) ? ContractRecord.currentBankName : ''}`}</span>)}</FormItem></Col>
                </Form>
            </Modal>
        );
    })

}

export default AccountManageModal;
