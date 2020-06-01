import React, {Component} from 'react';
import { Modal, Form, Input, Button, notification, Select, InputNumber} from 'antd';
import {commonMessage, deepClone} from "../CommonFunction";
import GoodsAPI from "../api/GoodsAPI";

const formItemLayout = {
    labelCol: {span: 4},
    wrapperCol: {span: 20},
};
const FormItem = Form.Item;

class GoodsEditModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalVisible : false,
            disable : false,
            goodsVO: {},
            channelList: [],
            tagId: undefined,
            parentTagId: undefined,
        }
    }

    show = () => {
        if (this.props.item) {
            this.setState({goodsVO : deepClone(this.props.item),});
        } else {
            this.state.goodsVO = {};
        }
        this.setState({modalVisible : true});
    };

    onOk = () => {
        if (this.state.disable) {
            return
        }

        //校验
        if (!this.state.goodsVO.bizId) {
            notification.error({message : "保存失败", description : "业务类型必选"});
            return;
        }
        if (!this.state.goodsVO.name) {
            notification.error({message : "保存失败", description : "姓名必填"});
            return;
        }
        if (this.state.goodsVO.name.length > 20) {
            notification.error({message : "保存失败", description : "姓名长度不能大于20"});
            return;
        }
        if (!this.state.goodsVO.phone) {
            notification.error({message : "保存失败", description : "手机号必填"});
            return;
        }
        if (! (this.state.goodsVO.phone.match(phoneRegx)) ) {
            notification.error({message : "保存失败", description : "请填写有效手机号"});
            return;
        }

        if (this.state.goodsVO.remark && this.state.clueVO.remark.length > 200) {
            notification.error({message : "保存失败", description : "备注长度不能大于200"});
            return;
        }
        this.setState({disable:true});

      GoodsAPI.saveOrUpdate(this.state.goodsVO)
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
        this.state.goodsVO.name = e.target.value;
        this.setState({goodsVO : deepClone(this.state.goodsVO)});
    };

    handleChannelChange = (value) => {
        this.state.goodsVO.channelCode = value;
        this.setState({goodsVO : deepClone(this.state.goodsVO)});
    };

    handleStockNumChange = (value) => {
      this.state.goodsVO.stockNum = value;
      this.setState({goodsVO : deepClone(this.state.goodsVO)});
    };

    handleWeightChange = (value) => {
      this.state.goodsVO.weight = value;
      this.setState({goodsVO : deepClone(this.state.goodsVO)});
    };

    handleBuyingPriceChange = (value) => {
      this.state.goodsVO.buyingPrice = value;
      this.setState({goodsVO : deepClone(this.state.goodsVO)});
    };

    handleGuideSellingPricePriceChange = (value) => {
      this.state.goodsVO.guideSellingPrice = value;
      this.setState({goodsVO : deepClone(this.state.goodsVO)});
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
              <FormItem label="商品名" {...formItemLayout} required={true}>
                    <Input style={{width : 500}} value={this.state.goodsVO.name}
                           onChange={this.handleNameChange} placeholder="请输入商品名"/>
                </FormItem>
                <FormItem label="渠道" {...formItemLayout} required={true}>
                    <Select style={{width : 500, marginRight : 10}}  value={this.state.goodsVO.channelCode} allowClear={true}
                            onChange = {this.handleChannelChange} placeholder="请选择渠道">
                        {this.props.channelList}
                    </Select>
                </FormItem>
                <FormItem label="起始库存数" {...formItemLayout} required={true}>
                    <InputNumber style={{width : 500}} min={0} precision = {0} value={this.state.goodsVO.stockNum}
                           onChange={this.handleStockNumChange} placeholder="请输起始库存数"/>
                </FormItem>
               <FormItem label="重量(kg)" {...formItemLayout} required={true}>
                    <InputNumber style={{width : 500}} min={0} precision = {2} value={this.state.goodsVO.weight}
                           onChange={this.handleWeightChange} placeholder="请输起始库存数"/>
                </FormItem>
               <FormItem label="进货价(元)" {...formItemLayout} required={true}>
                    <InputNumber style={{width : 500}} min={0} precision = {2} value={this.state.goodsVO.buyingPrice}
                           onChange={this.handleBuyingPriceChange} placeholder="请输入进货价"/>
                </FormItem>
                <FormItem label="指导售价(元)" {...formItemLayout} required={true}>
                    <InputNumber style={{width : 500}} min={0} precision = {2} value={this.state.goodsVO.guideSellingPrice}
                                 onChange={this.handleGuideSellingPricePriceChange} placeholder="指导售价"/>
                </FormItem>
            </Modal>
        </span>)
    }
}

export default GoodsEditModal;
