import axios from 'axios';

export default axios.create({
    //baseURL: 'http://10.0.0.3:3000/'
    //baseURL: 'http://localhost:4000/'
    //baseURL: 'http://172.20.10.6:4000/'
    baseURL: 'http://localhost:4000/'
})