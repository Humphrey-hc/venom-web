import React, {Component, useState, useEffect} from "react";
import "../index.less";
import zhCN from 'antd/lib/locale-provider/zh_CN';
import {Statistic, Card, Icon, Col, Row, Divider, Select, notification, ConfigProvider, Modal, Form} from "antd";
import StatisticsAPI from "../../components/api/StatisticsAPI";
import locale from 'antd/es/date-picker/locale/zh_CN';
import moment from 'moment';
import {dateFormat} from '../../components/CommonFunction'
import { Line, DualLine } from '@ant-design/charts';
const { Meta } = Card;

const data1 = [
  {month: '一月', value: 1},
  {month: '二月', value: 4},
  {month: '三月', value: 3.5},
  {month: '四月', value: 3},
  {month: '五月', value: 4.9},
  {month: '六月', value: 6},
  {month: '七月', value: 5},
  {month: '八月', value: 9},
  {month: '九月', value: 13},
  {month: '十月', value: 12},
  {month: '十一月', value: 13},
  {month: '十二月', value: 13},
];

const data2 = [
  {month: '一月', value2: 3},
  {month: '二月', value2: 4},
  {month: '三月', value2: 3.5},
  {month: '四月', value2: 5},
  {month: '五月', value2: 4.9},
  {month: '六月', value2: 6},
  {month: '七月', value2: 7},
  {month: '八月', value2: 9},
  {month: '九月', value2: 13},
  {month: '十月', value2: 12},
  {month: '十一月', value2: 8},
  {month: '十二月', value2: 13},
];

class Dashboard extends Component {
    constructor(props) {
      super(props);
        this.state = {
          statisticsData: {}
        };
    }

    componentDidMount() {
      StatisticsAPI.getDashboardStatistics().then((res) => {
        if (res.data.success) {
          this.setState({
            statisticsData : res.data.data
          });
        }
      });
    }


    render() {

        return (
            <div>
                <ConfigProvider locale={zhCN}>
                    <Row gutter={18}>
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
                          <DualLine title={{visible: true, text: '月利润趋势'}}
                                label={{visible:true, type:'point'}}
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
                                forceFit={true}
                                data={[data1,data2]}
                                xField={'month'}
                                yField={['value','value2']}
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
