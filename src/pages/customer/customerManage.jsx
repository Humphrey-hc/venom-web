import React, {Component} from "react";
import "../index.less";
import zhCN from 'antd/lib/locale-provider/zh_CN';
import {Button, Col, Input, Row, Table, Select, notification, ConfigProvider, Modal} from "antd";
import CustomerAPI from "../../components/api/CustomerAPI";
import CustomerEditModal from "../../components/customer/CustomerEditModal";

const Option = Select.Option;
const confirm = Modal.confirm;

class CustomerManage extends Component {
    constructor(props) {
      super(props);
        this.state = {
            channelList:[
              {"code":"1", "name":"严选内购"},
              {"code":"2", "name":"大萌严选"},
              {"code":"3", "name":"其他"},
            ],
            page: 1,
            channelCode: undefined,
            customerId: undefined,
            name: undefined,
            weChatName: undefined,
            mobile: undefined,
            customerPage: {}
        };
    }

    componentDidMount() {
      this.handleSearch(this.state.page);
    }

    handleCustomerIdChange = (e) => {
      this.setState({customerId : e.target.value});
    };

    handleNameChange = (e) => {
        this.setState({name : e.target.value});
    };

    handleWeChatNameChange = (e) => {
      this.setState({weChatName : e.target.value});
    };

    handleMobileChange = (e) => {
      this.setState({mobile : e.target.value});
    };

    refresh = () => {
        this.handleSearch(this.state.page);
    };

    handleSearch = (page) => {
      CustomerAPI.findByPage({
            customerId : this.state.customerId,
            name : this.state.name,
            weChatName : this.state.weChatName,
            mobile : this.state.mobile,
            pageNum: page,
            pageSize : 10
        }).then((res) => {
            if (res.data.success) {
              console.log("data", res.data.data);
                this.setState({
                    customerPage : res.data.data,
                    page : res.data.data.current,
                });
            }
        });
    };

    handleDelete = (id) => {
        confirm({
            title: '删除线索',
            content: <div><p>是否确认删除?</p></div>,
            onOk : () => {
              CustomerAPI.deleteCustomer(id).then((res) => {
                    if (res.data.success) {
                        notification.success({message: "操作成功", description: "删除成功"});
                        setTimeout(() => {this.handleSearch(this.state.page);});
                    } else {
                        notification.error({message: "操作失败", description: "删除失败"});
                    }
                })
            },
            onCancel: () => {},
        });
    };


    render() {
        let channelList = this.state.channelList.map((channel) => {
          return (<Option value={channel.code} key={channel.code}>{channel.name}</Option>)
        });
        let customerPage = this.state.customerPage;

        let columns = [
            { title : "ID", key : "id", dataIndex : "id", width: "50px"},
            { title : "客户名称", key : "name", dataIndex : "name", width: "150px"},
            { title : "微信备注", key : "weChatName", dataIndex : "weChatName", width: "200px"},
            { title : "手机号", key : "mobile", dataIndex : "mobile", width: "200px"},
            { title : "省份", key : "provinceName", dataIndex : "provinceName", width: "150px"},
            { title : "城市", key : "cityName", dataIndex : "cityName", width: "150px"},
            { title : "地区", key : "districtName", dataIndex : "districtName", width: "150px"},
            { title : "操作", key : "operate", dataIndex : "", width: "150px",
                render : (text, record) => {
                    return (
                        <div>
                            <div>
                                <CustomerEditModal type="edit" item={record} key={record.id} channelList={channelList}
                                                  refresh={this.refresh.bind(this)} />
                                &nbsp;&nbsp;|&nbsp;&nbsp;
                                <a onClick={() => {this.handleDelete(record.id)}}>删除</a>
                            </div>
                        </div>)
                }
            }
        ];

        let pagination = {
            total : customerPage.total,
            current : customerPage.current,
            pageSize : customerPage.size,
            showTotal: total => `共 ${total} 条记录`,
            onChange: (page) => {
                this.handleSearch(page);
            }
        };

        return (
            <div>
                <ConfigProvider locale={zhCN}>
                    <Row>
                        <Col span={19}>
                            <span style={{fontSize:20, fontWeight:"bold", color:"black"}}>客户管理</span>
                        </Col>
                    </Row>
                    <Row style={{paddingTop: 24}}>
                        <Col span={20}>
                            <Input style={{width: 200, marginRight: 10}} placeholder="请输入客户id" allowClear
                                   value={this.state.id} onChange={this.handleCustomerIdChange}/>
                            <Input style={{width: 200, marginRight: 10}} placeholder="请输入客户名称" allowClear
                                   value={this.state.name} onChange={this.handleNameChange}/>
                            <Input style={{width: 200, marginRight: 10}} placeholder="请输入客户微信名称" allowClear
                                   value={this.state.weChatName} onChange={this.handleWeChatNameChange}/>
                            <Input style={{width: 200, marginRight: 10}} placeholder="请输入手机号" allowClear
                                   value={this.state.mobile} onChange={this.handleMobileChange}/>
                            <Button type="primary" style={{marginRight: 10}} onClick={() => {this.handleSearch(1)}}>搜索</Button>
                        </Col>
                        <Col span={4} style={{textAlign: "right"}}>
                            <CustomerEditModal type="add"
                                              item={undefined}
                                              key={0}
                                              channelList={channelList}
                                              refresh={this.refresh.bind(this)} />
                        </Col>
                    </Row>
                    <Row style={{paddingTop: 16}}>
                      <Col span={24}>
                        <Table columns={columns} dataSource={customerPage.records} pagination={pagination}
                               rowKey={record => record.id} bordered
                        />
                      </Col>
                    </Row>
                </ConfigProvider>
            </div>
        )
    }
}

export default CustomerManage;
