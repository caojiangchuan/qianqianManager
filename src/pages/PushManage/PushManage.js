import React, {Component, Fragment} from 'react';
import {connect} from 'dva';
import {Row, Col, Card, Form, Input, Button, DatePicker, message, Table, Icon, Modal, Tag, Select} from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from './PushManage.less';
import Utils from '../../Common/Utils';
import moment from "moment";
import {dateFormat, sendStatus, pustButtonList} from '../../Common/Enum';
import PushManageModal from './PushManageModal';

const {RangePicker} = DatePicker;
const {AddContent, Detail} = new PushManageModal();
const Util = new Utils();
const FormItem = Form.Item;
const confirm = Modal.confirm;

@connect(({pushManage, loading}) => ({
    pushManage,
    loading: loading.effects['pushManage/fetch'],
}))
@Form.create()
export default class AccountManage extends Component {
    state = {
        addContentVisible: false,//新增弹框
        detailVisible: false,//详情弹框
        detail: {},//详情
        dateFlag: true,
        newContent: false, //新建
        detailSave: false, //详情保存
        recall: false,     //详情撤回
        newPush: false,     //新增推送
        detailPush: false,   //详情推送
        notAllowPush:false,
        page: {
            pageNo: 1,
            pageSize: 10,
        },
        currentPage: 1,


    };

    componentDidMount() {
        const buttonAuth = localStorage.getItem('buttonAuth');
        const list = buttonAuth.split(',')
        this.checkButton(list)
        this.getData({},false)
    }

    //判断按钮是否可见
    checkButton = (buttonAuth) => {
        const list = pustButtonList;
        list.forEach((item) => {
            buttonAuth.find(element => {
                if (item.url === element) {
                    if ('newContent' === item.value) {
                        this.setState({
                            newContent: true
                        })
                    } else if ('detailSave' === item.value) {
                        this.setState({
                            detailSave: true
                        })
                    } else if ('recall' === item.value) {
                        this.setState({
                            recall: true
                        })
                    } else if ('newPush' === item.value) {
                        this.setState({
                            newPush: true
                        })
                    } else if ('detailPush' === item.value) {
                        this.setState({
                            detailPush: true
                        })
                    }
                }
            })
        })
    }

    // 重置搜索框
    handleFormReset = () => {
        const {form} = this.props;
        this.setState({
            dateFlag: true
        })
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
        if (!this.state.dateFlag) {
            message.error('查询日期间隔不超过3个月')
            return;
        }

        this.setState({
            page: {
                pageNo: 1,
                pageSize: this.state.page.pageSize,
            },
            currentPage: 1,
        }, () => {
            this.getData(value,true);
        })
    };

    /**
     * 获取数据
     * @returns {*}
     */
    getData = (value,flag) => {

        if (Util.isNotNull(value.createdDateList)) {
            value.beginDate = Util.formatDateForSearch(value.createdDateList[0]);
            value.endDate = Util.formatDateForSearch(value.createdDateList[1]);
        }
        if (Util.isNotNull(value.sendDateList)) {
            value.startTime = Util.formatDateForSearch(value.sendDateList[0]);
            value.endTime = Util.formatDateForSearch(value.sendDateList[1]);
        }
        delete value.sendDateList;
        delete value.createdDateList;

        const {dispatch,form} = this.props;
        value.pageSize = this.state.page.pageSize;
        value.pageNo = this.state.page.pageNo;
        dispatch({
            type: 'pushManage/fetch',
            payload: value,
            callback: response => {
                if (Util.success(response)) {
                    if (response.data.list.length === 0 && flag) {
                        message.error('无符合查询条件的账号，请重新输入查询')
                    }
                } else {
                    message.error('查找失败')
                }
            }
        });
    }

    //查看详情
    handleDetail = (flag, record) => {
        this.setState({
            detailVisible: flag,
            detail: record
        })
        if(!flag){
            this.setState({
                notAllowPush:false
            })
        }

    }

    //打开或关闭新增推送消息弹框
    showAddModal = (flag) => {
        this.setState({
            addContentVisible: flag,
        })

    }

    //新增推送消息
    handleAddContent = (value) => {
        const {dispatch,form} = this.props;
        dispatch({
            type: 'pushManage/addContent',
            payload: value,
            callback: response => {
                if (Util.success(response)) {
                    message.success('添加成功')
                    this.showAddModal(false);
                    this.getData(form.getFieldsValue())
                } else {
                    message.error('添加失败')
                }
            }
        });
    }

    //推送
    pushMessage = (value) => {
        const {dispatch,form} = this.props;
        Modal.confirm({
            content: '是否操作推送？',
            okText: '确认',
            cancelText: '取消',
            onOk: () => {

                if (Util.isNotNull(value.id)) {
                    dispatch({
                        type: 'pushManage/pushDetailMessage',
                        payload: value,
                        callback: response => {
                            if (Util.success(response)) {
                                message.success('推送成功')
                                this.setState({
                                    detailVisible: false
                                })
                                this.getData(form.getFieldsValue())
                            } else {
                                message.error('推送失败')
                            }
                        }
                    });

                } else {
                    dispatch({
                        type: 'pushManage/pushMessage',
                        payload: value,
                        callback: response => {
                            if (Util.success(response)) {
                                message.success('推送成功')
                                this.setState({
                                    addContentVisible: false
                                })
                                this.getData(form.getFieldsValue())
                            } else {
                                message.error('推送失败')
                            }
                        }
                    });
                }
            }
        })

    }
    //修改
    updateDetail = (value) => {
        const {dispatch,form} = this.props;
        dispatch({
            type: 'pushManage/updateContent',
            payload: value,
            callback: response => {
                if (Util.success(response)) {
                    message.success('修改成功')
                    this.handleDetail(false, {});
                    this.getData(form.getFieldsValue())
                } else {
                    message.error('修改失败')
                }
            }
        });
    }

    //撤回
    recallMessage = (value) => {
        const {dispatch,form} = this.props;
        Modal.confirm({
            content: '确定要撤回吗？',
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                dispatch({
                    type: 'pushManage/recallContent',
                    payload: value,
                    callback: response => {
                        if (Util.success(response)) {
                            message.success('撤回成功')
                            this.handleDetail(false, {});
                            this.getData(form.getFieldsValue())
                        } else {
                            message.error('撤回失败')
                        }
                    }
                });
            }
        });

    }

    //分页信息改变时触发
    handleChange = (page, pageSize) => {
        const {form} = this.props;
        this.setState({
            page: {
                pageNo: page,
                pageSize: pageSize,
            },
            currentPage: page
        }, () => {
            this.getData(form.getFieldsValue(),true);
        })
    }

    //搜索日期返回
    changeDate = (value, mode) => {
        const days = Util.getDats(value[0], value[1])
        if (days > 90) {
            message.error('两个日期间隔不超过3个月')
            this.setState({
                dateFlag: false
            })
        } else {
            this.setState({
                dateFlag: true
            })
        }
    }
//改变内容保存后才可以推送
    changeContent =(allValues)=>{
        const {detail} =this.state;
        if(detail.content===allValues.content){
            this.setState({
                notAllowPush:false
            })
        }else {
            this.setState({
                notAllowPush: true
            })
        }
    }


    renderSimpleForm = () => {
        const {newContent} = this.state;
        const {getFieldDecorator} = this.props.form;
        return (
            <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{md: 24, lg: 12, xl: 48}}>
                    <Col md={8} sm={4}>
                        <FormItem label="创建日期:">{getFieldDecorator('createdDateList')(<RangePicker
                            placeholder={['创建日期起', '创建日期止']}
                            onChange={this.changeDate}/>)}</FormItem>
                    </Col>
                    <Col md={5} sm={4}>
                        <FormItem label='创建人 ：'>{getFieldDecorator('creater')(<Input/>)}</FormItem>
                    </Col>
                    <Col md={5} sm={4}>
                        <FormItem label="最后修改人:">{getFieldDecorator('lastUpdater')(<Input/>)}</FormItem>
                    </Col>
                </Row>
                <Row gutter={{md: 24, lg: 12, xl: 48}}>
                    <Col md={8} sm={4}>
                        <FormItem label="发送日期:">{getFieldDecorator('sendDateList')(<RangePicker
                            placeholder={['发送日期起', '发送日期止']}
                            onChange={this.changeDate}/>)}</FormItem>
                    </Col>
                    <Col md={5} sm={4}>
                        <FormItem label="发送状态:">{getFieldDecorator('status')(
                            <Select>{Util.dropDownOption(sendStatus, 'value', 'name')}</Select>)}</FormItem>
                    </Col>
                    <Col md={5} sm={4}>
                        <FormItem label="推送关键字:">{getFieldDecorator('content')(<Input/>)}</FormItem>
                    </Col>
                </Row>
                <Row gutter={{md: 24, lg: 12, xl: 48}}>
                    <Col md={12} sm={12}>
                        <span className={styles.submitButtons}>
                            <div className={styles.tableListOperator}>
                                <Button htmlType="submit">查询</Button>
                                <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>清空</Button>
                                <Button hidden={!newContent} type="primary" style={{marginLeft: 8}} onClick={() => {
                                    this.showAddModal(true)
                                }}>新建</Button>
                            </div>
                        </span>
                    </Col>
                </Row>
            </Form>
        );
    }

    render() {
        const columns = [
            {
                title: '序号',
                dataIndex: 'index',
                render: (text, record, index) => `${(this.state.page.pageNo - 1) * this.state.page.pageSize + index + 1}`
            },
            {
                title: '创建日期',
                dataIndex: 'createTime',
            },
            {
                title: '发送日期',
                dataIndex: 'pushTime',
            },
            {
                title: '创建人',
                dataIndex: 'createrName',
            },
            {
                title: '最后修改人',
                dataIndex: 'lastupdaterName',
            },
            {
                title: '发送状态',
                dataIndex: 'status',
                width: 264,
                render: (text, index) => {
                    return Util.getStatusName(text, sendStatus)
                }
            },
            {
                title: '操作',
                width: 264,
                render: (text, record) => {
                    return (
                        <div align="center">
                            <a className={styles.tagStyle} onClick={() => this.handleDetail(true, record)}>查看详情</a>
                        </div>
                    );
                },
            },
        ];

        const {
            pushManage: {data},
            loading,
        } = this.props;
        const {addContentVisible, detailVisible, detail, detailSave, recall, newPush, detailPush,notAllowPush} = this.state;

        const parentMethods = {
            showAddModal: this.showAddModal,
            handleAddContent: this.handleAddContent,
            handleDetail: this.handleDetail,
            pushMessage: this.pushMessage,
            recallMessage: this.recallMessage,
            updateDetail: this.updateDetail,
            changeContent:this.changeContent
        };

        const pagination = {
            showSizeChanger: true,
            showQuickJumper: true,
            defaultPageSize: 10,
            total: data.totalCount,
            current: this.state.currentPage,
            onShowSizeChange: (current, pageSize) => {
                this.handleChange(current, pageSize)
            },
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
                <AddContent {...parentMethods} addContentVisible={addContentVisible} newPush={newPush}/>
                <Detail {...parentMethods} detailVisible={detailVisible} detail={detail} detailPush={detailPush}
                        detailSave={detailSave} recall={recall} notAllowPush={notAllowPush}/>
            </GridContent>
        );
    }
}
