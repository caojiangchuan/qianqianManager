/**
 * Created by ym10219 on 2018/12/03.
 */

import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
    Row,
    Col,
    Card,
    Form,
    Input,
    Select,
    Icon,
    Button,
    Dropdown,
    Menu,
    InputNumber,
    DatePicker,
    Modal,
    message,
    Badge,
    Divider,
    Steps,
    Radio,
    Checkbox,
    Upload,
    Table,
    Tabs
} from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from './BannerManage.less';
import Utils from '../../Common/Utils';
import { releaseStatus, linkType, buttonBannerList } from '../../Common/Enum';
import BannerManageModal from "./BannerManageModal";

const { AddBanner, UpdateBanner }  = new BannerManageModal();
const Util = new Utils();
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const confirm = Modal.confirm;
const CheckboxGroup = Checkbox.Group;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

const statusMap = ['default', 'processing'];


@connect(({ banner, loading }) => ({
    banner,
    loading: loading.effects['banner/fetch'],
}))

@Form.create()
class BannerManage extends PureComponent {
    state = {
        onBannerList: [],  //已启用table 数据
        offBannerList: [],  //未启用table 数据
        selectedRecord: {},  //已启用table 选中数据 
        updateBannerVisible: false, //修改BANNER modal
        addBannerVisible: false, //新增BANNER modal
        viewImage: false, //预览图片
        imageUrl:'', //预览图片url
        startValue: null,  //开始日期
        endValue: null,   //结束日期
        endOpen: false,   //日历回调
        addStatus: '1',  //新增按钮状态，已启用-1，未启用-2
        updateStatus: '1',  //修改按钮状态，已启用-1，未启用-2
        selectedRowKeys: [],  //复选框选中值     
        page: {
            pageNo: 1,
            pageSize: 10,
        },
        onPage: {
            pageNo: 1,
            pageSize: 10,
        },
        onBannerTotal: 0, //已启用新增允许总数
        onTotalCount: 0,  //已启用总数
        offTotalCount: 0, //未启用总数
        addBtnLoading: false, //新增按钮加载中状态
        searchParams: [],  //查询的确认条件
        isSearchPage: false,  //查询按钮分页
        //按钮权限
        releaseBtn: false,
        addOnBtn: false,
        updateOnBtn: false,
        delOnBtn: false,
        stopBtn: false,
        addOffBtn: false,
        updateOffBtn: false,
        delOffBtn: false,
        startBtn: false,        
        onCurrentPage:1,
        offCurrentPage:1,
    };

    columnsOn = [
        {
            title:'序号',
            dataIndex: 'index',
            align: 'center',
            width: 65,
            render:(text,record,index)=>`${(this.state.onPage.pageNo-1)*this.state.onPage.pageSize+index+1}`
        },
        {
            title: '图片顺序',
            dataIndex: 'imgSort',
            align: 'center',
            width: 90,
        },
        {
            title: '缩略图',
            dataIndex: 'picUrl',
            align: 'center',
            width: 160,
            render: val => (<img src={val} width='200' height='150' className={styles.imgBeauty} onClick={()=>this.handleCancel(true, val)} />)
        },
        {
            title: '说明',
            dataIndex: 'imgInfo',
            width: 160,
        },
        {
            title: '上传人',
            dataIndex: 'uploader',
            width: 160,
            align: 'center',
        },

        {
            title: '最后修改人',
            dataIndex: 'lastUpdater',
            width: 160,
            align: 'center',
        },
        {
            title: '链接类型',
            dataIndex: 'linkType',
            render:(text,index)=>{
                return Util.getStatusName(text,linkType)
            },
        },
        {
            title: '链接内容',
            dataIndex: 'linkContent',
            width: 160,
            render:(text,index)=>{
                // 外部网页
                if(1 == index.linkType){
                    return <a href={index.linkThumbnail} target="_blank">{index.linkThumbnail}</a>;
                }
                // 图片
                else if(2 == index.linkType){
                    return <img src={index.linkThumbnail} width='200' height='150' className={styles.imgBeauty} onClick={()=>this.handleCancel(true, index.linkThumbnail)} />;
                }
                // 无链接
                else {
                    return ' ';
                }
            },
        },
        {
            title: '是否发布',
            dataIndex: 'releaseStatus',
            width: 100,
            align: 'center',
            render:(text,index)=>{
                return <Badge status={statusMap[text]} text={Util.getStatusName(text,releaseStatus)} />
            },
        },
        {
            title: '操作',
            width: 160,
            render: (text, record) => (
                <Fragment>
                    <a onClick={() => this.handleUpdateBannerVisible(true, record, 1)} hidden={!this.state.updateOnBtn}>修改</a>
                    <Divider type="vertical" />
                    <a onClick={() => this.handleOnStop(true, record)} hidden={!this.state.stopBtn}>停用</a>
                    <Divider type="vertical" />
                    <a onClick={() => this.handleOnRemove(true, record, 1)} hidden={!this.state.delOnBtn}>删除</a>
                </Fragment>
            ),
        }
    ];

    columnsOff = [
        {
            title:'序号',
            dataIndex: 'index',
            align: 'center',
            width: 65,
            render:(text,record,index)=>`${(this.state.page.pageNo-1)*this.state.page.pageSize+index+1}`
        },
        {
            title: '缩略图',
            dataIndex: 'picUrl',
            width: 160,
            align: 'center',
            render: val => (<img src={val} width='200' height='150' className={styles.imgBeauty} onClick={()=>this.handleCancel(true, val)} />)
        },
        {
            title: '说明',
            dataIndex: 'imgInfo',
            width: 160,
        },
        {
            title: '上传人',
            dataIndex: 'uploader',
            width: 160,
            align: 'center',
        },

        {
            title: '最后修改人',
            dataIndex: 'lastUpdater',
            width: 160,
            align: 'center',
        },
        {
            title: '链接类型',
            dataIndex: 'linkType',
            render:(text,index)=>{
                return Util.getStatusName(text,linkType)
            },
        },
        {
            title: '链接内容',
            dataIndex: 'linkContent',
            width: 264,
            render:(text,index)=>{
                // 外部网页
                if(1 == index.linkType){
                    return <a href={index.linkThumbnail} target="_blank">{index.linkThumbnail}</a>;
                }
                // 图片
                else if(2 == index.linkType){
                    return <img src={index.linkThumbnail} width='200' height='150' className={styles.imgBeauty} onClick={()=>this.handleCancel(true, index.linkThumbnail)} />;
                }
                // 无链接
                else {
                    return ' ';
                }
            },
        },
        {
            title: '操作',
            width: 160,
            render: (text, record) => (
                <Fragment>
                    <a onClick={() => this.handleUpdateBannerVisible(true, record, 2)} hidden={!this.state.updateOffBtn}>修改</a>
                    <Divider type="vertical" />
                    <a onClick={() => this.handleOnStart(true, record)} hidden={!this.state.startBtn}>启用</a>
                    <Divider type="vertical" />
                    <a onClick={() => this.handleOnRemove(true, record, 2)} hidden={!this.state.delOffBtn}>删除</a>
                </Fragment>
            ),
        }
    ];

    componentDidMount() {
        this.getLoadData();
        //发布信息对比
        this.getComparMsg();
        //读取按钮权限
        const buttonAuth = localStorage.getItem('buttonAuth');
        const list = buttonAuth.split(',')
        this.checkButton(list)
    }

    //判断按钮是否可见
    checkButton = (buttonAuth)=>{
        const list = buttonBannerList;
        list.forEach((item)=>{
            buttonAuth.find(element=>{
                if (item.url === element) {
                    if ('release' === item.value) {
                        this.setState({
                            releaseBtn: true
                        })
                    } else if ('addOn' === item.value) {
                        this.setState({
                            addOnBtn: true
                        })
                    } else if ('updateOn' === item.value) {
                        this.setState({
                            updateOnBtn: true
                        })
                    } else if ('delOn' === item.value) {
                        this.setState({
                            delOnBtn: true
                        })
                    } else if ('stop' === item.value) {
                        this.setState({
                            stopBtn: true
                        })
                    } else if ('addOff' === item.value) {
                        this.setState({
                            addOffBtn: true
                        })
                    } else if ('updateOff' === item.value) {
                        this.setState({
                            updateOffBtn: true
                        })
                    } else if ('delOff' === item.value) {
                        this.setState({
                            delOffBtn: true
                        })
                    } else if ('start' === item.value) {
                        this.setState({
                            startBtn: true
                        })
                    }
                }
            })
        })
    }

    // 加载数据
    getLoadData = () => {
        this.getDataOn();
        this.getDataOff();
    }

    // 加载已启用数据
    getDataOn = () => {
        const { dispatch } = this.props;

        dispatch({
            type: 'banner/fetch',
            payload: {
                pageSize: `${this.state.onPage.pageSize}`,
                pageNo: `${this.state.onPage.pageNo}`,
                status: 1
            },
            callback: response => {
                this.setState({
                    onBannerList: response.data.list,
                    onTotalCount: response.data.totalCount,
                    onBannerTotal: response.data.bannerTotal
                })
                //console.log(response);
            }
        });
    };
    // 加载未启用数据
    getDataOff = () => {
        const { dispatch } = this.props;
        const { searchParams, isSearchPage } = this.state;

        let result = {};
        result.pageSize = `${this.state.page.pageSize}`;
        result.pageNo = `${this.state.page.pageNo}`;
        result.status = 2;
        if(true == isSearchPage && '' != searchParams){
            result.beginDate = searchParams.beginDate;
            result.codekey = searchParams.codekey;
            result.endDate = searchParams.endDate;
            result.lastUpdater = searchParams.lastUpdater;
            result.uploader = searchParams.uploader;
        }
        //console.log('result:', result);

        dispatch({
            type: 'banner/fetch',
            payload: result,
            callback: response => {
                this.setState({
                    offBannerList: response.data.list,
                    offTotalCount: response.data.totalCount,
                })
                //console.log(response);
            }
        });
    };

    // 已启用分页信息改变时触发
    handleChangeOn = (page, pageSize)=>{
        //console.log(`page: ${page},pageSize: ${pageSize}`);
        this.setState({
            onPage:{
                pageNo:page,
                pageSize:pageSize,
            },
            onCurrentPage: page
        },()=>{
            this.getDataOn();
        })
    }
    // 未启用分页信息改变时触发
    handleChangeOff = (page, pageSize)=>{
        this.setState({
            page:{
                pageNo:page,
                pageSize:pageSize,
            },
            offCurrentPage: page
        },()=>{
            this.getDataOff();
        })
    }

    // 打开新增BANNER
    handleAddBannerVisible =(flag, addStatus)=>{        
        const { onTotalCount, onBannerTotal } = this.state;
        // 已启用数据小于onBannerTotal配置数才可以新增
        if(1 == addStatus && onTotalCount >= onBannerTotal){
            message.error('启用页签已达上限，请重新选择');
        }else{
            this.setState({
                addBannerVisible:flag,
                addStatus: addStatus
            })
        }
    }

    // 确认新增BANNER
    addBanner =(value, addStatus)=>{
        const { dispatch } = this.props;        
        const { addBtnLoading } = this.state;

        //新增按钮置灰
        this.setState({
            addBtnLoading: true,
        })

        let that = this;
        dispatch({
            type: 'banner/addBanner',
            payload: value,
            callback: response => {
                // 新增请求参数, 已启用1, 未启用2   
                if(1 == addStatus){
                    this.changePageInfomation(that, 1, 'add');
                }else if(2 == addStatus){
                    this.changePageInfomation(that, 2, 'add');
                }    
                //this.getLoadData();
                message.success('新增成功');
                //新增按钮点亮
                this.setState({
                    addBtnLoading: false,
                })
            }
        });        
       this.handleAddBannerVisible(false,{});
    }

    /**
     * 分页操作
     * @param status 1-已启用，2-未启用
     * @param type add-新增，minu-启用，停用，删除 
     */
    changePageInfomation = (that, status, type)=>{
        let result, num, cnum;
        if(1 == status){
            if('add' == type){
                result = (that.state.onTotalCount +1) % that.state.onPage.pageSize == 1? 1 : 0;
                num = that.state.onPage.pageNo > 1 ? that.state.onPage.pageNo + result : that.state.onPage.pageNo;
                cnum = that.state.onCurrentPage > 1 ? that.state.onCurrentPage + result : that.state.onCurrentPage;
            }else if('minu' == type){
                result = (that.state.onTotalCount -1) % that.state.onPage.pageSize == 0? 1 : 0;
                num = that.state.onPage.pageNo > 1 ? that.state.onPage.pageNo - result : that.state.onPage.pageNo;
                cnum = that.state.onCurrentPage > 1 ? that.state.onCurrentPage - result : that.state.onCurrentPage;
            }
            that.setState({
                onPage: {
                    pageNo: num,
                    pageSize: that.state.onPage.pageSize
                },
                onCurrentPage: cnum,
                isSearchPage: false
            },()=>{
                that.getLoadData();
            })
        }else if(2 == status){
            if('add' == type){
                result = (that.state.offTotalCount +1) % that.state.page.pageSize == 1? 1 : 0;
                num = that.state.page.pageNo > 1 ? that.state.page.pageNo + result : that.state.page.pageNo;
                cnum = that.state.offCurrentPage > 1 ? that.state.offCurrentPage + result : that.state.offCurrentPage;
            }else if('minu' == type){
                result = (that.state.offTotalCount -1) % that.state.page.pageSize == 0? 1 : 0;
                num = that.state.page.pageNo > 1 ? that.state.page.pageNo - result : that.state.page.pageNo;
                cnum = that.state.offCurrentPage > 1 ? that.state.offCurrentPage - result : that.state.offCurrentPage;
            }                        
            that.setState({
                page: {
                    pageNo: num,
                    pageSize: that.state.page.pageSize
                },
                offCurrentPage: cnum,
                isSearchPage: false
            },()=>{
                that.getLoadData();
            })
        }
    }

    // 打开修改BANNER
    handleUpdateBannerVisible =(flag, record, updateStatus)=>{
        //console.log(record);
        this.setState({
            selectedRecord:record,
            updateBannerVisible:flag,
            updateStatus: updateStatus
        })
    }

    // 确认修改BANNER
    updateBanner =(value)=>{
        const { dispatch } = this.props;
        //console.log(value);
        dispatch({
            type: 'banner/updateBanner',
            payload: value,
            callback: response => {
                if('0000' == response.respCode){
                    this.getLoadData();
                    message.success('修改成功');
                    this.handleUpdateBannerVisible(false,{});
                }else if('9999' == response.respCode){
                    message.error(response.respMsg);
                }
            }
        });
    }

    // 停用
    handleOnStop = (flag, record) => {
        const { dispatch } = this.props;

        const selectedRecord = {};
        selectedRecord.id = `${record.id}`;
        selectedRecord.status = '2';
        selectedRecord.operationType = '0';
        //console.log(selectedRecord);

        if (!selectedRecord) return;
        let that = this;
        confirm({
            title: '停用',
            content: '是否停用BANNER图？',
            okText: '确认',
            cancelText: '取消',
            onOk() {
                dispatch({
                    type: 'banner/updateBanner',
                    payload: selectedRecord,
                    callback: () => {
                        that.changePageInfomation(that, 1, 'minu');
                        message.success('停用操作成功');
                    },
                });
            }
        });
    };

    // 启用
    handleOnStart = (flag, record) => {
        const { dispatch } = this.props;
        const { onTotalCount } = this.state;

        const selectedRecord = {};
        selectedRecord.id = `${record.id}`;
        selectedRecord.status = '1';
        selectedRecord.operationType = '1';
        //console.log(selectedRecord);

        let that = this;
        confirm({
            title: '启用',
            content: '是否启用BANNER图？',
            okText: '确认',
            cancelText: '取消',
            onOk() {
                dispatch({
                    type: 'banner/updateBanner',
                    payload: selectedRecord,
                    callback: response => {
                        //console.log(response);
                        if('0000' == response.respCode){
                            that.changePageInfomation(that, 2, 'minu');
                            //that.getLoadData();
                            message.success('启用操作成功');
                        }else if('9999' == response.respCode){
                            message.error(response.respMsg);
                        }
                    },
                });
            }
        });
    };


    // 删除
    handleOnRemove = (flag, record, removeStatus) => {
        const { dispatch } = this.props;
        let selectedRecord = {};
        selectedRecord.id = record.id;
        selectedRecord.operationType = '2';

        let that = this;
        if (!selectedRecord) return;
        confirm({
            title: '删除',
            content: '是否删除BANNER图？',
            okText: '确认',
            cancelText: '取消',
            onOk() {
                dispatch({
                    type: 'banner/updateBanner',
                    payload: selectedRecord,
                    callback: () => {
                        // 删除请求参数, 已启用1, 未启用2   
                        if(1 == removeStatus){
                            that.changePageInfomation(that, 1, 'minu');
                        }else if(2 == removeStatus){
                            that.changePageInfomation(that, 2, 'minu');
                        }
                        message.success('删除成功!');
                    },
                });
            }
        });
    };

    // 发布
    handleOnRelease = (flag, record) => {
        const { dispatch } = this.props;
        const { selectedRowKeys } = this.state;
        const selectedRecord = {};

        if (0 == selectedRowKeys.length){
            message.error('请选择需要发布的BANNER图');
            return false;
        }

        selectedRecord.ids = `${selectedRowKeys.join(',')}`;
        // 已启用才能发布
        selectedRecord.status = '1';
        //console.log(selectedRecord);

        let that = this;
        confirm({
            title: '发布',
            content: '是否发布已选中的BANNER图？',
            okText: '确认',
            cancelText: '取消',
            onOk() {
                dispatch({
                    type: 'banner/issueBanners',
                    payload: selectedRecord,
                    callback: (response) => {
                        if('0000' == response.respCode){
                            that.setState({
                                selectedRowKeys: []
                            })
                            that.getLoadData();
                            message.success('发布成功');
                        }else if('9999' == response.respCode){
                            message.error(response.respMsg);
                        }
                    },
                });
            }
        });
        that.getLoadData();
    };

    // 复选框
    onSelectChange = (selectedRowKeys, selectedRecord) => {
        //console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRecord: ', selectedRecord);
        /* if (selectedRecord.length > 6) {
            message.error('发布数量已满，请删减');
            return;
        } else { */
        this.setState({
            selectedRowKeys: selectedRowKeys
        })
        /* } */
    }

    // 没有图片顺序禁用复选框
    /* onCheckboxProps = (record) => ({
        disabled: record.imgSort === ''
    }) */

    // 预览图片
    handleImageView =(flag,url)=>{
        this.setState({
            viewImage:flag,
        },()=>{
            this.setState({
                imageUrl:Util.isNotNull(url)?url:null,
            })
        })
    }

    // 重置搜索框
    handleFormReset = () => {
        const {form} = this.props;
        form.resetFields();
    };

    // 查询
    handleSearch = e => {
        e.preventDefault();

        const { dispatch, form } = this.props;
        const dateFormat = 'YYYY-MM-DD';

        form.validateFieldsAndScroll((err, values) => {
            if (err) return;
            // 日期转换
            if (values.beginDate) {
                values.beginDate = values.beginDate.format(dateFormat)
            }else{
                values.beginDate = ''
            }
            if (values.endDate) {
                values.endDate = values.endDate.format(dateFormat)
            }else{
                values.endDate = ''
            }
            this.setState({
                searchParams: values,
            },()=>{
                //console.log('searchParams:', this.state.searchParams);
            })
            // 查询未启用数据
            values.status = '2'
            //console.log(values);
            this.setState({
                page:{
                    pageNo: '1',
                    pageSize: `${this.state.page.pageSize}`,
                },
                offCurrentPage: 1,
                isSearchPage: true
            },()=>{
                values.pageSize = `${this.state.page.pageSize}`,
                values.pageNo = `${this.state.page.pageNo}`,

                dispatch({
                    type: 'banner/fetch',
                    payload: values,
                    callback: response => {
                        this.setState({
                            offBannerList: response.data.list,
                            offTotalCount: response.data.totalCount,
                        })
                        if(!Util.isNotNull(response.data.list)){
                            message.error('无符合查询条件的账号，请重新输入查询')
                        }
                        //console.log(response);
                    }
                });
            })
        });
    };

    //不可选择的开始日期
    disabledStartDate = (startValue) => {
        const endValue = this.state.endValue;
        if (!startValue || !endValue) {
            return false;
        }
        return startValue.valueOf() > endValue.valueOf();
    }

    //不可选择的日期
    disabledEndDate = (endValue) => {
        const startValue = this.state.startValue;
        if (!endValue || !startValue) {
            return false;
        }
        return endValue.valueOf() <= startValue.valueOf();
    }

    onChangeDate = (field, value) => {
        this.setState({
            [field]: value,
        });
    }

    //创建日期起
    onStartChange = (value) => {
        this.onChangeDate('startValue', value);
    }

    //创建日期止
    onEndChange = (value) => {
        this.onChangeDate('endValue', value);
    }

    //弹出日历回调
    handleStartOpenChange = (open) => {
        if (!open) {
            this.setState({
                endOpen: true
            });
        }
    }

    //关闭日历回调
    handleEndOpenChange = (open) => {
        this.setState({
            endOpen: open
        });
    }

    // 发布信息对比
    getComparMsg = () => {
        const { dispatch } = this.props;

        dispatch({
            type: 'banner/comparMsg',
            callback: response => {
                if(true == response.data){
                    message.error('BANNER图配置信息已变更，请确认是否发布');
                }
                //console.log(response);
            }
        });
    };

    //tab切换回调
    tabsCallback = (key) =>{
        //已启用tab提示对比信息
        if('on' == key){
            this.getComparMsg();
        }
    }

    //取消预览
    handleCancel = (flag,url)=>{
        this.handleImageView(flag,url)
    } 

    // 未启用 查询条件
    renderAdvancedForm() {
        const { startValue, endValue, endOpen, addOffBtn, addBtnLoading } = this.state;
        const {
            form: { getFieldDecorator },
        } = this.props;
        const dateFormat = 'YYYY-MM-DD';

        return (
            <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={8} sm={24}>
                        <FormItem label="创建日期起">
                            {getFieldDecorator('beginDate')(
                                <DatePicker
                                    disabledDate={this.disabledStartDate}
                                    format={dateFormat}
                                    onChange={this.onStartChange}
                                    onOpenChange={this.handleStartOpenChange}
                                    placeholder=""
                                    style={{'width': '100%'}}
                                />
                            )}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="创建日期止">
                            {getFieldDecorator('endDate')(
                                <DatePicker
                                    disabledDate={this.disabledEndDate}
                                    format={dateFormat}
                                    onChange={this.onEndChange}
                                    open={endOpen}
                                    onOpenChange={this.handleEndOpenChange}
                                    placeholder=""
                                    style={{'width': '100%'}}
                                />
                            )}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="上传人">
                            {getFieldDecorator('uploader')(<Input placeholder="" />)}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={8} sm={24}>
                        <FormItem label="最后修改人">
                            {getFieldDecorator('lastUpdater')(<Input placeholder="" />)}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="图片说明关键字">
                            {getFieldDecorator('codekey')(<Input placeholder="" />)}
                        </FormItem>
                    </Col>
                </Row>
                <div style={{ marginTop: 8, marginBottom: 24 }}>
                    <Button icon="plus" type="primary" onClick={() => this.handleAddBannerVisible(true, '2')} hidden={!addOffBtn} disabled={addBtnLoading}>新增</Button>
                    <Button icon="search" style={{ marginLeft: 16 }} htmlType="submit">查询</Button>
                    <Button icon="rest" style={{ marginLeft: 16 }} onClick={this.handleFormReset}>清空</Button>
                </div>
            </Form>
        );
    }


    render() {
        const {
            banner: { data },
            loading,
        } = this.props;
        const { updateBannerVisible, addBannerVisible, onBannerList, offBannerList, selectedRecord, viewImage, imageUrl, startValue, endValue, endOpen, addStatus, updateStatus, selectedRowKeys, onTotalCount, offTotalCount, releaseBtn, addOnBtn, addBtnLoading } = this.state;
        
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            getCheckboxProps: this.onCheckboxProps
        };

        const paginationOn = {
            showSizeChanger: true,
            showQuickJumper: true,
            defaultPageSize: 10,
            total: onTotalCount,
            current: this.state.onCurrentPage,
            onShowSizeChange:(current, pageSize)=>{this.handleChangeOn(current, pageSize)},
            onChange:(page, pageSize)=>{
                this.handleChangeOn(page, pageSize)
            }
        };

        const paginationOff = {
            showSizeChanger: true,
            showQuickJumper: true,
            defaultPageSize: 10,
            total: offTotalCount,
            current: this.state.offCurrentPage,
            onShowSizeChange:(current, pageSize)=>{this.handleChangeOff(current, pageSize)},
            onChange:(page, pageSize)=>{
                this.handleChangeOff(page, pageSize)
            }
        };

        const parentMethods = {
            handleUpdateBannerVisible: this.handleUpdateBannerVisible,
            updateBanner: this.updateBanner,
            handleAddBannerVisible: this.handleAddBannerVisible,
            addBanner: this.addBanner,
            handleImageView: this.handleImageView
        };

        return (
            <GridContent>
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <Tabs animated={false} onChange={this.tabsCallback}>
                            <TabPane tab={<span><Icon type="check-circle" /> 已启用</span>} key="on">
                                <div style={{ 'margin': '24px 0' }}>
                                    <Button icon="form" type="primary" onClick={() => this.handleOnRelease()} style={{ marginRight: 16 }} hidden={!releaseBtn}>发布</Button>
                                    <Button icon="plus" onClick={() => this.handleAddBannerVisible(true, '1')} hidden={!addOnBtn} disabled={addBtnLoading}>新增</Button>
                                </div>

                                <Table
                                    bordered
                                    loading={loading}
                                    dataSource={onBannerList}
                                    rowSelection={rowSelection}
                                    rowKey={record => record.id}
                                    columns={this.columnsOn}
                                    pagination={paginationOn}
                                />
                            </TabPane>
                            <TabPane tab={<span><Icon type="stop" /> 未启用</span>} key="off">
                                <div className={styles.tableListForm}>
                                    {this.renderAdvancedForm()}
                                </div>

                                <Table
                                    bordered
                                    loading={loading}
                                    dataSource={offBannerList}
                                    rowKey={record => record.id}
                                    columns={this.columnsOff}
                                    pagination={paginationOff}
                                />
                            </TabPane>
                        </Tabs>

                        {/* 新增弹窗 */}
                        <AddBanner {...parentMethods} addBannerVisible={addBannerVisible} addStatus={addStatus}/>

                        {/* 修改弹窗 */}
                        <UpdateBanner {...parentMethods} updateBannerVisible={updateBannerVisible} selectedRecord={selectedRecord} imageUrl={imageUrl} viewImage={viewImage} updateStatus={updateStatus} />
                   
                        {/* 预览图片 */}
                        <Modal visible={viewImage} footer={null} onCancel={()=>this.handleCancel(false)}>
                            <img src={`${imageUrl}`} style={{ width: '100%' }} className={styles.imgBeauty}/>
                        </Modal>
                    </div>
                </Card>
            </GridContent>
        );
    }
}

export default BannerManage;


