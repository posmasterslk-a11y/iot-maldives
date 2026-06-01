import crypto from 'crypto';

const appId = 'WHIBp2TTO8H5ZsZY';
const appSecret = '3un1ci5w5isDOai8izAlbMGmS4nxqzAY';
const timestamp = Math.floor(Date.now() / 1000).toString();

const data = appId + '&' + timestamp + appSecret;
const signature = crypto.createHash('md5').update(data).digest('hex');

const url = `https://yunyi.oneyibiao.com/api/v1/data/getlist?deviceType=znwg&code=61052604062000&page=1&pageSize=5`;

async function test() {
  try {
    const res = await fetch(url, {
      headers: {
        'x-auth-appid': appId,
        'x-auth-timestamp': timestamp,
        'x-auth-sign': signature
      }
    });
    const json = await res.json();
    console.log(JSON.stringify(json, null, 2));
  } catch (e) {
    console.error(e);
  }
}
test();
