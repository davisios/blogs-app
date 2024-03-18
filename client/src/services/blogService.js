import axios from 'axios';

const getBlogs = async () => {
  return axios.get(process.env.REACT_APP_API_URL);
};

export { getBlogs };
