import axios from 'axios';

const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    }
  };
const resourceURL = process.env.REACT_APP_API_URL + '/api/private/resource';


export const getResources = async (id) => {
    id = id || '';
    try{
        return await axios.get(`${resourceURL}/${id}`, config);
    }    
    catch(error){
        return new TypeError("Authentication failed!");
    }
}

export const addResource = async (resources) => {
    try{
        return await axios.post(`${resourceURL}/`, resources, config);
    }catch(error){
        return new TypeError("Authentication failed!");
    }
}

export const deleteResource = async (id) => {
    try{
        return await axios.delete(`${resourceURL}/${id}`, config);
    }catch(error){
        throw Error(error?.response?.data?.error);
    }
}

export const editResource = async (id, resources) => {
    try{
        return await axios.patch(`${resourceURL}/${id}`, resources, config)
    }catch(error){
        return new TypeError("Authentication failed!");
    }
}
