import React, {Component} from "react";
import "../index.less";
import zhCN from 'antd/lib/locale-provider/zh_CN';
import {Button, Col, Input, Row, Table, Select, notification, ConfigProvider, Modal} from "antd";
import InGoodsAPI from "../../components/api/InGoodsAPI";
import InGoodsEditModal from "../../components/inGoods/InGoodsEditModal";

const Option = Select.Option;
const confirm = Modal.confirm;

class InGoodsManage extends Component {
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
            inGoodsId: undefined,
            goodsId: undefined,
            name: undefined,
            inGoodsPage: {}
        };
    }

    handleChannelCodeChange = (value) => {
        this.setState({channelCode: value});
    };

    handleNameChange = (e) => {
        this.setState({name : e.target.value});
    };

    handleGoodsIdChange = (e) => {
        this.setState({goodsId : e.target.value});
    };

    handleInGoodsIdChange = (e) => {
      this.setState({inGoodsId : e.target.value});
    };

    refresh = () => {
        this.handleSearch(this.state.page);
    };

    handleSearch = (page) => {
      InGoodsAPI.findByPage({
            inGoodsId : this.state.inGoodsId,
            goodsId : this.state.goodsId,
            name : this.state.name,
            channelCode : this.state.channelCode,
            pageNo: page,
            pageSize : 10
        }).then((res) => {
            if (res.data.success) {
                this.setState({
                    inGoodsPage : res.data.data,
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
              InGoodsAPI.deleteById({id : id}).then((res) => {
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
        let inGoodsPage = this.state.inGoodsPage;

        let columns = [
            { title : "ID", key : "id", dataIndex : "id", width: "50px"},
            { title : "商品名", key : "goodsName", dataIndex : "goodsName", width: "150px"},
            { title : "渠道单号", key : "channelOrderNo", dataIndex : "channelOrderNo", width: "150px"},
            { title : "渠道", key : "channelName", dataIndex : "channelName", width: "150px"},
            { title : "状态", key : "inGoodsStatusName", dataIndex : "inGoodsStatusName", width: "100px"},
            { title : "数量", key : "num", dataIndex : "num", width: "100px"},
            { title : "操作", key : "operate", dataIndex : "", width: "100px",
                render : (text, record) => {
                    return (
                        <div>
                            <div>
                                <InGoodsEditModal type="edit" item={record} key={record.id} channelList={channelList}
                                                  refresh={this.refresh.bind(this)} />
                                &nbsp;&nbsp;|&nbsp;&nbsp;
                                <a onClick={() => {this.handleDelete(record.id)}}>删除</a>
                            </div>
                        </div>)
                }
            }
        ];

        let pagination = {
            total : inGoodsPage.totalNumber,
            current : inGoodsPage.currentIndex,
            pageSize : inGoodsPage.pageSize,
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
                            <span style={{fontSize:20, fontWeight:"bold", color:"black"}}>入库管理</span>
                        </Col>
                    </Row>
                    <Row style={{paddingTop: 24}}>
                        <Col span={20}>
                            <Input style={{width: 200, marginRight: 10}} placeholder="请输入入库id" allowClear
                                   value={this.state.inGoodsId} onChange={this.handleInGoodsIdChange}/>
                            <Input style={{width: 200, marginRight: 10}} placeholder="请输入商品id" allowClear
                                   value={this.state.goodsId} onChange={this.handleGoodsIdChange}/>
                            <Input style={{width: 200, marginRight: 10}} placeholder="请输入商品名称" allowClear
                                   value={this.state.name} onChange={this.handleNameChange}/>
                            <Select style={{width : 200, marginRight : 10}}  value={this.state.channelCode} allowClear={true}
                                  onChange = {this.handleChannelCodeChange} placeholder="请选择渠道">
                              {channelList}
                            </Select>
                            <Button type="primary" style={{marginRight: 10}} onClick={() => {this.handleSearch(1)}}>搜索</Button>
                        </Col>
                        <Col span={4} style={{textAlign: "right"}}>
                            <InGoodsEditModal type="add"
                                            item={undefined}
                                            key={0}
                                            channelList={channelList}
                                            refresh={this.refresh.bind(this)} />
                        </Col>
                    </Row>
                    <Row style={{paddingTop: 16}}>
                      <Col span={24}>
                        <Table columns={columns} dataSource={inGoodsPage.items} pagination={pagination}
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
