import axios from 'axios';

const config = {
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    }
};
const FactorURL = process.env.REACT_APP_API_URL + '/api/private/factor';


export const getFactor = async (id) => {
    try {
        id = id || '';
        return await axios.get(`${FactorURL}/${id}`, config);
    } catch (error) {
        return new TypeError("Authentication failed!");
    }
}

export const addFactor = async (Factor) => {
    try {
        return await axios.post(`${FactorURL}/`, Factor, config);
    } catch (error) {
        return new TypeError("Authentication failed!");
    }
}

export const deleteFactor = async (fid, bid) => {
    try {
        return await axios.delete(`${FactorURL}/${fid}/${bid}`, config);
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
}