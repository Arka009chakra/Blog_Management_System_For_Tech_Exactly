import axios from 'axios';
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api/v1',
  withCredentials: true
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
let refreshing = false;
let waiting = [];
const settle = (error, token) => {
  waiting.forEach(({ resolve, reject }) => error ? reject(error) : resolve(token));
  waiting = [];
};
api.interceptors.response.use((response) => response, async (error) => {
  const original = error.config;
  if (error.response?.status !== 401 || original._retry || original.url?.includes('/auth/')) throw error;
  if (refreshing) {
    const token = await new Promise((resolve, reject) => waiting.push({ resolve, reject }));
    original.headers.Authorization = `Bearer ${token}`;
    return api(original);
  }
  original._retry = true; refreshing = true;
  try {
    const result = await axios.post(`${api.defaults.baseURL}/auth/refresh`, {}, { withCredentials: true });
    const token = result.data.accessToken;
    localStorage.setItem('accessToken', token); settle(null, token);
    original.headers.Authorization = `Bearer ${token}`;
    return api(original);
  } 
  // catch (refreshError) {
  //   // settle(refreshError); localStorage.removeItem('accessToken');
  //   // window.dispatchEvent(new Event('auth:expired'));
  //   // throw refreshError;
  // } 

catch (refreshError) {
  settle(refreshError);

  // Refresh token is invalid or expired
  localStorage.removeItem('accessToken');

  window.dispatchEvent(new Event('auth:expired'));

  throw refreshError;
}
  finally { refreshing = false; }
});
export default api;
