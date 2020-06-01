import React, {Component} from 'react';
import { Modal, Form, Input, Button, notification, Select, InputNumber} from 'antd';
import {commonMessage, deepClone} from "../CommonFunction";
import InGoodsAPI from "../api/InGoodsAPI";

const formItemLayout = {
    labelCol: {span: 4},
    wrapperCol: {span: 20},
};
const FormItem = Form.Item;

class InGoodsEditModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalVisible : false,
            disable : false,
            inGoodsVO: {},
            channelList: [],
            tagId: undefined,
            parentTagId: undefined,
        }
    }

    show = () => {
        if (this.props.item) {
            this.setState({inGoodsVO : deepClone(this.props.item),});
        } else {
            this.state.inGoodsVO = {};
        }
        this.setState({modalVisible : true});
    };

    onOk = () => {
        if (this.state.disable) {
            return
        }

        //校验
        if (!this.state.inGoodsVO.bizId) {
            notification.error({message : "保存失败", description : "业务类型必选"});
            return;
        }
        if (!this.state.inGoodsVO.name) {
            notification.error({message : "保存失败", description : "姓名必填"});
            return;
        }
        if (this.state.inGoodsVO.name.length > 20) {
            notification.error({message : "保存失败", description : "姓名长度不能大于20"});
            return;
        }
        if (!this.state.inGoodsVO.phone) {
            notification.error({message : "保存失败", description : "手机号必填"});
            return;
        }
        if (! (this.state.inGoodsVO.phone.match(phoneRegx)) ) {
            notification.error({message : "保存失败", description : "请填写有效手机号"});
            return;
        }

        if (this.state.inGoodsVO.remark && this.state.clueVO.remark.length > 200) {
            notification.error({message : "保存失败", description : "备注长度不能大于200"});
            return;
        }
        this.setState({disable:true});

      InGoodsAPI.saveOrUpdate(this.state.inGoodsVO)
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

    handleChannelOrderNoChange = (e) => {
        this.state.inGoodsVO.channelOrderNo = e.target.value;
        this.setState({inGoodsVO : deepClone(this.state.inGoodsVO)});
    };

    handleGoodsIdChange = (e) => {
      this.state.inGoodsVO.goodsId = e.target.value;
      this.setState({inGoodsVO : deepClone(this.state.inGoodsVO)});
    };

    handleNumChange = (value) => {
      this.state.inGoodsVO.num = value;
      this.setState({inGoodsVO : deepClone(this.state.inGoodsVO)});
    };

    render() {

        let type = this.props.type;
        let clickEle = null;
        let title = null;
        if (type === "add") {
            clickEle = (<Button type="primary" onClick={this.show}>添加</Button>);
            title = "添加入库"
        } else {
            clickEle = (<a onClick={this.show}>编辑</a>);
            title = "编辑入库"
        }

        return (<span>
            {clickEle}
            <Modal title={title} width={700} visible={this.state.modalVisible}
                   onOk={this.onOk} onCancel={this.onCancel} key={this.props.key}>
                <FormItem label="渠道订单号" {...formItemLayout} required={true}>
                    <Input style={{width : 500}} value={this.state.inGoodsVO.channelOrderNo}
                           onChange={this.handleChannelOrderNoChange} placeholder="请输入渠道订单号"/>
                </FormItem>
                <FormItem label="商品ID" {...formItemLayout} required={true}>
                    <Input style={{width : 500}} value={this.state.inGoodsVO.goodsId}
                           onChange={this.handleGoodsIdChange} placeholder="请输入商品ID"/>
                </FormItem>
               <FormItem label="数量" {...formItemLayout} required={true}>
                    <InputNumber style={{width : 500}} min={0} precision = {2} value={this.state.inGoodsVO.num}
                           onChange={this.handleNumChange} placeholder="请输入数量"/>
                </FormItem>
            </Modal>
        </span>)
    }
}

export default InGoodsEditModal;
