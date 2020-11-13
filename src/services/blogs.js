import axios from "axios";
const baseUrl = "/api/blogs";

let token = null;

const setToken = (newToken) => {
  token = `bearer ${newToken}`;
};

const create = (newObject) => {
  const config = {
    headers: { Authorization: token },
  };
  const request = axios.post(baseUrl, newObject, config);
  return request.then((response) => response.data);
};

const getAll = () => {
  const config = {
    headers: { Authorization: token },
  };
  const request = axios.get(baseUrl, config);
  return request.then((response) => response.data);
};

const update = (blogId, blog) => {
  const config = {
    headers: { Authorization: token },
  };
  return axios
    .put(`${baseUrl}/${blogId}`, blog, config)
    .then((response) => response.data);
};

const deleteBlog = (blogId) => {
  const config = {
    headers: { Authorization: token },
  };
  return axios
    .delete(`${baseUrl}/${blogId}`, config)
    .then((response) => response.data);
};

export default { setToken, create, getAll, update, deleteBlog };
