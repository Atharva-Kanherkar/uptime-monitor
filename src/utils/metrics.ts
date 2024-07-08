 // src/utils/metrics.ts
import axios from 'axios';
 import ping from 'ping'; // For measuring ping time

const getResponseTime = async (url: string) => {
  const start = Date.now();
  await axios.get(url);
  const end = Date.now();
  return end - start;
};

const checkWebsiteStatus = async (url: string) => {
  try {
    const response = await axios.get(url);
    return response.status === 200 ? 'Up' : 'Down';
  } catch {
    return 'Down';
  }
};

const getPingTime = async (url: string) => {
  const response = await ping.promise.probe(url.replace(/^https?:\/\//, ''));
  if(response.time == null || response.time == 'unknown'){
    return 0;
  }
  else{
  return response.time;
  }
};

export const getMetrics = async (url: string) => {
  const status = await checkWebsiteStatus(url);
  const responseTime = await getResponseTime(url);
  const pingTime = await getPingTime(url);

//   const metric = new Metric({ url, status, responseTime, pingTime });
//   await metric.save();

  return { status, responseTime, pingTime };
};
