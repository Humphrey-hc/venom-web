import React, {Component} from "react";
import "../index.less";
import zhCN from 'antd/lib/locale-provider/zh_CN';
import {Statistic, Card, Icon, Col, Row, Table, Select, notification, ConfigProvider, Modal, Form} from "antd";
import StatisticsAPI from "../../components/api/StatisticsAPI";
import locale from 'antd/es/date-picker/locale/zh_CN';
import moment from 'moment';
import {dateFormat} from '../../components/CommonFunction'

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
                    <Row gutter={16}>
                        <Col span={8}>
                          <Card bordered={false}>
                            <Statistic
                              title="今日单数"
                              value={this.state.statisticsData.todayOrderNum}
                              precision={0}
                            />
                          </Card>
                        </Col>
                        <Col span={8}>
                          <Card bordered={false}>
                            <Statistic
                              title="今日销售"
                              value={this.state.statisticsData.todaySalesVolume}
                              precision={2}
                              prefix={"￥"}
                            />
                          </Card>
                        </Col>
                        <Col span={8} bordered={false}>
                          <Card>
                            <Statistic
                              title="今日收入"
                              value={this.state.statisticsData.todayProfit}
                              precision={2}
                              prefix={"￥"}
                            />
                          </Card>
                      </Col>
                    </Row>
                  <Row gutter={16} style={{paddingTop:20}}>
                    <Col span={8}>
                      <Card bordered={false}>
                        <Statistic
                          title="昨日单数"
                          value={this.state.statisticsData.yesterdayOrderNum}
                          precision={0}
                        />
                      </Card>
                    </Col>
                    <Col span={8}>
                      <Card bordered={false}>
                        <Statistic
                          title="昨日销售"
                          value={this.state.statisticsData.yesterdaySalesVolume}
                          precision={2}
                          prefix={"￥"}
                        />
                      </Card>
                    </Col>
                    <Col span={8}>
                      <Card bordered={false}>
                        <Statistic
                          title="昨日收入"
                          value={this.state.statisticsData.yesterdayProfit}
                          precision={2}
                          prefix={"￥"}
                        />
                      </Card>
                    </Col>
                  </Row>
                  <Row gutter={16} style={{paddingTop:20}}>
                    <Col span={8}>
                      <Card bordered={false}>
                        <Statistic
                          title="当月单数"
                          value={11}
                          precision={0}
                        />
                      </Card>
                    </Col>
                    <Col span={8}>
                      <Card bordered={false}>
                        <Statistic
                          title="当月销售"
                          value={9.3}
                          precision={2}
                          prefix={"￥"}
                        />
                      </Card>
                    </Col>
                    <Col span={8}>
                      <Card bordered={false}>
                        <Statistic
                          title="当月收入"
                          value={9.3}
                          precision={2}
                          prefix={"￥"}
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
