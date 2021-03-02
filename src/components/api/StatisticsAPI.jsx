import axios from 'axios';
import queryString from 'qs';

const StatisticsAPI = {
  getDashboardStatistics: param => {
    return axios.get(`${SERVER_URL}/statistics/getDashboardStatistics`);
  },

  getThisMonthStatistics: param => {
    return axios.get(`${SERVER_URL}/statistics/getThisMonthStatistics`);
  },

  getCustomerFollowData: param => {
    return axios.get(`${SERVER_URL}/statistics/getCustomerFollowData`);
  },

  getGoodsTopRank: param => {
    return axios.get(`${SERVER_URL}/statistics/getGoodsTopRank`);
  },

  getBuyerProvinceTopRank: param => {
    return axios.get(`${SERVER_URL}/statistics/getBuyerProvinceTopRank`);
  },
};

export default StatisticsAPI;
