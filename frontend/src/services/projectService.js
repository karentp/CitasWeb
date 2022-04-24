import axios from 'axios';

const config = {
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    }
};
const projectURL = process.env.REACT_APP_API_URL + '/api/private/project';


export const getProjects = async (id) => {
    try {
        id = id || '';
        return await axios.get(`${projectURL}/${id}`, config);
    } catch (error) {
        return new TypeError("Authentication failed!");
    }
}

export const addProject = async (project) => {
    try {
        return await axios.post(`${projectURL}/`, project, config);
    } catch (error) {
        return new TypeError("Authentication failed!");
    }
}

export const deleteProject = async (id) => {
    try {
        return await axios.delete(`${process.env.REACT_APP_API_URL}/api/private/project/${id}`, config);
    } catch (error) {
        throw Error(error?.response?.data?.error);
    }
}

export const editProject = async (id, project) => {
    try {
        return await axios.patch(`${projectURL}/${id}`, project, config)
    } catch (error) {
        return new TypeError("Authentication failed!");
    }
}