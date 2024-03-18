import axios from 'axios';

const getBlogs = async () => {
  return axios.get(`${process.env.REACT_APP_API_URL}/blogs`);
};

const deleteBlog = async (id) => {
  return axios.delete(`${process.env.REACT_APP_API_URL}/blogs/${id}`);
};

export { getBlogs, deleteBlog };
