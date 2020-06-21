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
        if (!this.state.outGoodsVO.goodsId) {
            notification.error({message : "保存失败", description : "商品必选"});
            return;
        }
        if (!this.state.outGoodsVO.customerId) {
            notification.error({message : "保存失败", description : "客户必选"});
            return;
        }
        if (!this.state.outGoodsVO.actualSellingPrice) {
          notification.error({message : "保存失败", description : "实际销售必填"});
          return;
        }
        if (!this.state.outGoodsVO.actualBuyingPrice) {
          notification.error({message : "保存失败", description : "实际成本必填"});
          return;
        }
        if (!this.state.outGoodsVO.actualPostage) {
          notification.error({message : "保存失败", description : "实际邮费必填"});
          return;
        }
        if (this.state.outGoodsVO.brokerage === undefined) {
          notification.error({message : "保存失败", description : "佣金必填"});
          return;
        }
        if (!this.state.outGoodsVO.num) {
          notification.error({message : "保存失败", description : "销售数量必填"});
          return;
        }

        this.setState({disable:true});

      OutGoodsAPI.saveOrUpdateOutGoods(this.state.outGoodsVO)
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

    handleGoodsIdChange = (value) => {
      this.state.outGoodsVO.goodsId = value;
      this.setState({outGoodsVO : deepClone(this.state.outGoodsVO)});
    };


    handleCustomerIdChange = (value) => {
      this.state.outGoodsVO.customerId = value;
      this.setState({outGoodsVO : deepClone(this.state.outGoodsVO)});
    };


    handleActualSellingPriceChange = (value) => {
      this.state.outGoodsVO.actualSellingPrice = value;
      this.setState({outGoodsVO : deepClone(this.state.outGoodsVO)});
    };

    handleActualPostageChange = (value) => {
      this.state.outGoodsVO.actualPostage = value;
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

    handleNumChange = (value) => {
      this.state.outGoodsVO.num = value;
      this.setState({outGoodsVO : deepClone(this.state.outGoodsVO)});
    };

    handleCalculatePostage = () => {
      OutGoodsAPI.calculatePostage({
        goodsId : this.state.outGoodsVO.goodsId,
        customerId : this.state.outGoodsVO.customerId,
        num : this.state.outGoodsVO.num,
      }).then((res) => {
          if (res.data.success) {
            this.state.outGoodsVO.actualPostage = res.data.data;
            this.setState({outGoodsVO : deepClone(this.state.outGoodsVO)});
          }
        });
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
                    <Select style={{width : 500, marginRight : 10}}
                            value={this.state.outGoodsVO.goodsId}
                            allowClear={true} showSearch required={true}
                            onSearch={this.handleGoodsIdSearch}
                            filterOption={(input, option) =>
                              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            onChange = {this.handleGoodsIdChange} placeholder="请输入商品ID">
                        {this.props.goodsList}
                    </Select>
                </FormItem>
                <FormItem label="客户ID" {...formItemLayout} required={true}>
                    <Select style={{width : 500, marginRight : 10}}
                            value={this.state.outGoodsVO.customerId}
                            allowClear={true} showSearch required={true}
                            onSearch={this.handleGoodsIdSearch}
                            filterOption={(input, option) =>
                              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            onChange = {this.handleCustomerIdChange} placeholder="请输入客户ID">
                        {this.props.customerList}
                    </Select>
                </FormItem>
                <FormItem label="售卖数量" {...formItemLayout} required={true}>
                    <InputNumber style={{width : 500}} min={0} precision = {0} value={this.state.outGoodsVO.num}
                                 onChange={this.handleNumChange} placeholder="请输入售卖数量"/>
                </FormItem>
                <FormItem label="实际销售价格(元)" {...formItemLayout} required={true}>
                    <InputNumber style={{width : 500}} min={0} precision = {2} value={this.state.outGoodsVO.actualSellingPrice}
                           onChange={this.handleActualSellingPriceChange} placeholder="请输入实际销售价格"/>
                </FormItem>
                <FormItem label="实际邮费(元)" {...formItemLayout} required={true}>
                    <InputNumber style={{width : 500}} min={0} precision = {2} value={this.state.outGoodsVO.actualPostage}
                                 onChange={this.handleActualPostageChange} placeholder="请输入实际销售价格"/>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <Button type="primary"
                            onClick={this.handleCalculatePostage}
                            disabled={
                              this.state.outGoodsVO.customerId === undefined ||
                              this.state.outGoodsVO.goodsId === undefined ||
                              this.state.outGoodsVO.num === undefined}
                    >
                      计算
                    </Button>
                </FormItem>
               <FormItem label="实际成本价格(元)" {...formItemLayout} required={true}>
                    <InputNumber style={{width : 500}} min={0} precision = {2} value={this.state.outGoodsVO.actualBuyingPrice}
                           onChange={this.handleActualBuyingPriceChange} placeholder="请输入实际成本价格"/>
                </FormItem>
               <FormItem label="佣金(元)" {...formItemLayout} required={true}>
                    <InputNumber style={{width : 500}} min={0} precision = {2} value={this.state.outGoodsVO.brokerage}
                           onChange={this.handleBrokerageChange} placeholder="请输入佣金"/>
                </FormItem>
            </Modal>
        </span>)
    }
}

export default OutGoodsEditModal;
