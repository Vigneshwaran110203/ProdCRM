import axios from "axios"

const api = axios.create({
    baseURL: "http://localhost:8080/api",
    withCredentials: true,
})

export const get = (url, config = {}) => api.get(url, config)
export const post = (url, data, config = {}) => api.post(url, data, config)
export const put = (url, data, config = {}) => api.put(url, data, config)
export const del = (url, config={}) => api.delete(url, config)

export default api