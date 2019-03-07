/**
 * Created by ym10219 on 2018/12/04.
 */

import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
    Icon,
    Button,
    message,
    Upload,
    Modal
} from 'antd';


let fileType = '';

const getBase64 = (img, callback)=>{
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

const beforeUpload  = (file)=>{
    const isJPG = file.type === 'image/jpeg';
    const isPNG = file.type === 'image/png';
    if (!isJPG && !isPNG) {
        message.error('只能上传 JPG和PNG 格式文件');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('图片不能超过 2MB');
    }

    if('image/jpeg' == file.type){
        fileType = '.jpg';
    }else if('image/png' == file.type){
        fileType = '.png';
    }

    return isJPG || isPNG && isLt2M;
}

class UploadCustom extends PureComponent {
    state = {
        loading: false,
        imageUrl: '',
        previewVisible: false,
        previewImage: '',
    };

    handleChange = (info) => {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {
            getBase64(info.file.originFileObj, imageUrl => {
                this.setState({
                    imageUrl: imageUrl,
                    loading: false,
                })
            });
        }
    }

    handleCancel = () => this.setState({ previewVisible: false })

    handlePreview = (file) => {
        this.setState({
            previewImage: file,
            previewVisible: true,
        });
    }

    /**
     * @param linkType 回显链接类型
     * @param imageUrlInit 回显图片默认值
     * @param imageUrl 上传图片url
     */
    showImage = (linkType, imageUrlInit, imageUrl) => {
        /* console.log('linkType:' + linkType);
        console.log('imageUrlInit:' + imageUrlInit);
        console.log('imageUrl:' + imageUrl); */
        if(imageUrl){
            return <img src={imageUrl} onClick={() => this.handlePreview(imageUrl)} style={{ width: (imageUrl ? 200 : 0 ), height: (imageUrl ? 150 : 0 ), marginTop: 8, borderRadius: 4 }} />
        }else if(2 == linkType && '' != imageUrlInit){
            return <img src={imageUrlInit} onClick={() => this.handlePreview(imageUrlInit)} style={{ width: (imageUrlInit ? 200 : 0 ), height: (imageUrlInit ? 150 : 0 ), marginTop: 8, borderRadius: 4 }} />
        }
    }

    render() {
        const {imageUrl, previewVisible, previewImage } = this.state;
        const {imageUrlInit, linkType} = this.props;

        return (
            <div onChange={(this.props.callback(imageUrl,fileType)),(this.props.onChange)}>
                <Upload
                    name="upload"
                    showUploadList={false}
                    action=""
                    beforeUpload={beforeUpload}
                    onChange={this.handleChange}
                >
                    <Button>
                        <Icon type="upload" /> 选择本地文件
                    </Button>
                </Upload>
                <br/>
                {this.showImage(linkType, imageUrlInit, imageUrl)}
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="previewImage" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        );
    }
}

export default UploadCustom;