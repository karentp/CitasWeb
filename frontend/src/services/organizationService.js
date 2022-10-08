import axios from 'axios';

const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    }
  };
const organizationURL = process.env.REACT_APP_API_URL + '/api/private/organization';


export const getOrganizations = async (id) => {
    id = id || '';
    try{
        return await axios.get(`${organizationURL}/${id}`, config);
    }    
    catch(error){
        return new TypeError("Authentication failed!");
    }
}

export const addOrganization = async (organizations) => {
    try{
        return await axios.post(`${organizationURL}/`, organizations, config);
    }catch(error){
        return new TypeError("Authentication failed!");
    }
}

export const deleteOrganization = async (id) => {
    try{
        return await axios.delete(`${organizationURL}/${id}`, config);
    }catch(error){
        throw Error(error?.response?.data?.error);
    }
}

export const editOrganization = async (id, organizations) => {
    try{
        return await axios.patch(`${organizationURL}/${id}`, organizations, config)
    }catch(error){
        return new TypeError("Authentication failed!");
    }
}
