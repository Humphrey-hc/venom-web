import axios from 'axios';
import queryString from 'qs';

const InGoodsAPI = {

    saveOrUpdate : (param) => {
        return axios.post(
            `${SERVER_URL}/api/ConsultationManageAPI/saveOrUpdate.json`,
            param
        )
    },

    getById : (param) => {
        return axios.post(
            `${SERVER_URL}/api/ConsultationManageAPI/getById.json`,
            queryString.stringify(param),
        )
    },

    deleteById : (param) => {
        return axios.post(
            `${SERVER_URL}/api/ConsultationManageAPI/deleteById.json`,
            queryString.stringify(param),
        )
    },

    findByPage : (param) => {
        return axios.post(
            `${SERVER_URL}/api/ConsultationManageAPI/findByPage.json`,
            queryString.stringify(param),
        )
    },

    getAllBizType : (param) => {
        return axios.post(
            `${SERVER_URL}/api/ConsultationManageAPI/getAllBizType.json`,
            queryString.stringify(param),
        )
    },

};

export default InGoodsAPI;
