import MD5 from 'crypto-js/md5'

export const generateSignature = (appId: string, timestamp: string, secret: string): string => {
  const data = appId + "&" + timestamp + secret;
  return MD5(data).toString().toLowerCase();
}
