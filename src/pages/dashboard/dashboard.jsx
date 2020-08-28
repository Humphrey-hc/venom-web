import React, {Component, useState, useEffect} from "react";
import "../index.less";
import zhCN from 'antd/lib/locale-provider/zh_CN';
import {Statistic, Card, Icon, Col, Row, Divider, Select, notification, ConfigProvider, Modal, Form} from "antd";
import StatisticsAPI from "../../components/api/StatisticsAPI";
import locale from 'antd/es/date-picker/locale/zh_CN';
import moment from 'moment';
import {dateFormat} from '../../components/CommonFunction'
import { Line, DualLine, ColumnLine } from '@ant-design/charts';
const { Meta } = Card;

class Dashboard extends Component {
    constructor(props) {
      super(props);
        this.state = {
          statisticsData: {},
          data1:[],
          data2:[],
        };
    }

    componentDidMount() {
      StatisticsAPI.getThisMonthStatistics().then((res) => {
        if (res.data.success) {
          console.log("data", res.data.data);
          this.setState({
            data1 : res.data.data,
            data2 : res.data.data
          });
        }
      });
      StatisticsAPI.getDashboardStatistics().then((res) => {
        if (res.data.success) {
          this.setState({
            statisticsData : res.data.data
          });
        }
      });
    }


    render() {

        let data1 = this.state.data1;
        let data2 = this.state.data2;

        console.log("data1", data1);

        return (
            <div>
                <ConfigProvider locale={zhCN}>
                    <Row gutter={24}>
                        <Col span={8} style={{paddingLeft:20}}>
                          <Card bordered={false} style={{ width: 350}}>
                            <Meta
                              title={
                                <span>
                                  <Statistic
                                    title="今日单数"
                                    value={this.state.statisticsData.todayOrderNum}
                                    precision={0}
                                  />
                                  <Divider style={{margin: "16px 0"}}/>
                                </span>
                              }
                              description={
                                `昨日单数： ${this.state.statisticsData.yesterdayOrderNum}`
                              }
                            />
                          </Card>
                        </Col>
                        <Col span={8} style={{paddingLeft:20}}>
                          <Card bordered={false}  style={{ width: 350}}>
                            <Meta
                              title={
                                <span>
                                  <Statistic
                                    title="今日销售"
                                    value={this.state.statisticsData.todaySalesVolume}
                                    precision={2}
                                    prefix={"￥"}
                                  />
                                  <Divider style={{margin: "16px 0"}}/>
                                </span>
                              }
                              description={
                                `昨日销售：￥ ${this.state.statisticsData.yesterdaySalesVolume}`
                              }
                            />
                          </Card>
                        </Col>
                        <Col span={8} style={{paddingLeft:20}}>
                          <Card bordered={false} style={{ width: 350}}>
                            <Meta
                              title={
                                <span>
                                  <Statistic
                                    title="今日收入"
                                    value={this.state.statisticsData.todayProfit}
                                    precision={2}
                                    prefix={"￥"}
                                  />
                                  <Divider style={{margin: "16px 0"}}/>
                                </span>
                              }
                              description={
                                `昨日收入：￥ ${this.state.statisticsData.yesterdayProfit}`
                              }
                            />
                          </Card>
                      </Col>
                    </Row>
                    <Row style={{paddingTop:20, paddingLeft:10, paddingRight:20}}>
                      <Col span={24}>
                        <Card bordered={false} >
                          <DualLine title={{visible: true, text: '当月每日利润趋势'}}
                                    forceFit={true}
                                    data={[data1,data2]}
                                    xField={'dateStr'}
                                    point={{
                                      visible:true,
                                      size:5,
                                      shape:'diamond',
                                      style: {
                                        fill:'white',
                                        stroke:'#2593fc',
                                        lineWidth:2
                                      }
                                    }}
                                    yField={['totalProfit','totalOrderNum']}
                          />
                        </Card>
                      </Col>
                    </Row>
                </ConfigProvider>
            </div>
        )
    }
}

export default Dashboard;
