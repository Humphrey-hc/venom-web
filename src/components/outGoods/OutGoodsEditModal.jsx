import React, {Component} from 'react';
import { Modal, Form, Input, Button, notification, Select, InputNumber} from 'antd';
import {commonMessage, deepClone} from "../CommonFunction";
import OutGoodsAPI from "../api/OutGoodsAPI";

const formItemLayout = {
    labelCol: {span: 4},
    wrapperCol: {span: 20},
};
const FormItem = Form.Item;

class OutGoodsEditModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalVisible : false,
            disable : false,
            outGoodsVO: {},
            channelList: [],
            tagId: undefined,
            parentTagId: undefined,
        }
    }

    show = () => {
        if (this.props.item) {
            this.setState({outGoodsVO : deepClone(this.props.item),});
        } else {
            this.state.outGoodsVO = {};
        }
        this.setState({modalVisible : true});
    };

    onOk = () => {
        if (this.state.disable) {
            return
        }

        //校验
        if (!this.state.outGoodsVO.bizId) {
            notification.error({message : "保存失败", description : "业务类型必选"});
            return;
        }
        if (!this.state.outGoodsVO.name) {
            notification.error({message : "保存失败", description : "姓名必填"});
            return;
        }
        if (this.state.outGoodsVO.name.length > 20) {
            notification.error({message : "保存失败", description : "姓名长度不能大于20"});
            return;
        }
        if (!this.state.outGoodsVO.phone) {
            notification.error({message : "保存失败", description : "手机号必填"});
            return;
        }
        if (! (this.state.outGoodsVO.phone.match(phoneRegx)) ) {
            notification.error({message : "保存失败", description : "请填写有效手机号"});
            return;
        }

        if (this.state.outGoodsVO.remark && this.state.clueVO.remark.length > 200) {
            notification.error({message : "保存失败", description : "备注长度不能大于200"});
            return;
        }
        this.setState({disable:true});

      OutGoodsAPI.saveOrUpdate(this.state.outGoodsVO)
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

    handleGoodsIdChange = (e) => {
        this.state.outGoodsVO.goodsId = e.target.value;
        this.setState({outGoodsVO : deepClone(this.state.outGoodsVO)});
    };

    handleCustomerIdChange = (e) => {
      this.state.outGoodsVO.customerId = e.target.value;
      this.setState({outGoodsVO : deepClone(this.state.outGoodsVO)});
    };


    handleActualSellingPriceChange = (value) => {
      this.state.outGoodsVO.actualSellingPrice = value;
      this.setState({outGoodsVO : deepClone(this.state.outGoodsVO)});
    };

    handleActualBuyingPriceChange = (value) => {
      this.state.outGoodsVO.actualBuyingPrice = value;
      this.setState({outGoodsVO : deepClone(this.state.outGoodsVO)});
    };

    handleBrokerageChange = (value) => {
      this.state.outGoodsVO.brokerage = value;
      this.setState({outGoodsVO : deepClone(this.state.outGoodsVO)});
    };

    handleProfitChange = (value) => {
      this.state.outGoodsVO.profit = value;
      this.setState({outGoodsVO : deepClone(this.state.outGoodsVO)});
    };

    render() {

        let type = this.props.type;
        let clickEle = null;
        let title = null;
        if (type === "add") {
            clickEle = (<Button type="primary" onClick={this.show}>添加</Button>);
            title = "添加出库"
        } else {
            clickEle = (<a onClick={this.show}>编辑</a>);
            title = "编辑出库"
        }

        return (<span>
            {clickEle}
            <Modal title={title} width={850} visible={this.state.modalVisible}
                   onOk={this.onOk} onCancel={this.onCancel} key={this.props.key}>
                <FormItem label="商品ID" {...formItemLayout} required={true}>
                    <Input style={{width : 500}} value={this.state.outGoodsVO.goodsId}
                           onChange={this.handleGoodsIdChange} placeholder="请输入商品ID"/>
                </FormItem>
                <FormItem label="客户ID" {...formItemLayout} required={true}>
                    <Input style={{width : 500}} value={this.state.outGoodsVO.customerId}
                           onChange={this.handleCustomerIdChange} placeholder="请输入客户ID"/>
                </FormItem>
                <FormItem label="实际销售价格(元)" {...formItemLayout} required={true}>
                    <InputNumber style={{width : 500}} min={0} precision = {0} value={this.state.outGoodsVO.actualSellingPrice}
                           onChange={this.handleActualSellingPriceChange} placeholder="请输入实际销售价格"/>
                </FormItem>
               <FormItem label="实际销售价格(元)" {...formItemLayout} required={true}>
                    <InputNumber style={{width : 500}} min={0} precision = {2} value={this.state.outGoodsVO.actualBuyingPrice}
                           onChange={this.handleActualBuyingPriceChange} placeholder="请输入实际销售价格"/>
                </FormItem>
               <FormItem label="佣金(元)" {...formItemLayout} required={true}>
                    <InputNumber style={{width : 500}} min={0} precision = {2} value={this.state.outGoodsVO.brokerage}
                           onChange={this.handleBrokerageChange} placeholder="请输入佣金"/>
                </FormItem>
                <FormItem label="利润(元)" {...formItemLayout} required={true}>
                    <InputNumber style={{width : 500}} min={0} precision = {2} value={this.state.outGoodsVO.profit}
                                 onChange={this.handleProfitChange} placeholder="请输入利润"/>
                </FormItem>
            </Modal>
        </span>)
    }
}

export default OutGoodsEditModal;
