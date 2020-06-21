import axios from 'axios';
import queryString from 'qs';

const OutGoodsAPI = {

    saveOrUpdateOutGoods : (param) => {
        return axios.post(
            `${SERVER_URL}/outGoods/saveOrUpdateOutGoods`,
            param
        )
    },

    getById : (param) => {
        return axios.post(
            `${SERVER_URL}/api/ConsultationManageAPI/getById.json`,
            queryString.stringify(param),
        )
    },

    deleteOutGoods : (param) => {
        return axios.delete(`${SERVER_URL}/outGoods/deleteOutGoods/${param}`,
        )
    },

    updateOutGoodsStatus : (param) => {
      return axios.post(
        `${SERVER_URL}/outGoods/updateOutGoodsStatus`,
        queryString.stringify(param),
      )
    },

    updateOutGoodsRemark : (param) => {
      return axios.post(
        `${SERVER_URL}/outGoods/updateOutGoodsRemark`,
        queryString.stringify(param),
      )
    },

    getOutGoodsByPage : (param) => {
        return axios.post(
            `${SERVER_URL}/outGoods/getOutGoodsByPage`,
            queryString.stringify(param),
        )
    },

    calculatePostage : (param) => {
      return axios.post(
        `${SERVER_URL}/outGoods/calculatePostage`,
        queryString.stringify(param),
      )
    },


};

export default OutGoodsAPI;
