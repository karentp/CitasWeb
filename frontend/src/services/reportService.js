import axios from 'axios';

const config = {
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    }
};
const reportURL = process.env.REACT_APP_API_URL + '/api/private/report';


export const getReports = async (id) => {
    try {
        id = id || '';
        return await axios.get(`${reportURL}/${id}`, config);
    } catch (error) {
        return new TypeError("Authentication failed!");
    }
}

export const getReportsDeadline = async (id) => {
    id = id || '';
    try{
        return await axios.get(`${reportURL}/${id}`, config);
    }    
    catch(error){
        return new TypeError("Authentication failed!");
    }
}


export const addReport = async (report) => {
    try {
        return await axios.post(`${reportURL}/`, report, config);
    } catch (error) {
        return new TypeError("Authentication failed!");
    }
}

export const deleteReport = async (id) => {
    try {
        return await axios.delete(`${process.env.REACT_APP_API_URL}/api/private/report/${id}`, config);
    } catch (error) {
        throw Error(error?.response?.data?.error);
    }
}

export const editReport = async (id, report) => {
    try {
        return await axios.patch(`${reportURL}/${id}`, report, config)
    } catch (error) {
        return new TypeError("Authentication failed!");
    }
}