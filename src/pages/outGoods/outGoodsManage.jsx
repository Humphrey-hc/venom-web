import React, {Component} from "react";
import "../index.less";
import zhCN from 'antd/lib/locale-provider/zh_CN';
import {Button, Col, Input, Row, Table, Select, notification, ConfigProvider, Modal} from "antd";
import OutGoodsAPI from "../../components/api/OutGoodsAPI";
import OutGoodsEditModal from "../../components/outGoods/OutGoodsEditModal";

const Option = Select.Option;
const confirm = Modal.confirm;

class OutGoodsManage extends Component {
    constructor(props) {
      super(props);
        this.state = {
            page: 1,
            channelList:[
              {"code":"1", "name":"严选内购"},
              {"code":"2", "name":"大萌严选"},
              {"code":"3", "name":"其他"},
            ],
            channelCode: undefined,
            outGoodsId: undefined,
            goodsId: undefined,
            goodsName: undefined,
            customerName: undefined,
            outGoodsPage: {}
        };
    }

    handleChannelCodeChange = (value) => {
        this.setState({channelCode: value});
    };

    handleOutGoodsIdChange = (e) => {
        this.setState({outGoodsId : e.target.value});
    };

    handleGoodsIdChange = (e) => {
        this.setState({goodsId : e.target.value});
    };

    handleGoodsNameChange = (e) => {
      this.setState({goodsName : e.target.value});
    };

    handleCustomerNameChange = (e) => {
      this.setState({customerName : e.target.value});
    };

    refresh = () => {
        this.handleSearch(this.state.page);
    };

    handleSearch = (page) => {
      OutGoodsAPI.findByPage({
            outGoodsId : this.state.outGoodsId,
            goodsId : this.state.goodsId,
            goodsName : this.state.goodsName,
            customerName : this.state.customerName,
            channelCode : this.state.channelCode,
            pageNo: page,
            pageSize : 10
        }).then((res) => {
            if (res.data.success) {
                this.setState({
                    outGoodsPage : res.data.data,
                    page : res.data.data.currentIndex,
                });
            }
        });
    };

    handleDelete = (id) => {
        confirm({
            title: '删除线索',
            content: <div><p>是否确认删除?</p></div>,
            onOk : () => {
              OutGoodsAPI.deleteById({id : id}).then((res) => {
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
        let outGoodsPage = this.state.outGoodsPage;

        let columns = [
            { title : "ID", key : "id", dataIndex : "id", width: "50px"},
            { title : "商品名", key : "goodsName", dataIndex : "goodsName", width: "200px"},
            { title : "客户名称", key : "customerName", dataIndex : "customerName", width: "200px"},
            { title : "渠道", key : "channelName", dataIndex : "channelName", width: "150px"},
            { title : "实际售价", key : "actualSellingPrice", dataIndex : "actualSellingPrice", width: "150px"},
            { title : "实际成本", key : "actualSellingPrice", dataIndex : "actualSellingPrice", width: "150px"},
            { title : "佣金", key : "actualSellingPrice", dataIndex : "actualSellingPrice", width: "150px"},
            { title : "实际利润", key : "actualSellingPrice", dataIndex : "actualSellingPrice", width: "150px"},
            { title : "操作", key : "operate", dataIndex : "", width: "100px",
                render : (text, record) => {
                    return (
                        <div>
                            <div>
                                <OutGoodsEditModal type="edit" item={record} key={record.id} bizTypeList={bizTypeList}
                                                  refresh={this.refresh.bind(this)} />
                                &nbsp;&nbsp;|&nbsp;&nbsp;
                                <a onClick={() => {this.handleDelete(record.id)}}>删除</a>
                            </div>
                        </div>)
                }
            }
        ];

        let pagination = {
            total : outGoodsPage.totalNumber,
            current : outGoodsPage.currentIndex,
            pageSize : outGoodsPage.pageSize,
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
                            <span style={{fontSize:20, fontWeight:"bold", color:"black"}}>出库管理</span>
                        </Col>
                    </Row>
                    <Row style={{paddingTop: 24}}>
                        <Col span={20}>
                            <Input style={{width: 160, marginRight: 10}} placeholder="请输入出库id" allowClear
                                   value={this.state.outGoodsId} onChange={this.handleOutGoodsIdChange}/>
                            <Input style={{width: 160, marginRight: 10}} placeholder="请输入商品id" allowClear
                                   value={this.state.goodsId} onChange={this.handleGoodsIdChange}/>
                            <Input style={{width: 160, marginRight: 10}} placeholder="请输入商品名称" allowClear
                                   value={this.state.goodsName} onChange={this.handleGoodsNameChange}/>
                            <Input style={{width: 160, marginRight: 10}} placeholder="请输入客户名称" allowClear
                                   value={this.state.customerName} onChange={this.handleCustomerNameChange}/>
                            <Select style={{width : 160, marginRight : 10}}  value={this.state.channelCode} allowClear={true}
                                  onChange = {this.handleChannelCodeChange} placeholder="请选择渠道">
                              {channelList}
                            </Select>
                            <Button type="primary" style={{marginRight: 10}} onClick={() => {this.handleSearch(1)}}>搜索</Button>
                        </Col>
                        <Col span={4} style={{textAlign: "right"}}>
                            <OutGoodsEditModal type="add"
                                            item={undefined}
                                            key={0}
                                            channelList={channelList}
                                            refresh={this.refresh.bind(this)} />
                        </Col>
                    </Row>
                    <Row style={{paddingTop: 16}}>
                      <Col span={24}>
                        <Table columns={columns} dataSource={outGoodsPage.items} pagination={pagination}
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
