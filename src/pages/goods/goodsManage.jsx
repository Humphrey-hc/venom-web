import React, {Component} from "react";
import "../index.less";
import zhCN from 'antd/lib/locale-provider/zh_CN';
import {Button, Col, Input, Row, Table, Select, notification, ConfigProvider, Modal} from "antd";
import GoodsAPI from "../../components/api/GoodsAPI";
import GoodsEditModal from "../../components/goods/GoodsEditModal";

const Option = Select.Option;
const confirm = Modal.confirm;

class GoodsManage extends Component {
    constructor(props) {
      super(props);
        this.state = {
            page: 1,
            channelList:[],
            channelCode: undefined,
            id: undefined,
            name: undefined,
            goodsPage: {}
        };
    }

    handleChannelCodeChange = (value) => {
        this.setState({channelCode: value});
    };

    handleNameChange = (e) => {
        this.setState({name : e.target.value});
    };

    handleIdChange = (e) => {
        this.setState({id : e.target.value});
    };

    refresh = () => {
        this.handleSearch(this.state.page);
    };

    handleSearch = (page) => {
      GoodsAPI.findByPage({
            id : this.state.id,
            name : this.state.name,
            channelCode : this.state.channelCode,
            pageNo: page,
            pageSize : 10
        }).then((res) => {
            if (res.data.success) {
                this.setState({
                    goodsPage : res.data.data,
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
              GoodsAPI.deleteById({id : id}).then((res) => {
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
        let goodsPage = this.state.goodsPage;

        let columns = [
            { title : "ID", key : "id", dataIndex : "id", width: "50px"},
            { title : "商品名", key : "goodsName", dataIndex : "goodsName", width: "150px"},
            { title : "渠道", key : "channelName", dataIndex : "channelName", width: "150px"},
            { title : "库存", key : "stockNum", dataIndex : "stockNum", width: "100px"},
            { title : "重量", key : "weight", dataIndex : "weight", width: "100px"},
            { title : "成本", key : "buyingPrice", dataIndex : "buyingPrice", width: "200px"},
            { title : "指导售价", key : "guideSellingPrice", dataIndex : "guideSellingPrice", width: "200px"},
            { title : "预估利润", key : "predictProfit", dataIndex : "predictProfit", width: "200px"},
            { title : "一区邮费", key : "postageOne", dataIndex : "postageOne", width: "200px"},
            { title : "二区邮费", key : "postageTow", dataIndex : "postageTow", width: "200px"},
            { title : "三区邮费", key : "predictProfit", dataIndex : "predictProfit", width: "200px"},
            { title : "操作", key : "operate", dataIndex : "", width: "100px",
                render : (text, record) => {
                    return (
                        <div>
                            <div>
                                <GoodsEditModal type="edit" item={record} key={record.id} channelList={channelList}
                                                  refresh={this.refresh.bind(this)} />
                                &nbsp;&nbsp;|&nbsp;&nbsp;
                                <a onClick={() => {this.handleDelete(record.id)}}>删除</a>
                            </div>
                        </div>)
                }
            }
        ];

        let pagination = {
            total : goodsPage.totalNumber,
            current : goodsPage.currentIndex,
            pageSize : goodsPage.pageSize,
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
                            <span style={{fontSize:20, fontWeight:"bold", color:"black"}}>商品管理</span>
                        </Col>
                    </Row>
                    <Row style={{paddingTop: 24}}>
                        <Col span={15}>
                            <Input style={{width: 200, marginRight: 10}} placeholder="请输入商品id" allowClear
                                   value={this.state.id} onChange={this.handleIdChange}/>
                            <Input style={{width: 200, marginRight: 10}} placeholder="请输入商品名称" allowClear
                                   value={this.state.name} onChange={this.handleNameChange}/>
                            <Select style={{width : 200, marginRight : 10}}  value={this.state.channelCode} allowClear={true}
                                  onChange = {this.handleChannelCodeChange} placeholder="请选择渠道">
                              {channelList}
                            </Select>
                            <Button type="primary" style={{marginRight: 10}} onClick={() => {this.handleSearch(1)}}>搜索</Button>
                        </Col>
                        <Col span={9} style={{textAlign: "right"}}>
                            <GoodsEditModal type="add"
                                            item={undefined}
                                            key={0}
                                            channelList={channelList}
                                            refresh={this.refresh.bind(this)} />
                        </Col>
                    </Row>
                    <Row style={{paddingTop: 16}}>
                      <Col span={24}>
                        <Table columns={columns} dataSource={goodsPage.items} pagination={pagination}
                               rowKey={record => record.id} bordered
                        />
                      </Col>
                    </Row>
                </ConfigProvider>
            </div>
        )
    }
}

export default GoodsManage;
