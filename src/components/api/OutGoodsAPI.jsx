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

    getOutGoodsByPage : (param) => {
        return axios.post(
            `${SERVER_URL}/outGoods/getOutGoodsByPage`,
            queryString.stringify(param),
        )
    },
};

export default OutGoodsAPI;
