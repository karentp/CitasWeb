import axios from 'axios';

const config = {
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    }
};
const dataURL = process.env.REACT_APP_API_URL + '/api/private/record';


export const getData = async (pid, bid) => {
    try {
        pid = pid || '';
        bid = bid || '';
        return await axios.get(`${dataURL}/${bid}/${pid}`, config);
    } catch (error) {
        return new TypeError("Authentication failed!");
    }
}

export const addData = async (data) => {
    try {
        return await axios.post(`${dataURL}/`, data, config);
    } catch (error) {
        return new TypeError("Authentication failed!");
    }
}

/*
export const deleteFactor = async (id) => {
    try {
        return await axios.delete(`${dataURL}/${id}`, config);
    } catch (error) {
        return new TypeError("Authentication failed!");
    }
}

export const editFactor = async (id, Factor) => {
    try {
        return await axios.patch(`${FactorURL}/${id}`, Factor, config)
    } catch (error) {
        return new TypeError("Authentication failed!");
    }
}*/