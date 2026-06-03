import axios from 'axios';
import CryptoJS from 'crypto-js';

const generateSignature = (appId: string, timestamp: string, secret: string) => {
  const data = appId + "&" + timestamp + secret;
  return CryptoJS.MD5(data).toString().toLowerCase();
};

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const appId = config.public.appId || 'WHIBp2TTO8H5ZsZY';
  const appSecret = config.public.appSecret || '3un1ci5w5isDOai8izAlbMGmS4nxqzAY';
  const timestamp = Math.floor(Date.now() / 1000).toString();

  const api = axios.create({
    baseURL: 'https://yunyi.oneyibiao.com/api/v1',
    headers: {
      'x-auth-appid': appId,
      'x-auth-timestamp': timestamp,
      'x-auth-sign': generateSignature(appId, timestamp, appSecret)
    }
  });

  try {
    const res = await api.get('/data/getlist', {
      params: {
        deviceType: 'znwg',
        code: '61052604062000',
        page: 1,
        pageSize: 5
      }
    });
    
    return res.data;
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.response?.data || error.message
    });
  }
})
