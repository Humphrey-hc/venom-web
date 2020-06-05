import axios from 'axios';
import queryString from 'qs';

const InGoodsAPI = {

    saveOrUpdateInGoods : (param) => {
      return axios.post(
        `${SERVER_URL}/inGoods/saveOrUpdateInGoods`,
        param
      )
    },

    deleteInGoods : (param) => {
      return axios.delete(`${SERVER_URL}/inGoods/deleteInGoods/${param}`)
    },

    getInGoodsByPage : (param) => {
      return axios.post(
        `${SERVER_URL}/inGoods/getInGoodsByPage`,
        queryString.stringify(param),
      )
    },

    getGoodsList : (param) => {
      return axios.get(`${SERVER_URL}/goods/getGoodsList`)
    },

};

export default InGoodsAPI;
