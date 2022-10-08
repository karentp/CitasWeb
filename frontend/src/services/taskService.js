import axios from 'axios';

const config = {
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    }
};
const taskURL = process.env.REACT_APP_API_URL + '/api/private/task';


export const getTasks = async (id) => {
    try {
        id = id || '';
        return await axios.get(`${taskURL}/${id}`, config);
    } catch (error) {
        return new TypeError("Authentication failed!");
    }
}

export const addTask = async (task) => {
    try {
        return await axios.post(`${taskURL}/`, task, config);
    } catch (error) {
        return new TypeError("Authentication failed!");
    }
}

export const deleteTask = async (id) => {
    try {
        return await axios.delete(`${process.env.REACT_APP_API_URL}/api/private/task/${id}`, config);
    } catch (error) {
        throw Error(error?.response?.data?.error);
    }
}

export const editTask = async (id, task) => {
    try {
        return await axios.patch(`${taskURL}/${id}`, task, config)
    } catch (error) {
        return new TypeError("Authentication failed!");
    }
}