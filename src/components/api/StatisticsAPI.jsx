import axios from 'axios';
import queryString from 'qs';

const StatisticsAPI = {

    getDashboardStatistics : (param) => {
      return axios.get(`${SERVER_URL}/statistics/getDashboardStatistics`)
    },

};

export default StatisticsAPI;
