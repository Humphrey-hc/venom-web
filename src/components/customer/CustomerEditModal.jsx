import React, {Component} from 'react';
import { Modal, Form, Input, Button, notification, Select, InputNumber} from 'antd';
import {commonMessage, deepClone} from "../CommonFunction";
import CustomerAPI from "../api/CustomerAPI";

const formItemLayout = {
    labelCol: {span: 4},
    wrapperCol: {span: 20},
};
const FormItem = Form.Item;

class CustomerEditModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalVisible : false,
            disable : false,
            customerVO: {},
            channelList: [],
            tagId: undefined,
            parentTagId: undefined,
        }
    }

    show = () => {
        if (this.props.item) {
            this.setState({customerVO : deepClone(this.props.item),});
        } else {
            this.state.customerVO = {};
        }
        this.setState({modalVisible : true});
    };

    onOk = () => {
        if (this.state.disable) {
            return
        }

        //校验
        if (!this.state.customerVO.bizId) {
            notification.error({message : "保存失败", description : "业务类型必选"});
            return;
        }
        if (!this.state.customerVO.name) {
            notification.error({message : "保存失败", description : "姓名必填"});
            return;
        }
        if (this.state.customerVO.name.length > 20) {
            notification.error({message : "保存失败", description : "姓名长度不能大于20"});
            return;
        }
        if (!this.state.customerVO.phone) {
            notification.error({message : "保存失败", description : "手机号必填"});
            return;
        }
        if (! (this.state.customerVO.phone.match(phoneRegx)) ) {
            notification.error({message : "保存失败", description : "请填写有效手机号"});
            return;
        }

        if (this.state.customerVO.remark && this.state.clueVO.remark.length > 200) {
            notification.error({message : "保存失败", description : "备注长度不能大于200"});
            return;
        }
        this.setState({disable:true});

      CustomerAPI.saveOrUpdate(this.state.customerVO)
        .then((res) => {
            let flag = commonMessage(res);
            this.setState({disable:false});
            if (flag) {
                this.setState({modalVisible : false});
                this.props.refresh();
            }
        });
    };

    onCancel = () => {
        this.setState({modalVisible : false});
    };

    handleNameChange = (e) => {
        this.state.customerVO.name = e.target.value;
        this.setState({customerVO : deepClone(this.state.customerVO)});
    };

    handleWeChatNameChange = (e) => {
      this.state.customerVO.weChatName = e.target.value;
      this.setState({customerVO : deepClone(this.state.customerVO)});
    };

    handleMobileChange = (e) => {
      this.state.customerVO.mobile = e.target.value;
      this.setState({customerVO : deepClone(this.state.customerVO)});
    };

    handleProvinceChange = (value) => {
        this.state.customerVO.province = value;
        this.setState({customerVO : deepClone(this.state.customerVO)});
    };

    handleCityChange = (value) => {
      this.state.customerVO.city = value;
      this.setState({customerVO : deepClone(this.state.customerVO)});
    };

    handleDistrictChange = (value) => {
      this.state.customerVO.district = value;
      this.setState({customerVO : deepClone(this.state.customerVO)});
    };

    render() {

        let type = this.props.type;
        let clickEle = null;
        let title = null;
        if (type === "add") {
            clickEle = (<Button type="primary" onClick={this.show}>添加</Button>);
            title = "添加商品"
        } else {
            clickEle = (<a onClick={this.show}>编辑</a>);
            title = "编辑商品"
        }

        return (<span>
            {clickEle}
            <Modal title={title} width={700} visible={this.state.modalVisible}
                   onOk={this.onOk} onCancel={this.onCancel} key={this.props.key}>
                <FormItem label="客户名称" {...formItemLayout} required={true}>
                    <Input style={{width : 500}} value={this.state.customerVO.name}
                           onChange={this.handleNameChange} placeholder="请输入客户名称"/>
                </FormItem>
                <FormItem label="微信备注" {...formItemLayout} required={true}>
                    <Input style={{width : 500}} value={this.state.customerVO.weChatName}
                           onChange={this.handleWeChatNameChange} placeholder="请输入微信备注"/>
                </FormItem>
                <FormItem label="手机号" {...formItemLayout} required={true}>
                    <Input style={{width : 500}} value={this.state.customerVO.mobile}
                           onChange={this.handleMobileChange} placeholder="请输入手机号"/>
                </FormItem>
                <FormItem label="省份" {...formItemLayout} required={true}>
                    <Select style={{width : 500, marginRight : 10}}  value={this.state.customerVO.province} allowClear={true}
                            onChange = {this.handleProvinceChange} placeholder="请选择省份">
                        {this.props.channelList}
                    </Select>
                </FormItem>
                <FormItem label="城市" {...formItemLayout} required={true}>
                    <Select style={{width : 500, marginRight : 10}}  value={this.state.customerVO.city} allowClear={true}
                            onChange = {this.handleCityChange} placeholder="请选择城市">
                        {this.props.channelList}
                    </Select>
                </FormItem>
                <FormItem label="地区" {...formItemLayout} required={true}>
                    <Select style={{width : 500, marginRight : 10}}  value={this.state.customerVO.district} allowClear={true}
                            onChange = {this.handleDistrictChange} placeholder="请选择地区">
                        {this.props.channelList}
                    </Select>
                </FormItem>
            </Modal>
        </span>)
    }
}

export default CustomerEditModal;
