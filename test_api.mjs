import axios from 'axios';
import CryptoJS from 'crypto-js';

const generateSignature = (appId, timestamp, secret) => {
  const data = appId + "&" + timestamp + secret;
  return CryptoJS.MD5(data).toString().toLowerCase();
};

const appId = 'WHIBp2TTO8H5ZsZY';
const appSecret = '3un1ci5w5isDOai8izAlbMGmS4nxqzAY';
const timestamp = Math.floor(Date.now() / 1000).toString();

const api = axios.create({
  baseURL: 'https://yunyi.oneyibiao.com/api/v1',
  headers: {
    'x-auth-appid': appId,
    'x-auth-timestamp': timestamp,
    'x-auth-sign': generateSignature(appId, timestamp, appSecret)
  }
});

async function test() {
  try {
    const res = await api.get('/data/getlist', {
      params: {
        deviceType: 'znwg',
        code: '61052604062000',
        page: 1,
        pageSize: 5
      }
    });
    console.log(JSON.stringify(res.data, null, 2));
  } catch (err) {
    console.error(err.response?.data || err.message);
  }
}

test();
