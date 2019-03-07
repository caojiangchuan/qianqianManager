import React, {Component, Fragment} from 'react';
import {connect} from 'dva';
import {Row, Col, Card, Form, Input, Button, DatePicker, message, Table, Icon, Modal, Tag} from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from './AccountManage.less';
import Utils from '../../Common/Utils';
import moment from "moment";
import {accountStatus, authStatus, dateFormat,buttonList} from '../../Common/Enum';
import AccountManageModal from "./AccountManageModal";

const {BankCardManageList, Cancellation, UpdateAuth, ChangeBankCard} = new AccountManageModal();
const Util = new Utils();
const FormItem = Form.Item;
const confirm = Modal.confirm;

@connect(({account, loading}) => ({
    account,
    loading: loading.effects['account/fetch'],
}))
@Form.create()
export default class AccountManage extends Component {
    state = {
        bankCardManageVisible: false, //银行卡列表modal
        updateAuthVisible: false, //修改认证modal
        cancellationManageVisible: false, //注销modal
        changeBankCardVisible: false,//变更银行卡
        bankCardList: [],//银行卡列表
        count: 0,//短信倒计时
        modalVisible: false,
        selectedRecord: {},
        carRecord: {},//银行卡行数据
        Contracts: [],//合同列表
        ContractRecord: {},//放款合同数据
        viewImage: false,
        tips: '',//身份证错误提示
        province: [],//省份信息
        imageUrl: '',
        page: {
            pageNo: 1,
            pageSize: 10,
        },
        currentPage:1,
        totalCount: '',
        updateAuth:false,
        bankCardManage:false,
        updateBankCard:false,
        destroy:false,
        messageTime:70,


    };

    componentDidMount() {
        const buttonAuth = localStorage.getItem('buttonAuth');
        const list = buttonAuth.split(',')
        this.checkButton(list)
    }

    //判断按钮是否可见
    checkButton = (buttonAuth)=>{
        const list = buttonList;
        list.forEach((item)=>{
            buttonAuth.find(element=>{
                if(item.url===element){
                   if('updateAuth'===item.value){
                    this.setState({
                        updateAuth:true
                    })
                   }else if('bankCardManage'===item.value){
                       this.setState({
                           bankCardManage:true
                       })
                   }else if('updateBankCard'===item.value){
                       this.setState({
                           updateBankCard:true
                       })
                   }else if('destroy'===item.value){
                       this.setState({
                           destroy:true
                       })
                   }
                }
            })
        })
    }


    //加载数据
    getData = (value) => {
        const {dispatch} = this.props;
        value.pageSize = this.state.page.pageSize;
        value.pageNo = this.state.page.pageNo;
        dispatch({
            type: 'account/fetch',
            payload: value,
            callback: response => {
                if (Util.success(response)) {
                    if(response.data.list.length===0){
                        message.error('无符合查询条件的账号，请重新输入查询')
                    }
                }else{
                    message.error('查找失败')
                }
            }
        });
    };

    //分页信息改变时触发
    handleChange = (page, pageSize) => {
        const {form} = this.props;
        this.setState({
            page: {
                pageNo: page,
                pageSize: pageSize,
            },
            currentPage:page
        }, () => {
            this.getData(form.getFieldsValue());
        })
    }


    // 重置搜索框
    handleFormReset = () => {
        const {form} = this.props;
        form.resetFields();
    };

    /**
     * 搜索
     * @param e
     */
    handleSearch = (e) => {
        e.preventDefault();
        const {form} = this.props;
        const value = form.getFieldsValue();
        this.setState({
            page:{
                pageNo: 1,
                pageSize: this.state.page.pageSize,
            },
            currentPage:1,
        },()=>{
            this.getData(value);
        })
    };
    //打开变更银行卡窗口
    handleChangeBankCardVisible = (flag, record) => {
        this.setState({
            carRecord: record,
            changeBankCardVisible: flag,
        })
    }

    //确认变更
    changeMasterCard = (value) => {
        const {dispatch} = this.props;
        dispatch({
            type: 'account/changeMasterCard',
            payload: value,
            callback: response => {
                if (Util.success(response)) {
                    message.success('变更申请已提交')
                    this.setContractRecord(this.state.ContractRecord)
                    this.setState({
                        changeBankCardVisible: false
                    })
                } else {
                    message.error('变更失败')
                }
            }
        });
    }


    //设置合同数据
    setContractRecord = (contract) => {
        const {dispatch} = this.props;
        const value = contract.contractNum;
        const belong = contract.loanBelongCode;
        const loanState = contract.loanState;
        dispatch({
            type: 'account/getContractDetail',
            payload: {contractNum: value,loanState:loanState},
            callback: response => {
                if (Util.success(response)) {
                    //合同编号
                    response.data.contractNum = value;
                    response.data.loanBelongCode = belong;
                    response.data.loanState = loanState;
                    //债权去向
                    this.setState({
                        ContractRecord: Util.isNotNull(response.data)?response.data:{},
                    },()=>{
                        // 获取银行卡列表
                        dispatch({
                            type: 'account/getBankCardList',
                            payload: {id: this.state.selectedRecord.id, contractNum: value,loanBelongCode:belong,loanState:loanState},
                            callback: response => {
                                if (Util.success(response)) {
                                    this.setState({
                                        bankCardList: response.data,
                                    })
                                    if(response.data.length===0){
                                        message.warning('无可供修改的银行卡')
                                    }
                                } else {
                                    message.error('获取银行卡失败')
                                    this.setState({
                                        bankCardList: [],
                                    })
                                }

                            }
                        });
                    })
                } else {
                    this.setState({
                        ContractRecord: {},
                    })
                }

            }
        });
    }

    //预览图片
    handleImageView = (flag, url) => {
        this.setState({
            viewImage: flag,
        }, () => {
            this.setState({
                imageUrl: Util.isNotNull(url) ? url : null,
            })
        })
    }

    //打开修改认证框
    handleUpdateAuthVisible = (flag, record) => {
        this.setState({
            selectedRecord: record,
            updateAuthVisible: flag,
            startValue: null,
            endValue: null,
            endOpen: false,
            tips: ''
        }, () => {
            this.handleGetProvince();
            this.handleIdTimeRange(record)

        })
    }

    //获取省份
    handleGetProvince = () => {
        const {dispatch} = this.props;
        dispatch({
            type: 'account/getProvince',
            callback: response => {
                if (Util.success(response)) {
                    this.setState({
                        province: response.data.length>0?response.data:[],
                    })
                } else {
                    this.setState({
                        province: []
                    })
                }
            }
        });
    }

    //确认修改认证
    updateAuth = (value) => {
        const {dispatch} = this.props;
        const {form} = this.props
        dispatch({
            type: 'account/updateAuth',
            payload: value,
            callback: response => {
                if(Util.success(response)){
                    message.success('修改成功')
                    this.getData(form.getFieldsValue())
                }else{
                    message.error('修改失败')
                }

            }
        });
        //如果成功关闭弹框
        this.handleUpdateAuthVisible(false, {});
    }

    //打开银行卡管理列表
    openBankCardManageModalVisible = (flag, record) => {
        const {dispatch} = this.props;
        dispatch({
            type: 'account/getContracts',
            payload: {id: record.id},
            callback: response => {
                if (Util.success(response)) {
                    this.setState({
                        selectedRecord: record,
                        Contracts: response.data.length>0?response.data:[],
                    })
                } else {
                    message.error('该客户无关联借款合同')
                    this.setState({
                        selectedRecord: record,
                        Contracts: []
                    })
                }

            }

        });
        this.setState({
            bankCardManageVisible: flag,
        })

    }
    //关闭银行卡管理列表
    closeBankCardManageModalVisible = (flag) => {
        this.setState({
            bankCardManageVisible: flag,
            ContractRecord: {},
            bankCardList: []
        })
    }

    //打开或关闭注销弹框
    handleCancellationVisible = (flag, record) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'configManage/fetch',
            payload: {dataType:'sysConfig'},
            callback: response => {
                if (Util.success(response)) {
                    if(Util.isNotNull(response.data)) {
                        const list = response.data;
                        const data = list.find((item) => {
                            return 'sms_send_seconds' === item.dataCode
                        })
                        this.setState({
                            messageTime:Util.isNotNull(data.dataValue)?data.dataValue:59
                        })
                    }
                }else {
                    this.setState({
                        messageTime:59
                    })
                }
            }
        });
        if (Util.isNotNull(record.mobile) && this.state.count !== 0 && record.mobile !== this.state.selectedRecord.mobile) {
            message.error(`${this.state.selectedRecord.mobile}未完成注销`)
        } else {
            //获取短信验证码时间

            this.setState({
                selectedRecord: Util.isNotNull(record.mobile) ? record : this.state.selectedRecord,
                cancellationManageVisible: flag,
            })
        }
    }

    //倒计时
    getCaptcha = () => {
        const {messageTime} = this.state;
        let count = messageTime;
        this.setState({count: count});
        this.interval = setInterval(() => {
            count -= 1;
            this.setState({count: count});
            if (count === 0) {
                clearInterval(this.interval);
            }
        }, 1000);
    };

    //发送验证码
    handleSendMessage = (value) => {
        const {dispatch} = this.props;
        dispatch({
            type: 'account/sendMessage',
            payload: {phone: value, smsType: 9},
            callback: response => {
                if (Util.success(response)) {
                    message.success('短信发送成功')
                } else {
                    message.error('短信发送失败')
                    this.setState({
                        count: 0,
                        cancellationManageVisible: true,
                    }, () => {
                        clearInterval(this.interval);
                    })
                }
            }
        })
    }

    //注销
    handleCancellation = (value) => {
        const {dispatch, form} = this.props;
        dispatch({
            type: 'account/destroyAccount',
            payload: value,
            callback: response => {
                if (Util.success(response)) {
                    this.setState({
                        count: 0,
                        cancellationManageVisible: false,
                    }, () => {
                        message.success('注销成功')
                        clearInterval(this.interval);
                        this.getData(form.getFieldsValue())
                    })
                } else {
                    message.error(response.respMsg)
                }
            }
        })
    }
    //校验身份证日期
    handleIdTimeRange = (value) => {
        let date = moment(Util.formatDateYYYYMMDD(new Date()));
        const endDate = moment(value.endDate);
        const startDate = moment(value.startDate);
        if (startDate<date && endDate>startDate && endDate>date) {
            this.setState({
                tips: '',
            })
        } else {
            this.setState({
                tips: '身份证信息有误，请重新输入'
            })
        }
    }

    renderSimpleForm = () => {
        const {getFieldDecorator} = this.props.form;
        return (
            <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{md: 8, lg: 24, xl: 48}}>
                    <Col md={8} sm={24}>
                        <FormItem label="注册手机:">
                            {getFieldDecorator('mobile')(<Input/>)}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="身份证号码:">{getFieldDecorator('idNo')(<Input/>)}</FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <span className={styles.submitButtons}>
                            <div className={styles.tableListOperator}>
                                <Button type="primary" htmlType="submit">查询</Button>
                                <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>清空</Button>
                            </div>
                        </span>
                    </Col>
                </Row>
            </Form>
        );
    }

    render() {
        const {
            account: {data},
            loading,
        } = this.props;
        const {
            bankCardManageVisible, bankCardList, cancellationManageVisible, count, selectedRecord, tips,
            updateAuthVisible, viewImage, imageUrl, changeBankCardVisible, carRecord, Contracts, ContractRecord, province,updateAuth,destroy,bankCardManage,updateBankCard
        } = this.state;
        const columns = [
            {
                title:'序号',
                dataIndex: 'index',
                width: 100,
                render:(text,record,index)=>`${(this.state.page.pageNo-1)*this.state.page.pageSize+index+1}`
            },
            {
                title: '注册手机',
                dataIndex: 'mobile',
                width: 264,
                render: Util.handleSensitiveField
            },
            {
                title: '姓名',
                dataIndex: 'name',
                width: 264,
            },
            {
                title: '身份证号码',
                dataIndex: 'idNo',
                width: 264,
                render: Util.handleSensitiveField
            },
            {
                title: '注册日期',
                dataIndex: 'registdate',
                width: 264,
            },
            {
                title: '账户状态',
                dataIndex: 'status',
                width: 264,
                render: (text, index) => {
                    return Util.getStatusName(text, accountStatus)
                }
            },
            {
                title: '操作',
                width: 264,
                render: (text, record) => {
                    return (
                        <div>
                            <a className={styles.tagStyle} hidden={!updateAuth}  disabled={('001002' === record.flowStatus && '1' === record.status) ? false : true}
                               onClick={() => this.handleUpdateAuthVisible(true, record)}>修改认证</a>
                            <a className={styles.tagStyle} hidden={!bankCardManage} disabled={('001002' === record.flowStatus && '1' === record.status) ? false : true}
                               onClick={() => this.openBankCardManageModalVisible(true, record)}>银行卡管理</a>
                            <a className={styles.tagStyle} hidden={!destroy} disabled={'1' === record.status ? false : true}
                               onClick={() => this.handleCancellationVisible(true, record)}>注销</a>
                        </div>
                    );
                },
            },
        ];

        const parentMethods = {
            closeBankCardManageModalVisible: this.closeBankCardManageModalVisible,
            handleCancellationVisible: this.handleCancellationVisible,
            getCaptcha: this.getCaptcha,
            handleCancellation: this.handleCancellation,
            handleSendMessage: this.handleSendMessage,
            handleUpdateAuthVisible: this.handleUpdateAuthVisible,
            handleImageView: this.handleImageView,
            updateAuth: this.updateAuth,
            handleChangeBankCardVisible: this.handleChangeBankCardVisible,
            setContractRecord: this.setContractRecord,
            handleIdTimeRange: this.handleIdTimeRange,
            changeMasterCard: this.changeMasterCard
        };

        const pagination = {
            showSizeChanger:true,
            showQuickJumper: true,
            defaultPageSize: 10,
            total: data.totalCount,
            current: this.state.currentPage,
            onShowSizeChange:(current, pageSize)=>{this.handleChange(current,pageSize)},
            onChange: (page, pageSize) => {
                this.handleChange(page, pageSize)
            },
        };

        return (
            <GridContent>
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
                        <Table
                            bordered
                            loading={loading}
                            dataSource={data.list}
                            rowKey={record => record.id}
                            columns={columns}
                            pagination={pagination}
                        />
                    </div>
                </Card>
                <BankCardManageList {...parentMethods} bankCardManageVisible={bankCardManageVisible}
                                    bankCardList={bankCardList} ContractRecord={ContractRecord} Contracts={Contracts} updateBankCard={updateBankCard}/>
                <Cancellation {...parentMethods} cancellationManageVisible={cancellationManageVisible} count={count}
                              selectedRecord={selectedRecord}/>
                <UpdateAuth {...parentMethods} updateAuthVisible={updateAuthVisible} tips={tips} imageUrl={imageUrl}
                            selectedRecord={selectedRecord} viewImage={viewImage} province={province}/>
                <ChangeBankCard {...parentMethods} changeBankCardVisible={changeBankCardVisible} carRecord={carRecord} selectedRecord={selectedRecord}
                                Contracts={Contracts} ContractRecord={ContractRecord} />
            </GridContent>
        );
    }
}
