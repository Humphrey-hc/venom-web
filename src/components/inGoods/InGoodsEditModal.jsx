import React, {Component} from 'react';
import { Modal, Form, Input, Button, notification, Select, InputNumber, DatePicker} from 'antd';
import {commonMessage, deepClone, dateFormat} from "../CommonFunction";
import InGoodsAPI from "../api/InGoodsAPI";
import locale from 'antd/es/date-picker/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';

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
            goodsList: [],
        }
    }

    show = () => {
        if (this.props.item) {
            this.setState({inGoodsVO : deepClone(this.props.item),});
        } else {
            this.state.inGoodsVO = {
              channelWaybillNo: "暂无",
              dateStorage: moment(dateFormat("YYYY/mm/dd", new Date()), "YYYY-MM-DD")
            };
        }
        this.setState({modalVisible : true});
    };

    onOk = () => {
        if (this.state.disable) {
            return
        }

        //校验
        if (!this.state.inGoodsVO.channelOrderNo) {
            notification.error({message : "保存失败", description : "渠道订单号必填"});
            return;
        }
        if (!this.state.inGoodsVO.channelWaybillNo) {
            notification.error({message : "保存失败", description : "渠道运单号必填"});
            return;
        }
        if (!this.state.inGoodsVO.goodsId) {
          notification.error({message : "保存失败", description : "商品必选"});
          return;
        }
        if (!this.state.inGoodsVO.dateStorage) {
          notification.error({message : "保存失败", description : "采购失败必选"});
          return;
        }
        if (!this.state.inGoodsVO.num) {
          notification.error({message : "保存失败", description : "数量必填"});
          return;
        }
        this.setState({disable:true});

        InGoodsAPI.saveOrUpdateInGoods(this.state.inGoodsVO)
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

    handleChannelWaybillNoChange = (e) => {
      this.state.inGoodsVO.channelWaybillNo = e.target.value;
      this.setState({inGoodsVO : deepClone(this.state.inGoodsVO)});
    };

    handleGoodsIdChange = (value) => {
      this.state.inGoodsVO.goodsId = value;
      this.setState({inGoodsVO : deepClone(this.state.inGoodsVO)});
    };

    handleNumChange = (value) => {
      this.state.inGoodsVO.num = value;
      this.setState({inGoodsVO : deepClone(this.state.inGoodsVO)});
    };

    handleDateStorageChange = (date, dateString) => {
      this.state.inGoodsVO.dateStorage = dateString;
      this.setState({inGoodsVO : deepClone(this.state.inGoodsVO)});
    };

    handleGoodsIdSearch = (value) => {};

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
                <FormItem label="渠道运单号" {...formItemLayout} required={true}>
                    <Input style={{width : 500}} value={this.state.inGoodsVO.channelWaybillNo}
                           onChange={this.handleChannelWaybillNoChange} placeholder="请输入渠道运单号"/>
                </FormItem>
                <FormItem label="请选择商品" {...formItemLayout} required={true}>
                    <Select style={{width : 500}}  value={this.state.inGoodsVO.goodsId}
                            required={true} allowClear={true} showSearch
                            onSearch={this.handleGoodsIdSearch}
                            filterOption={(input, option) =>
                              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            onChange = {this.handleGoodsIdChange} placeholder="请选择商品">
                      {this.props.goodsList}
                    </Select>
                </FormItem>
                <FormItem label="采购时间" {...formItemLayout} required={true}>
                  <DatePicker style={{width : 500}} onChange={this.handleDateStorageChange} format="YYYY-MM-DD"
                              value = {this.state.inGoodsVO.dateStorage ? moment(this.state.inGoodsVO.dateStorage, "YYYY-MM-DD") : null}
                              placeholder="请选择采购时间" locale={locale}/>
                </FormItem>
               <FormItem label="数量" {...formItemLayout} required={true}>
                    <InputNumber style={{width : 500}} min={0} precision = {0} value={this.state.inGoodsVO.num}
                           onChange={this.handleNumChange} placeholder="请输入数量"/>
                </FormItem>
            </Modal>
        </span>)
    }
}

export default InGoodsEditModal;
