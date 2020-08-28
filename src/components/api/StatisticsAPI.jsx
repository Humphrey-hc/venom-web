import axios from 'axios';
import queryString from 'qs';

const StatisticsAPI = {

    getDashboardStatistics : (param) => {
      return axios.get(`${SERVER_URL}/statistics/getDashboardStatistics`)
    },

    getThisMonthStatistics : (param) => {
      return axios.get(`${SERVER_URL}/statistics/getThisMonthStatistics`)
    },

};

export default StatisticsAPI;
