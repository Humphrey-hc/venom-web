import React, {Component} from "react";
import "../index.less";
import zhCN from 'antd/lib/locale-provider/zh_CN';
import {Button, Col, Input, Row, Table, Select, notification, ConfigProvider, Modal} from "antd";
import InGoodsAPI from "../../components/api/InGoodsAPI";
import InGoodsEditModal from "../../components/inGoods/InGoodsEditModal";
import GoodsAPI from "../../components/api/GoodsAPI";

const Option = Select.Option;
const confirm = Modal.confirm;

class InGoodsManage extends Component {
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
            goodsList: [],
            inGoodsStatusList: [
              {"code":"1", "name":"未签收"},
              {"code":"2", "name":"已签收"},
            ],
            channelCode: undefined,
            inGoodsId: undefined,
            goodsId: undefined,
            goodsName: undefined,
            inGoodsStatus: undefined,
            inGoodsPage: {}
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
      this.handleSearch(this.state.page, this.state.pageSize);
    }

    handleChannelCodeChange = (value) => {
        this.setState({
          channelCode: value
        }, function () {
          this.handleSearch(1, this.state.pageSize);
        });
    };

    handleStatusChange = (value) => {
      this.setState({
        inGoodsStatus: value
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

    handleInGoodsIdChange = (e) => {
      this.setState({
        inGoodsId : e.target.value
      }, function () {
        this.handleSearch(1, this.state.pageSize);
      });
    };

    refresh = () => {
        this.handleSearch(this.state.page);
    };

    handleSearch = (page, pageSize) => {
      InGoodsAPI.getInGoodsByPage({
            inGoodsId : this.state.inGoodsId,
            goodsId : this.state.goodsId,
            goodsName : this.state.goodsName,
            channelCode : this.state.channelCode,
            inGoodsStatus : this.state.inGoodsStatus,
            pageNum: page,
            pageSize : pageSize
        }).then((res) => {
            if (res.data.success) {
                this.setState({
                    inGoodsPage : res.data.data,
                    page : res.data.data.current,
                });
            }
        });
    };

    handleDelete = (id) => {
        confirm({
            title: '删除入库',
            content: <div><p>是否确认删除?</p></div>,
            onOk : () => {
              InGoodsAPI.deleteInGoods(id).then((res) => {
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

    handleSignedInGoods = (id) => {
      confirm({
        title: '签收入库',
        content: <div><p>是否确认签收?</p></div>,
        onOk : () => {
          InGoodsAPI.signedInGoods(id).then((res) => {
            if (res.data.success) {
              notification.success({message: "操作成功", description: "签收成功"});
              setTimeout(() => {this.handleSearch(this.state.page);});
            } else {
              notification.error({message: "操作失败", description: "签收失败"});
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
        let goodsList = this.state.goodsList.map((goods) => {
          return (<Option value={goods.id} key={goods.id}>{goods.id + "-" +goods.goodsName}</Option>)
        });
        let inGoodsStatusList = this.state.inGoodsStatusList.map((status) => {
          return (<Option value={status.code} key={status.code}>{status.name}</Option>)
        });
        let inGoodsPage = this.state.inGoodsPage;

        let columns = [
            { title : "ID", key : "id", dataIndex : "id", width: "50px"},
            { title : "商品名", key : "goodsName", dataIndex : "goodsName", width: "150px"},
            { title : "渠道订单号", key : "channelOrderNo", dataIndex : "channelOrderNo", width: "150px"},
            { title : "渠道运单号", key : "channelWaybillNo", dataIndex : "channelWaybillNo", width: "150px"},
            { title : "渠道", key : "channelName", dataIndex : "channelName", width: "150px"},
            { title : "入库时间", key : "dateStorage", dataIndex : "dateStorage", width: "150px"},
            { title : "状态", key : "inGoodsStatusName", dataIndex : "inGoodsStatusName", width: "100px"},
            { title : "数量", key : "num", dataIndex : "num", width: "100px"},
            { title : "操作", key : "operate", dataIndex : "", width: "150px",
                render : (text, record) => {
                    return (
                        <div>
                            <div>
                              {record.inGoodsStatusCode === 1 ?
                                <span>
                                  <a onClick={() => {this.handleSignedInGoods(record.id)}}>签收</a>
                                  &nbsp;&nbsp;|&nbsp;&nbsp;
                                </span>
                                :
                                null
                              }
                              {record.inGoodsStatusCode === 1 ?
                                <span>
                                  <InGoodsEditModal type="edit" item={record} key={record.id} channelList={channelList} goodsList={goodsList}
                                                    refresh={this.refresh.bind(this)} />
                                  &nbsp;&nbsp;|&nbsp;&nbsp;
                                  <a onClick={() => {this.handleDelete(record.id)}}>删除</a>
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
            total : inGoodsPage.total,
            current : inGoodsPage.current,
            pageSize : inGoodsPage.size,
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
                            <span style={{fontSize:20, fontWeight:"bold", color:"black"}}>入库管理</span>
                        </Col>
                    </Row>
                    <Row style={{paddingTop: 24}}>
                        <Col span={20}>
                            <Input style={{width: 200, marginRight: 10}} placeholder="请输入商品名称" allowClear
                                 value={this.state.goodsName} onChange={this.handleGoodsNameChange}/>
                            <Input style={{width: 200, marginRight: 10}} placeholder="请输入入库id" allowClear
                                   value={this.state.inGoodsId} onChange={this.handleInGoodsIdChange}/>
                            <Select style={{width : 200, marginRight : 10}}  value={this.state.channelCode} allowClear={true}
                                  onChange = {this.handleChannelCodeChange} placeholder="请选择渠道">
                              {channelList}
                            </Select>
                            <Select style={{width : 200, marginRight : 10}}  value={this.state.inGoodsStatus} allowClear={true}
                                    onChange = {this.handleStatusChange} placeholder="请选择状态">
                              {inGoodsStatusList}
                            </Select>
                        </Col>
                        <Col span={4} style={{textAlign: "right"}}>
                            <InGoodsEditModal type="add"
                                            item={undefined}
                                            key={0}
                                            channelList={channelList}
                                            goodsList={goodsList}
                                            refresh={this.refresh.bind(this)} />
                        </Col>
                    </Row>
                    <Row style={{paddingTop: 16}}>
                      <Col span={24}>
                        <Table columns={columns} dataSource={inGoodsPage.records} pagination={pagination}
                               rowKey={record => record.id} bordered
                        />
                      </Col>
                    </Row>
                </ConfigProvider>
            </div>
        )
    }
}

export default InGoodsManage;
