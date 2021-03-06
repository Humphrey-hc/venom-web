import axios from 'axios';
import queryString from 'qs';

const CustomerAPI = {

    saveOrUpdateCustomer : (param) => {
        return axios.post(
            `${SERVER_URL}/customer/saveOrUpdateCustomer`,
            param
        )
    },

    getById : (param) => {
        return axios.post(
            `${SERVER_URL}/api/ConsultationManageAPI/getById.json`,
            queryString.stringify(param),
        )
    },

    deleteCustomer : (param) => {
        return axios.delete(`${SERVER_URL}/customer/deleteCustomer/${param}`)
    },

    findByPage : (param) => {
        return axios.post(
            `${SERVER_URL}/customer/getCustomerByPage`,
            queryString.stringify(param),
        )
    },

    getCustomerList : (param) => {
      return axios.get(`${SERVER_URL}/customer/getCustomerList`)
    },

    getCustomerListLikeName : (param) => {
      return axios.get(`${SERVER_URL}/customer/getCustomerListLikeName/${param}`)
    },

    getProvince : () => {
      return axios.get(`${SERVER_URL}/area/getProvince`)
    },

    getCitiesByProvinceCode : (param) => {
      return axios.get(`${SERVER_URL}/area/getCitiesByProvinceCode/${param}`)
    },

    getDistrictsByCityCode : (param) => {
      return axios.get(`${SERVER_URL}/area/getDistrictsByCityCode/${param}`)
    },

    updateCustomerFollowStatus : (param) => {
      return axios.post(
        `${SERVER_URL}/customer/updateCustomerFollowStatus`,
        queryString.stringify(param),
      )
    },

};

export default CustomerAPI;
