import React, {Component} from "react";
import "../index.less";
import zhCN from 'antd/lib/locale-provider/zh_CN';
import {Col, Input, Row, Table, Select, notification, ConfigProvider, Modal} from "antd";
import CustomerAPI from "../../components/api/CustomerAPI";
import CustomerEditModal from "../../components/customer/CustomerEditModal";
import OutGoodsAPI from "../../components/api/OutGoodsAPI";

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
            pageSize: 10,
            channelCode: undefined,
            customerId: undefined,
            name: undefined,
            weChatName: undefined,
            mobile: undefined,
            customerPage: {},
            followStatusList:[
              <Option value={1} key={1}>未跟进</Option>,
              <Option value={2} key={2}>已发送请求</Option>,
              <Option value={3} key={3}>跟进失败</Option>,
              <Option value={4} key={4}>已跟进</Option>,
            ],
            followStatus: undefined,
            followSearchStatus: undefined,
            provinceList: []
        };
    }

    componentDidMount() {
      CustomerAPI.getProvince().then((res) => {
        if (res.data.success) {
          this.setState({
            provinceList : res.data.data
          });
        }
      });
      this.handleSearch(this.state.page, this.state.pageSize);
    }

    handleNameChange = (e) => {
        this.setState({
          name : e.target.value
        }, function () {
          this.handleSearch(1, this.state.pageSize);
        });
    };

    handleWeChatNameChange = (e) => {
      this.setState({
        weChatName : e.target.value
      }, function () {
        this.handleSearch(1, this.state.pageSize);
      });
    };

    handleMobileChange = (e) => {
      this.setState({
        mobile : e.target.value
      }, function () {
        this.handleSearch(1, this.state.pageSize);
      });
    };

    refresh = () => {
        this.handleSearch(this.state.page);
    };

    handleSearch = (page, pageSize) => {
      CustomerAPI.findByPage({
            name : this.state.name,
            weChatName : this.state.weChatName,
            mobile : this.state.mobile,
            followStatus : this.state.followSearchStatus,
            pageNum: page,
            pageSize : pageSize
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

    handleFollowStatusChange = (value) => {
      this.setState({followStatus: value});
    };

    handleFollowStatusSearchChange = (value) => {
      this.setState({
        followSearchStatus : value
      }, function () {
        this.handleSearch(1, this.state.pageSize);
      });
    };

    handleFollowSelect = (record) => {
      confirm({
        title: '修改跟进状态',
        content:
          <span>
            <Select value={this.state.followStatus} allowClear={true} placeholder="请选择跟进状态"
                    onChange = {this.handleFollowStatusChange} style={{width: 350, marginRight: 10, marginTop: 10}}>
              {this.state.followStatusList}
            </Select>
          </span>,
        onOk : () => {
          CustomerAPI.updateCustomerFollowStatus({
            followStatus : this.state.followStatus,
            customerId : record.id,
          }).then((res) => {
            if (res.data.success) {
              notification.success({message: "操作成功", description: "修改成功"});
              setTimeout(() => {
                this.handleSearch(this.state.page, this.state.pageSize);
                this.setState({followStatus: undefined});
              });
            } else {
              notification.error({message: "操作失败", description: "修改失败"});
              this.setState({followStatus: undefined});
            }
          })
        },
        onCancel: () => {
          this.setState({remark: undefined});
        },
      });
    };


    render() {
        let provinceList = this.state.provinceList.map((province) => {
          return (<Option value={province.code} key={province.code}>{province.name}</Option>)
        });

        let channelList = this.state.channelList.map((channel) => {
          return (<Option value={channel.code} key={channel.code}>{channel.name}</Option>)
        });

        let customerPage = this.state.customerPage;

        let columns = [
            { title : "客户名称", key : "name", dataIndex : "name", width: "150px"},
            { title : "微信备注", key : "weChatName", dataIndex : "weChatName", width: "250px"},
            { title : "手机号", key : "mobile", dataIndex : "mobile", width: "200px"},
            { title : "省份", key : "provinceName", dataIndex : "provinceName", width: "150px"},
            { title : "城市", key : "cityName", dataIndex : "cityName", width: "150px"},
            { title : "地区", key : "districtName", dataIndex : "districtName", width: "150px"},
            { title : "跟进状态", key : "followStatusName", dataIndex : "followStatusName", width: "150px",
                render : (text, record) => {
                  let color = undefined;
                  if (1=== record.followStatusCode) {
                    color = "red";
                  }
                  if (2=== record.followStatusCode) {
                    color = "#fadf14";
                  }
                  if (3=== record.followStatusCode) {
                    color = undefined;
                  }
                  if (4=== record.followStatusCode) {
                    color = "#52c41a";
                  }
                  return (
                    <span>
                      <a onClick={() => {this.handleFollowSelect(record)}}
                         style={{color: color}}
                      >
                        {text}
                      </a>
                    </span>
                  )
                }
            },
            { title : "操作", key : "operate", dataIndex : "", width: "150px",
                render : (text, record) => {
                    return (
                        <div>
                            <div>
                                <CustomerEditModal type="edit" item={record} key={record.id} channelList={channelList} provinceList={provinceList}
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
            onChange: (page, pageSize) => {
                this.handleSearch(page, pageSize);
            },
            onShowSizeChange: (current, pageSize) => {
              this.setState({
                pageSize: pageSize
              });
              this.handleSearch(current, pageSize);
            },
            showSizeChanger: true
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
                            <Input style={{width: 200, marginRight: 10}} placeholder="请输入客户名称" allowClear
                                   value={this.state.name} onChange={this.handleNameChange}/>
                            <Input style={{width: 200, marginRight: 10}} placeholder="请输入客户微信名称" allowClear
                                   value={this.state.weChatName} onChange={this.handleWeChatNameChange}/>
                            <Input style={{width: 200, marginRight: 10}} placeholder="请输入手机号" allowClear
                                   value={this.state.mobile} onChange={this.handleMobileChange}/>
                            <Select value={this.state.followSearchStatus} allowClear={true} placeholder="请选择跟进状态"
                                    onChange = {this.handleFollowStatusSearchChange} style={{width: 200, marginRight: 10}}>
                              {this.state.followStatusList}
                            </Select>
                        </Col>
                        <Col span={4} style={{textAlign: "right"}}>
                            <CustomerEditModal type="add"
                                              item={undefined}
                                              key={0}
                                              channelList={channelList}
                                              provinceList={provinceList}
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
