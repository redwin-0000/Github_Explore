import axios from 'axios';
const BASE_URL = 'https://api.github.com';
export async function fetchRepositories(query) {
  const response = await axios.get(`${BASE_URL}/search/repositories?q=${query}`);
  return response.data;
  // (response.data,'sdncjkdsnckjdc');
}
