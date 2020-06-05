import axios from 'axios';
import queryString from 'qs';

const GoodsAPI = {

    saveOrUpdateGoods : (param) => {
        return axios.post(
            `${SERVER_URL}/goods/saveOrUpdateGoods`,
            param
        )
    },

    deleteGoods : (param) => {
        return axios.delete(`${SERVER_URL}/goods/deleteGoods/${param}`)
    },

    deleteById : (param) => {
        return axios.post(
            `${SERVER_URL}/api/ConsultationManageAPI/deleteById.json`,
            queryString.stringify(param),
        )
    },

    getGoodsByPage : (param) => {
        return axios.post(
            `${SERVER_URL}/goods/getGoodsByPage`,
            queryString.stringify(param),
        )
    },

    getGoodsList : (param) => {
        return axios.get(`${SERVER_URL}/goods/getGoodsList`)
    },

};

export default GoodsAPI;
