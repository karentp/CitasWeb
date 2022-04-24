import axios from 'axios';

const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    }
  };
const noticesURL = process.env.REACT_APP_API_URL + '/api/private/notice';


export const getNotices = async (id) => {
    id = id || '';
    try{
        return await axios.get(`${noticesURL}/${id}`, config);
    }    
    catch(error){
        return new TypeError("Authentication failed!");
    }
}

export const addNotice = async (notices) => {
    try{
        return await axios.post(`${noticesURL}/`, notices, config);
    }catch(error){
        return new TypeError("Authentication failed!");
    }
}

export const deleteNotice = async (id) => {
    try{
        return await axios.delete(`${noticesURL}/${id}`, config);
    }catch(error){
        throw Error(error?.response?.data?.error);
    }
}

export const editNotice = async (id, notices) => {
    try{
        return await axios.patch(`${noticesURL}/${id}`, notices, config)
    }catch(error){
        return new TypeError("Authentication failed!");
    }
}