import React, { Component, useState, useEffect } from 'react';
import styles from '../index.less';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { Statistic, Card, Col, Row, Divider, ConfigProvider } from 'antd';
import StatisticsAPI from '../../components/api/StatisticsAPI';
import { Pie, DualLine } from '@ant-design/charts';
const { Meta } = Card;

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      statisticsData: {},
      data1: [],
      data2: [],
      customerData: [],
      goodsRankData: [],
      buyerProvinceRankData: [],
    };
  }

  componentDidMount() {
    StatisticsAPI.getThisMonthStatistics().then(res => {
      if (res.data.success) {
        console.log('data', res.data.data);
        this.setState({
          data1: res.data.data,
          data2: res.data.data,
        });
      }
    });
    StatisticsAPI.getDashboardStatistics().then(res => {
      if (res.data.success) {
        this.setState({
          statisticsData: res.data.data,
        });
      }
    });
    StatisticsAPI.getCustomerFollowData().then(res => {
      if (res.data.success) {
        this.setState({
          customerData: res.data.data,
        });
      }
    });
    StatisticsAPI.getGoodsTopRank().then(res => {
      if (res.data.success) {
        this.setState({
          goodsRankData: res.data.data,
        });
      }
    });
    StatisticsAPI.getBuyerProvinceTopRank().then(res => {
      if (res.data.success) {
        this.setState({
          buyerProvinceRankData: res.data.data,
        });
      }
    });
  }

  render() {
    let data1 = this.state.data1;
    let data2 = this.state.data2;
    let customerData = this.state.customerData;
    let goodsRankData = this.state.goodsRankData;
    let buyerProvinceRankData = this.state.buyerProvinceRankData;

    return (
      <div>
        <ConfigProvider locale={zhCN}>
          <Row gutter={24}>
            <Col span={8} style={{ paddingLeft: 20 }}>
              <Card bordered={false} style={{ width: '100%' }}>
                <Meta
                  title={
                    <span>
                      <Statistic
                        title="今日单数"
                        value={this.state.statisticsData.todayOrderNum}
                        precision={0}
                      />
                      <Divider style={{ margin: '16px 0' }} />
                    </span>
                  }
                  description={`昨日单数： ${this.state.statisticsData.yesterdayOrderNum}`}
                />
              </Card>
            </Col>
            <Col span={8} style={{ paddingLeft: 20 }}>
              <Card bordered={false} style={{ width: '100%' }}>
                <Meta
                  title={
                    <span>
                      <Statistic
                        title="今日销售额"
                        value={this.state.statisticsData.todaySalesVolume}
                        precision={2}
                        prefix={'￥'}
                      />
                      <Divider style={{ margin: '16px 0' }} />
                    </span>
                  }
                  description={`昨日销售额：￥ ${this.state.statisticsData.yesterdaySalesVolume}`}
                />
              </Card>
            </Col>
            <Col span={8} style={{ paddingLeft: 20 }}>
              <Card bordered={false} style={{ width: '100%' }}>
                <Meta
                  title={
                    <span>
                      <Statistic
                        title="今日收益"
                        value={this.state.statisticsData.todayProfit}
                        precision={2}
                        prefix={'￥'}
                      />
                      <Divider style={{ margin: '16px 0' }} />
                    </span>
                  }
                  description={`昨日收益：￥ ${this.state.statisticsData.yesterdayProfit}`}
                />
              </Card>
            </Col>
          </Row>
          <Row gutter={24} style={{ paddingTop: 20 }}>
            <Col span={8} style={{ paddingLeft: 20 }}>
              <Card bordered={false} style={{ width: '100%' }}>
                <Meta
                  title={
                    <span>
                      <Statistic
                        title="本月总单数"
                        value={this.state.statisticsData.orderNumInThisMonth}
                        precision={0}
                      />
                      <Divider style={{ margin: '16px 0' }} />
                    </span>
                  }
                  description={`上月总单数： ${this.state.statisticsData.orderNumInLastMonth}`}
                />
              </Card>
            </Col>
            <Col span={8} style={{ paddingLeft: 20 }}>
              <Card bordered={false} style={{ width: '100%' }}>
                <Meta
                  title={
                    <span>
                      <Statistic
                        title="本周收益"
                        value={this.state.statisticsData.profitInThisWeek}
                        precision={2}
                        prefix={'￥'}
                      />
                      <Divider style={{ margin: '16px 0' }} />
                    </span>
                  }
                  description={`本周销售额：￥ ${this.state.statisticsData.salesVolumeInThisWeek}`}
                />
              </Card>
            </Col>
            <Col span={8} style={{ paddingLeft: 20 }}>
              <Card bordered={false} style={{ width: '100%' }}>
                <Meta
                  title={
                    <span>
                      <Statistic
                        title="本月收益"
                        value={this.state.statisticsData.profitInThisMonth}
                        precision={2}
                        prefix={'￥'}
                      />
                      <Divider style={{ margin: '16px 0' }} />
                    </span>
                  }
                  description={`本月销售额：￥ ${this.state.statisticsData.salesVolumeInThisMonth}`}
                />
              </Card>
            </Col>
          </Row>
          <Row style={{ paddingTop: 20, paddingLeft: 10 }}>
            <Col span={24}>
              <Card bordered={false}>
                <Row>
                  <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                    <DualLine
                      title={{ visible: true, text: '当月每日收益趋势' }}
                      data={[data1, data2]}
                      xField={'dateStr'}
                      yField={['totalProfit', 'totalOrderNum']}
                    />
                  </Col>
                  <Col xl={8} lg={12} md={12} sm={24} xs={24}>
                    <Card bordered={false}>
                      <h3 className={styles.rankingTitle}>商品销量排名</h3>
                      <ul className={styles.rankingList}>
                        {goodsRankData.map((item, i) => (
                          <li key={item.name}>
                            <span
                              className={`${styles.rankingItemNumber} ${
                                i < 3 ? styles.active : ''
                              }`}
                            >
                              {i + 1}
                            </span>
                            <span
                              className={styles.rankingItemTitle}
                              title={item.name}
                            >
                              {item.name}
                            </span>
                            <span className={styles.rankingItemValue}>
                              {item.num}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </Card>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
          <Row style={{ paddingTop: 20, paddingLeft: 10 }}>
            <Col span={24}>
              <Card bordered={false}>
                <Row>
                  <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                    <Pie
                      appendPadding={10}
                      title={{ visible: true, text: '用户跟进情况' }}
                      radius={0.8}
                      innerRadius={0.55}
                      angleField="value"
                      colorField="type"
                      label={{
                        type: 'inner',
                        content: '{value}',
                        autoRotate: false,
                        offset: -35,
                        style: {
                          fill: '#333',
                          stroke: '#fff',
                          strokeWidth: 1,
                        },
                      }}
                      statistic={{
                        visible: true,
                        totalLabel: 'ahahaak',
                      }}
                      interactions={{ type: 'pie-statistic-active' }}
                      data={customerData}
                    />
                  </Col>
                  <Col xl={8} lg={12} md={12} sm={24} xs={24}>
                    <Card bordered={false}>
                      <h3 className={styles.rankingTitle}>用户购买省份排名</h3>
                      <ul className={styles.rankingList}>
                        {buyerProvinceRankData.map((item, i) => (
                          <li key={item.name}>
                            <span
                              className={`${styles.rankingItemNumber} ${
                                i < 3 ? styles.active : ''
                              }`}
                            >
                              {i + 1}
                            </span>
                            <span
                              className={styles.rankingItemTitle}
                              title={item.name}
                            >
                              {item.name}
                            </span>
                            <span className={styles.rankingItemValue}>
                              {item.num}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </Card>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </ConfigProvider>
      </div>
    );
  }
}

export default Dashboard;
