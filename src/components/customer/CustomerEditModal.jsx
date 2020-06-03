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
            provinceList: [],
            cityList: [],
            districtList: [],
        }
    }

    componentDidMount() {
      CustomerAPI.getProvince().then((res) => {
        if (res.data.success) {
          this.setState({
            provinceList : res.data.data
          });
        }
      });
    }

    show = () => {
        if (this.props.item) {
            let customer = deepClone(this.props.item);
            let provinceCode = customer.provinceCode;
            let cityCode = customer.cityCode;
            CustomerAPI.getCitiesByProvinceCode(provinceCode).then((res) => {
              if (res.data.success) {
                this.setState({
                  cityList : res.data.data,
                });
              }
            });
            CustomerAPI.getDistrictsByCityCode(cityCode).then((res) => {
              if (res.data.success) {
                this.setState({
                  districtList : res.data.data,
                });
              }
            });
            this.setState({
              customerVO : deepClone(this.props.item),
            });
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
        if (!this.state.customerVO.name) {
            notification.error({message : "保存失败", description : "姓名必填"});
            return;
        }
        if (!this.state.customerVO.mobile) {
          notification.error({message : "保存失败", description : "手机号必填"});
          return;
        }
        if (!this.state.customerVO.provinceCode) {
          notification.error({message : "保存失败", description : "省份必选"});
          return;
        }
        if (!this.state.customerVO.cityCode) {
          notification.error({message : "保存失败", description : "城市必选"});
          return;
        }
        if (!this.state.customerVO.districtCode) {
          notification.error({message : "保存失败", description : "地区必选"});
          return;
        }
        this.setState({disable:true});

      CustomerAPI.saveOrUpdateCustomer(this.state.customerVO)
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
        this.state.customerVO.provinceCode = value;

        if (undefined === value) {
          this.state.customerVO.cityCode = undefined;
          this.state.customerVO.districtCode = undefined;
          this.setState({
            cityList : [],
            districtList : [],
            customerVO : deepClone(this.state.customerVO)
          });
          return;
        }

        CustomerAPI.getCitiesByProvinceCode(value).then((res) => {
          if (res.data.success) {
            this.setState({
              cityList : res.data.data,
              customerVO : deepClone(this.state.customerVO)
            });
          }
        });
    };

    handleCityChange = (value) => {
      this.state.customerVO.cityCode = value;

      if (undefined === value) {
        this.state.customerVO.districtCode = undefined;
        this.setState({
          districtList : [],
          customerVO : deepClone(this.state.customerVO)
        });
        return;
      }

      CustomerAPI.getDistrictsByCityCode(value).then((res) => {
        if (res.data.success) {
          this.setState({
            districtList : res.data.data,
            customerVO : deepClone(this.state.customerVO)
          });
        }
      });
    };

    handleDistrictChange = (value) => {
      this.state.customerVO.districtCode = value;
      this.setState({customerVO : deepClone(this.state.customerVO)});
    };

    render() {

        let provinceList = this.state.provinceList.map((province) => {
          return (<Option value={province.code} key={province.code}>{province.name}</Option>)
        });

        let cityList = this.state.cityList.map((city) => {
          return (<Option value={city.code} key={city.code}>{city.name}</Option>)
        });

        let districtList = this.state.districtList.map((city) => {
          return (<Option value={city.code} key={city.code}>{city.name}</Option>)
        });

        let type = this.props.type;
        let clickEle = null;
        let title = null;
        if (type === "add") {
            clickEle = (<Button type="primary" onClick={this.show}>添加</Button>);
            title = "添加客户"
        } else {
            clickEle = (<a onClick={this.show}>编辑</a>);
            title = "编辑客户"
        }

        return (<span>
            {clickEle}
            <Modal title={title} width={700} visible={this.state.modalVisible}
                   onOk={this.onOk} onCancel={this.onCancel} key={this.props.key}>
                <FormItem label="客户名称" {...formItemLayout} required={true}>
                    <Input style={{width : 500}} value={this.state.customerVO.name}
                           onChange={this.handleNameChange} placeholder="请输入客户名称"/>
                </FormItem>
                <FormItem label="微信备注" {...formItemLayout}>
                    <Input style={{width : 500}} value={this.state.customerVO.weChatName}
                           onChange={this.handleWeChatNameChange} placeholder="请输入微信备注"/>
                </FormItem>
                <FormItem label="手机号" {...formItemLayout} required={true}>
                    <Input style={{width : 500}} value={this.state.customerVO.mobile}
                           onChange={this.handleMobileChange} placeholder="请输入手机号"/>
                </FormItem>
                <FormItem label="省份" {...formItemLayout} required={true}>
                    <Select style={{width : 500, marginRight : 10}}  value={this.state.customerVO.provinceCode} allowClear={true}
                            onChange = {this.handleProvinceChange} placeholder="请选择省份">
                        {provinceList}
                    </Select>
                </FormItem>
                <FormItem label="城市" {...formItemLayout} required={true}>
                    <Select style={{width : 500, marginRight : 10}}  value={this.state.customerVO.cityCode} allowClear={true}
                            onChange = {this.handleCityChange} placeholder="请选择城市">
                        {cityList}
                    </Select>
                </FormItem>
                <FormItem label="地区" {...formItemLayout} required={true}>
                    <Select style={{width : 500, marginRight : 10}}  value={this.state.customerVO.districtCode} allowClear={true}
                            onChange = {this.handleDistrictChange} placeholder="请选择地区">
                        {districtList}
                    </Select>
                </FormItem>
            </Modal>
        </span>)
    }
}

export default CustomerEditModal;
