import React, {Component} from "react";
import "../index.less";
import zhCN from 'antd/lib/locale-provider/zh_CN';
import {Badge, Col, Input, Row, Table, Select, notification, ConfigProvider, Modal, DatePicker,  Popover} from "antd";
import OutGoodsAPI from "../../components/api/OutGoodsAPI";
import OutGoodsEditModal from "../../components/outGoods/OutGoodsEditModal";
import GoodsAPI from "../../components/api/GoodsAPI";
import CustomerAPI from "../../components/api/CustomerAPI";
import {deepClone, dateFormat} from "../../components/CommonFunction";
import locale from 'antd/es/date-picker/locale/zh_CN';
import moment from 'moment';

const Option = Select.Option;
const confirm = Modal.confirm;

class OutGoodsManage extends Component {
    constructor(props) {
      super(props);
        this.state = {
            page: 1,
            pageSize: 10,
            channelList:[
              {"code":"1", "name":"严选内购"},
              {"code":"2", "name":"大萌严选"},
              {"code":"3", "name":"其他"},
            ],
            statusList:[
              {"code":1, "name":"未发货"},
              {"code":2, "name":"待签收"},
              {"code":3, "name":"已签收"},
              {"code":4, "name":"退货"},
            ],
            channelCode: undefined,
            goodsName: undefined,
            customerName: undefined,
            dateOut: undefined,
            dateDeliver: undefined,
            status: undefined,
            remark: undefined,
            outGoodsPage: {},
            goodsList: [],
            customerList: []
        };
    }

    componentDidMount() {
      GoodsAPI.getGoodsList().then((res) => {
        if (res.data.success) {
          this.setState({
            goodsList : res.data.data
          });
        }
      });
      CustomerAPI.getCustomerList().then((res) => {
        if (res.data.success) {
          this.setState({
            customerList : res.data.data
          });
        }
      });
      this.handleSearch(this.state.page, this.state.pageSize);
    }

    handleChannelCodeChange = (value) => {
        this.setState({
          channelCode: value
        }, function () {
          this.handleSearch(1, this.state.pageSize);
        });
    };

    handleStatusCodeChange = (value) => {
      this.setState({
        status: value
      }, function () {
        this.handleSearch(1, this.state.pageSize);
      });
    };

    handleGoodsNameChange = (e) => {
      this.setState({
        goodsName : e.target.value
      }, function () {
        this.handleSearch(1, this.state.pageSize);
      });
    };

    handleCustomerNameChange = (e) => {
      this.setState({
        customerName : e.target.value
      }, function () {
        this.handleSearch(1, this.state.pageSize);
      });
    };

    handleDateOutChange = (date, dateString) => {
      this.setState({
        dateOut : dateString
      }, function () {
        this.handleSearch(1, this.state.pageSize);
      });
    };

    handleDateDeliverChange = (date, dateString) => {
      this.setState({
        dateDeliver : dateString
      }, function () {
        this.handleSearch(1, this.state.pageSize);
      });
    };

    handleRemarkChange = (e) => {
      this.setState({remark : e.target.value});
    };

    refresh = () => {
        this.handleSearch(this.state.page);
    };

    handleSearch = (page, pageSize) => {
      OutGoodsAPI.getOutGoodsByPage({
            dateOut : this.state.dateOut,
            dateDeliver : this.state.dateDeliver,
            goodsName : this.state.goodsName,
            customerName : this.state.customerName,
            channelCode : this.state.channelCode,
            status : this.state.status,
            pageNo: page,
            pageSize : pageSize
        }).then((res) => {
            if (res.data.success) {
                this.setState({
                    outGoodsPage : res.data.data,
                    page : res.data.data.current,
                });
            }
        });
    };

    handleDelete = (id) => {
        confirm({
            title: '删除出库',
            content: <div><p>是否确认删除?</p></div>,
            onOk : () => {
              OutGoodsAPI.deleteOutGoods(id).then((res) => {
                    if (res.data.success) {
                        notification.success({message: "操作成功", description: "删除成功"});
                        setTimeout(() => {this.handleSearch(this.state.page, this.state.pageSize);});
                    } else {
                        notification.error({message: "操作失败", description: "删除失败"});
                    }
                })
            },
            onCancel: () => {},
        });
    };

    handleStatus = (id, status) => {
      confirm({
        title: '出库状态修改',
        content: <div><p>是否确认修改状态?</p></div>,
        onOk : () => {
          OutGoodsAPI.updateOutGoodsStatus({
            status : status,
            outGoodsId : id,
          }).then((res) => {
            if (res.data.success) {
              notification.success({message: "操作成功", description: "执行成功"});
              setTimeout(() => {this.handleSearch(this.state.page, this.state.pageSize);});
            } else {
              notification.error({message: "操作失败", description: "执行失败"});
            }
          })
        },
        onCancel: () => {},
      });
    };

    handleRemark = (record) => {
      confirm({
        title: '编辑备注',
        content:
        <div>
          <Input placeholder="请输入备注" allowClear defaultValue={record.remark}
                 value={this.state.remark} onChange={this.handleRemarkChange}/>
        </div>,
        onOk : () => {
          OutGoodsAPI.updateOutGoodsRemark({
            remark : this.state.remark,
            outGoodsId : record.id,
          }).then((res) => {
            if (res.data.success) {
              notification.success({message: "操作成功", description: "修改成功"});
              setTimeout(() => {
                this.handleSearch(this.state.page, this.state.pageSize);
                this.setState({remark: undefined});
              });
            } else {
              notification.error({message: "操作失败", description: "修改失败"});
              this.setState({remark: undefined});
            }
          })
        },
        onCancel: () => {
          this.setState({remark: undefined});
        },
      });
    };


    render() {
        let goodsList = this.state.goodsList.map((goods) => {
          return (<Option value={goods.id} key={goods.id}>{goods.id + "-" +goods.goodsName}</Option>)
        });
        let channelList = this.state.channelList.map((channel) => {
            return (<Option value={channel.code} key={channel.code}>{channel.name}</Option>)
        });
        let customerList = this.state.customerList.map((customer) => {
          return (<Option value={customer.id} key={customer.id}>{customer.id + "-" +customer.name}</Option>)
        });
        let statusList = this.state.statusList.map((status) => {
          return (<Option value={status.code} key={status.code}>{status.name}</Option>)
        });
        let outGoodsPage = this.state.outGoodsPage;

        let columns = [
            { title : "商品名", key : "goodsName", dataIndex : "goodsName", width: "150px", fixed: 'left',
                render : (text, record) => {
                  let remarkIsEmpty = record.remark === '' || record.remark === undefined;
                  if (remarkIsEmpty) {
                    return (<a onClick={() => {this.handleRemark(record)}}>{record.goodsName}</a>);
                  } else {
                    return (
                      <Popover content={record.remark} title="备注">
                        <Badge dot={true}>
                          <a onClick={() => {this.handleRemark(record)}}>{record.goodsName}</a>
                        </Badge>
                      </Popover>
                    );
                  }
                }
            },
            { title : "客户名称", key : "customerName", dataIndex : "customerName", width: "150px"},
            { title : "渠道", key : "channelName", dataIndex : "channelName", width: "150px"},
            { title : "邮费", key : "actualPostage", dataIndex : "actualPostage", width: "100px"},
            { title : "实际售价", key : "actualSellingPrice", dataIndex : "actualSellingPrice", width: "100px"},
            { title : "实际成本", key : "actualBuyingPrice", dataIndex : "actualBuyingPrice", width: "100px"},
            { title : "数量", key : "num", dataIndex : "num", width: "100px"},
            { title : "佣金", key : "brokerage", dataIndex : "brokerage", width: "100px"},
            { title : "实际利润", key : "profit", dataIndex : "profit", width: "100px"},
            { title : "状态", key : "outGoodsStatusName", dataIndex : "outGoodsStatusName", width: "100px"},
            { title : "出库时间", key : "dateCreate", dataIndex : "dateCreate", width: "150px"},
            { title : "发货时间", key : "dateDeliver", dataIndex : "dateDeliver", width: "150px"},
            { title : "操作", key : "operate", dataIndex : "", width: "120px", fixed: 'right',
                render : (text, record) => {
                    return (
                        <div>
                            <div>
                                <OutGoodsEditModal type="edit" item={record} key={record.id} customerList={customerList} goodsList={goodsList}
                                                  refresh={this.refresh.bind(this)} />
                                &nbsp;&nbsp;|&nbsp;&nbsp;
                                <a onClick={() => {this.handleDelete(record.id)}}>删除</a><br/>
                                {record.outGoodsStatusCode === 1 ?
                                  <span>
                                    <a onClick={() => {this.handleStatus(record.id, 2)}}>发货</a>
                                  </span>
                                  :
                                  null
                                }
                                {record.outGoodsStatusCode === 2 ?
                                  <span>
                                    <a onClick={() => {this.handleStatus(record.id, 3)}}>签收</a>
                                    &nbsp;&nbsp;|&nbsp;&nbsp;
                                    <a onClick={() => {this.handleStatus(record.id, 4)}}>退货</a>
                                  </span>
                                  :
                                  null
                                }
                            </div>
                        </div>)
                }
            }
        ];

        let pagination = {
            total : outGoodsPage.total,
            current : outGoodsPage.current,
            pageSize : outGoodsPage.size,
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
                            <span style={{fontSize:20, fontWeight:"bold", color:"black"}}>出库管理</span>
                        </Col>
                    </Row>
                    <Row style={{paddingTop: 24}}>
                        <Col span={20}>
                            <Input style={{width: 160, marginRight: 10}} placeholder="请输入商品名称" allowClear
                                   value={this.state.goodsName} onChange={this.handleGoodsNameChange}/>
                            <Input style={{width: 160, marginRight: 10}} placeholder="请输入客户名称" allowClear
                                   value={this.state.customerName} onChange={this.handleCustomerNameChange}/>
                            <Select style={{width : 160, marginRight : 10}}  value={this.state.channelCode} allowClear={true}
                                  onChange = {this.handleChannelCodeChange} placeholder="请选择渠道">
                              {channelList}
                            </Select>
                            <Select style={{width : 160, marginRight : 10}}  value={this.state.status} allowClear={true}
                                    onChange = {this.handleStatusCodeChange} placeholder="请选择状态">
                              {statusList}
                            </Select>
                            <DatePicker style={{width: 160, marginRight: 10}} onChange={this.handleDateOutChange} format="YYYY-MM-DD"
                                        defaultValue = {this.state.dateOut ? moment(this.state.dateOut, "YYYY-MM-DD") : null}
                                        placeholder="请选择出库时间" locale={locale}/>
                            <DatePicker style={{width: 160, marginRight: 10}} onChange={this.handleDateDeliverChange} format="YYYY-MM-DD"
                                        defaultValue = {this.state.dateDeliver ? moment(this.state.dateDeliver, "YYYY-MM-DD") : null}
                                        placeholder="请选择发货时间" locale={locale}/>
                        </Col>
                        <Col span={4} style={{textAlign: "right"}}>
                            <OutGoodsEditModal type="add"
                                            item={undefined}
                                            key={0}
                                            customerList={customerList}
                                            goodsList={goodsList}
                                            refresh={this.refresh.bind(this)} />
                        </Col>
                    </Row>
                    <Row style={{paddingTop: 16}}>
                      <Col span={24}>
                        <Table columns={columns} dataSource={outGoodsPage.records} pagination={pagination} scroll={{ x: 800 }}
                               rowKey={record => record.id} bordered
                        />
                      </Col>
                    </Row>
                </ConfigProvider>
            </div>
        )
    }
}

export default OutGoodsManage;
