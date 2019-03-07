import React from 'react';
import {Form, Input, Modal, Col, Row} from 'antd';
import Utils from '@/Common/Utils';
import moment from "moment";

const TextArea = Input.TextArea;
const FormItem = Form.Item;
const Util = new Utils();

class MessageModal {


    //消息内容
    MessageCoutent = Form.create()(props => {
        const {
            messageVisible,showMessage,form,messageRecord
        } = props;
        //取消
        const cancelHandle = () => {
            showMessage(false,{})
        }

        const formItemLayout = {labelCol: {span: 3}, wrapperCol: {span: 21}};
        return (
            <Modal
                maskClosable={false}
                title={`${messageRecord.title}`}
                visible={messageVisible}
                onCancel={cancelHandle}
                width={400}
                cancelText="取消"
                destroyOnClose={true}
                footer={false}
            >
                <Form>
                    <Row>
                        <Col><FormItem {...formItemLayout} label={'内容'} >{form.getFieldDecorator('content', {
                            initialValue: `${Util.isNotNull(messageRecord.content)?messageRecord.content:''}`
                        })(<TextArea style={{minHeight:100,maxHeight:100}} />)}</FormItem></Col>
                    </Row>
                </Form>
            </Modal>
        );
    })

}

export default MessageModal;
