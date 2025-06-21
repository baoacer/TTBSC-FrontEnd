import axios from './axios'

export const login = (data) => {
    return axios.post('/user/login', data)
}

export const signup = (data) => {
    return axios.post('/user/signup', data)
}

export const updateUserInfo = ({ userID, data }) => {
    return axios.patch(`/user/${userID}`, data)
}

export const getUsers = (params = {}) => {
    return axios.get(`/user`, { params })
}

export const active = ({ email }) => {
    return axios.post(`/user/active`, { email })
}

export const changePassword = (data) => {
    return axios.post(`/user/change-password`, data)
}

export const resetPassword = ({ email }) => {
    return axios.post(`/user/reset`, { email })
}
