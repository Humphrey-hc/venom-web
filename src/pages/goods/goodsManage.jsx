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
            channelList:[
              {"channelCode":1, "channelName":"严选内购"},
              {"channelCode":2, "channelName":"大萌严选"},
              {"channelCode":3, "channelName":"其他"},
            ],
            channelCode: undefined,
            goodsId: undefined,
            goodsName: undefined,
            goodsPage: {}
        };
    }

    componentDidMount() {
      this.handleSearch(this.state.page);
    }

    handleChannelCodeChange = (value) => {
        this.setState({channelCode: value});
    };

    handleGoodsNameChange = (e) => {
        this.setState({goodsName : e.target.value});
    };

    handleGoodsIdChange = (e) => {
        this.setState({goodsId : e.target.value});
    };

    refresh = () => {
        this.handleSearch(this.state.page);
    };

    handleSearch = (page) => {
      GoodsAPI.getGoodsByPage({
            goodsId : this.state.goodsId,
            goodsName : this.state.goodsName,
            channelCode : this.state.channelCode,
            pageNum: page,
            pageSize : 10
        }).then((res) => {
            if (res.data.success) {
                this.setState({
                    goodsPage : res.data.data,
                    page : res.data.data.current,
                });
            }
        });
    };

    handleDelete = (id) => {
        confirm({
            title: '删除商品',
            content: <div><p>是否确认删除?</p></div>,
            onOk : () => {
              GoodsAPI.deleteGoods(id).then((res) => {
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
            return (<Option value={channel.channelCode} key={channel.channelCode}>{channel.channelName}</Option>)
        });
        let goodsPage = this.state.goodsPage;

        let columns = [
            { title : "ID", key : "id", dataIndex : "id", width: "50px"},
            { title : "商品名", key : "goodsName", dataIndex : "goodsName", width: "250px"},
            { title : "渠道", key : "channelName", dataIndex : "channelName", width: "200px"},
            { title : "库存", key : "stockNum", dataIndex : "stockNum", width: "80px", align:"center"},
            { title : "重量", key : "weight", dataIndex : "weight", width: "80px", align:"center"},
            { title : "成本", key : "buyingPrice", dataIndex : "buyingPrice", width: "120px"},
            { title : "指导售价", key : "guideSellingPrice", dataIndex : "guideSellingPrice", width: "120px"},
            { title : "预估利润", key : "predictProfit", dataIndex : "predictProfit", width: "120px"},
            { title : "一区邮费", key : "postageOne", dataIndex : "postageOne", width: "120px"},
            { title : "二区邮费", key : "postageTow", dataIndex : "postageTow", width: "120px"},
            { title : "三区邮费", key : "postageThree", dataIndex : "postageThree", width: "120px"},
            { title : "操作", key : "operate", dataIndex : "", width: "150px",
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
            total : goodsPage.total,
            current : goodsPage.current,
            pageSize : goodsPage.size,
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
                                   value={this.state.goodsId} onChange={this.handleGoodsIdChange}/>
                            <Input style={{width: 200, marginRight: 10}} placeholder="请输入商品名称" allowClear
                                   value={this.state.goodsName} onChange={this.handleGoodsNameChange}/>
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
                        <Table columns={columns} dataSource={goodsPage.records} pagination={pagination}
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
