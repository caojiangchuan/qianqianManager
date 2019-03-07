import React, { PureComponent, Fragment } from 'react';
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
} from 'antd';
import { formatMessage } from 'umi/locale';
import styles from './BannerManage.less';
import Utils from '../../Common/Utils';
import { linkType, phoneConfiguration } from '../../Common/Enum';
import UploadCustom from "./BannerManageUpload";

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const Option = Select.Option;
const Util = new Utils();


// MODAL布局
const formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
};

// 链接类型
const linkTypeVal = linkType.map(function (linkType,index) { 
    return <Radio key={`${linkType.value}`} value={`${linkType.value}`}>{`${linkType.name}`}</Radio>
});

//手机适配回显默认值
const phoneSelect = value =>{
    if(0 == value){
        return ['1'];
    }else if(1 == value){
        return ['2'];
    }else{
        return ['1','2'];
    }
}
   
//链接地址验证
const checkContent = (rule, value, callback) => {
    const reg=/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
    if(value != undefined && !reg.test(value)){
        callback('网址请以 http:// 或https://开头');
        return;
    }
    callback();
}

class BannerManageModal extends PureComponent {
    //BANNER管理 新增
    AddBanner = Form.create()(props =>{
        let addBannerSend = {};
        let picUrl;
        let picUrlType;
        let linkThumbnail;
        let linkThumbnailType;

        const {addBannerVisible,handleAddBannerVisible,form,addBanner,addStatus} = props;
        const {
            form: { getFieldDecorator, getFieldValue }
        } = props;
        
        const cancelHandle = () => {
            handleAddBannerVisible(false,{})
        }
        const okHandle = () => {
            form.validateFields((err, fieldsValue) => {
                if (err) return;
                // 新增请求参数, 已启用1, 未启用2   
                if(1 == addStatus){
                    addBannerSend.operationType = '1';
                }else if(2 == addStatus){
                    addBannerSend.operationType = '0';
                }     
                addBannerSend.status = `${addStatus}`;
                addBannerSend.bannerImg = picUrl;
                addBannerSend.fileType = picUrlType;
                addBannerSend.codekey = fieldsValue.imgInfo;
                addBannerSend.linkType = fieldsValue.linkType;
                // 外部网页
                if(1 == fieldsValue.linkType){
                    addBannerSend.url = fieldsValue.webSiteUrl;
                }
                // 图片
                else if(2 == fieldsValue.linkType){                    
                    addBannerSend.url = linkThumbnail;
                }
                const phoneSelect = fieldsValue.phoneConfiguration;
                // 苹果
                if(1 == phoneSelect){
                    addBannerSend.phoneConfiguration = '0';
                }
                // 安卓
                else if(2 == phoneSelect){
                    addBannerSend.phoneConfiguration = '1';
                }
                // 苹果&安卓
                else{
                    addBannerSend.phoneConfiguration = '2';
                }
                
                //console.log(addBannerSend);
                addBanner(addBannerSend,addStatus)
            });
        };

        const imageUrl = (e,f) => { 
            picUrl = e;
            picUrlType = f;
        };
        const linkContent = (e,f) => { 
            linkThumbnail = e;
            linkThumbnailType = f;        
        }; 

        return (
            <Modal
                maskClosable={false}
                title="新增BANNER"
                visible={addBannerVisible}
                onCancel={cancelHandle}
                width={800}
                onOk={okHandle}
                cancelText="取消"
                destroyOnClose={true}
            >
                <Form>
                    <FormItem {...formLayout} label="BANNER图上传：">
                        {getFieldDecorator('uploadCustom', {
                            rules: [{required: true, message: '请选择BANNER图'}],
                        })(<UploadCustom callback={imageUrl} />)}
                    </FormItem>
                    <FormItem {...formLayout} label="图片说明：">
                        {getFieldDecorator('imgInfo', {
                        })(<Input placeholder="" maxLength={100} />)}
                    </FormItem>
                    <FormItem {...formLayout} label="链接类型：">
                        {getFieldDecorator('linkType', {
                            initialValue: '1'
                        })(
                            <RadioGroup>
                                {linkTypeVal}
                            </RadioGroup>
                        )}
                    </FormItem>
                    <FormItem {...formLayout} label="网页地址："
                        style={{ 
                            display: getFieldValue("linkType") === "1" ? "block" : "none"
                        }}
                    >
                        {getFieldDecorator('webSiteUrl', {                            
                            rules: getFieldValue("linkType") === "1" ? [
                                { required: true, message: '请选择链接内容' },
                                { validator: checkContent.bind(this) }
                            ] : '',
                        })(<Input placeholder="" />)}
                    </FormItem>
                    <FormItem {...formLayout} label="上传链接至的图片：" 
                        style={{
                            display:getFieldValue("linkType") === "2" ? "block" : "none"
                        }}
                    >
                        {getFieldDecorator('linkThumbnail', {
                            rules: getFieldValue("linkType") === "2" ? [{ required: true, message: '请选择链接内容' }] : '',
                        })(<UploadCustom callback={linkContent}/>)}
                    </FormItem>             
                    <FormItem {...formLayout} label="手机适配：">
                        {getFieldDecorator('phoneConfiguration', {
                            rules: [{ required: true, message: '请选择手机适配信息', type:'array' }],
                            initialValue: ['1','2']
                        })(
                            <CheckboxGroup options={phoneConfiguration}/>
                        )}
                    </FormItem>
                </Form>
            </Modal>
        );
    })

    //BANNER管理 修改
    UpdateBanner = Form.create()(props =>{
        let updateBannerSend = {};
        let linkThumbnail;
        let linkThumbnailType;

        const {updateBannerVisible,handleUpdateBannerVisible,form,selectedRecord,updateBanner,handleImageView,viewImage,imageUrl,updateStatus} = props;
        const {
            form: { getFieldDecorator, getFieldValue }
        } = props;

        
        const cancelHandle = () => {
            handleUpdateBannerVisible(false,{},updateStatus)
        }
        const okHandle = () => {
            form.validateFields((err, fieldsValue) => {
                if (err) return;
                // 修改请求参数, 已启用1, 未启用2              
                updateBannerSend.id = selectedRecord.id;
                updateBannerSend.codekey = fieldsValue.imgInfo;
                // 已启用才有图片顺序
                if(1 == updateStatus){
                    const reg = /^\d+$/;
                    if(reg.test(fieldsValue.imgSort)) {
                        if(0 == fieldsValue.imgSort || 99 < fieldsValue.imgSort){
                            message.error('请输入1-99的整数');
                            return false;
                        }else{
                            updateBannerSend.num = `${fieldsValue.imgSort}`;
                        }
                    }else{
                        updateBannerSend.num = '';
                    }
                }
                updateBannerSend.linkType = fieldsValue.linkType;
                // 外部网页
                if(1 == fieldsValue.linkType){
                    updateBannerSend.url = fieldsValue.webSiteUrl;
                }
                // 图片
                else if(2 == fieldsValue.linkType){ 
                    // 未上传返回回显数据
                    if(!linkThumbnail){
                        updateBannerSend.url = selectedRecord.linkThumbnail;
                    } else{
                        updateBannerSend.url = linkThumbnail;
                        updateBannerSend.fileType = linkThumbnailType;
                    }                
                }
                const phoneSelect = fieldsValue.phoneConfiguration;
                // 苹果
                if(1 == phoneSelect){
                    updateBannerSend.phoneConfiguration = '0';
                }
                // 安卓
                else if(2 == phoneSelect){
                    updateBannerSend.phoneConfiguration = '1';
                }
                // 苹果&安卓
                else{
                    updateBannerSend.phoneConfiguration = '2';
                }
                //console.log(updateBannerSend);
                updateBanner(updateBannerSend)
            });
        };        
        
        const linkContent = (e,f) => { 
            linkThumbnail = e;
            linkThumbnailType = f;        
        };  

        //取消预览
        const handleCancel = (flag,url)=>{
            handleImageView(flag,url)
        }        

        return (
            <Modal
                maskClosable={false}
                title="BANNER图修改"
                visible={updateBannerVisible}
                onCancel={cancelHandle}
                width={800}
                onOk={okHandle}
                cancelText="取消"
                destroyOnClose={true}
            >
                <Form>
                    <FormItem {...formLayout} label="BANNER图缩略图：">
                        {getFieldDecorator('picUrl'
                        )(<span>
                            <img 
                                src={`${Util.isNotNull(selectedRecord.picUrl)?selectedRecord.picUrl:''}`} 
                                onClick={()=>handleCancel(true,selectedRecord.picUrl)}
                                width='200'
                                height='150'
                                className={styles.imgBeauty}
                                />
                        </span>)}
                    </FormItem>
                        <FormItem {...formLayout} label="上传人：">
                        {getFieldDecorator('uploader'
                        )(<span>{`${Util.isNotNull(selectedRecord.uploader)?selectedRecord.uploader:''}`}</span>)}
                    </FormItem>
                    <FormItem {...formLayout} label="最后修改人：">
                        {getFieldDecorator('lastUpdater'
                        )(<span>{`${Util.isNotNull(selectedRecord.lastUpdater)?selectedRecord.lastUpdater:''}`}</span>)}
                    </FormItem>
                    <FormItem {...formLayout} label="图片说明：">
                        {getFieldDecorator('imgInfo', {
                            initialValue:Util.isNotNull(selectedRecord.imgInfo)?selectedRecord.imgInfo:''
                        })(<Input placeholder="" maxLength={100} />)}
                    </FormItem>
                    <FormItem {...formLayout} label="链接类型：">
                        {getFieldDecorator('linkType', {
                            initialValue:Util.isNotNull(selectedRecord.linkType)?selectedRecord.linkType:''
                        })(
                            <RadioGroup>
                                {linkTypeVal}
                            </RadioGroup>
                        )}
                    </FormItem>
                    <FormItem {...formLayout} label="网页地址："
                        style={{ 
                            display: getFieldValue("linkType") === "1" ? "block" : "none"
                        }}
                    >
                        {getFieldDecorator('webSiteUrl', {                            
                            initialValue:Util.isNotNull(selectedRecord.linkThumbnail) && selectedRecord.linkType === "1" ?selectedRecord.linkThumbnail:'',
                            rules: getFieldValue("linkType") === "1" ? [
                                { required: true, message: '请选择链接内容' },
                                { validator: checkContent.bind(this) }
                            ] : '',
                        })(<Input placeholder="" />)}
                    </FormItem>
                    <FormItem {...formLayout} label="上传链接至的图片：" 
                        style={{
                            display:getFieldValue("linkType") === "2" ? "block" : "none"
                        }}
                    >
                        {getFieldDecorator('linkThumbnailUpdate', {
                            initialValue:Util.isNotNull(selectedRecord.linkThumbnail) && selectedRecord.linkType === "2"?selectedRecord.linkThumbnail:'',
                            rules: getFieldValue("linkType") === "2" && selectedRecord.linkType !== "2" ? [{ required: true, message: '请选择链接内容' }] : '',
                        })(<UploadCustom callback={linkContent} linkType={selectedRecord.linkType} imageUrlInit={selectedRecord.linkThumbnail}/>)}
                    </FormItem>
                    <FormItem {...formLayout} label="图片顺序：" style={{ 
                            display: updateStatus == 1 ? "block" : "none"
                        }}
                    >
                        {getFieldDecorator('imgSort', {
                            initialValue:Util.isNotNull(selectedRecord.imgSort)?selectedRecord.imgSort:'',
                        })(<InputNumber placeholder="" style={{ width: '100%' }} />)}
                    </FormItem>
                    <FormItem {...formLayout} label="手机适配：">
                        {getFieldDecorator('phoneConfiguration', {
                            rules: [{ required: true, message: '请选择手机适配信息', type:'array' }],
                            initialValue: phoneSelect(selectedRecord.phoneConfiguration)
                        })(
                            <CheckboxGroup options={phoneConfiguration}/>
                        )}
                    </FormItem>
                </Form>
                <Modal visible={viewImage} footer={null} onCancel={()=>handleCancel(false)}>
                    <img src={`${imageUrl}`} style={{ width: '100%' }} className={styles.imgBeauty}/>
                </Modal>
            </Modal>
        );
    })
}

export default BannerManageModal;
