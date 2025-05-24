import axios from 'axios';

const axiosPublic = axios.create({


 baseURL: "http://localhost:8088/api/v1",

});

export default axiosPublic;
