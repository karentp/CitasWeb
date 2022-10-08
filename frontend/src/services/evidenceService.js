import axios from 'axios';

const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    }
  };
const evidenceURL = process.env.REACT_APP_API_URL + '/api/private/evidence';


export const getEvidences = async (id) => {
    id = id || '';
    try{
        return await axios.get(`${evidenceURL}/${id}`, config);
    }    
    catch(error){
        return new TypeError("Authentication failed!");
    }
}

export const addEvidence = async (evidences) => {
    try{
        return await axios.post(`${evidenceURL}/`, evidences, config);
    }catch(error){
        return new TypeError("Authentication failed!");
    }
}

export const deleteEvidence = async (id) => {
    try{
        return await axios.delete(`${evidenceURL}/${id}`, config);
    }catch(error){
        throw Error(error?.response?.data?.error);
    }
}

export const editEvidence = async (id, evidences) => {
    try{
        return await axios.patch(`${evidenceURL}/${id}`, evidences, config)
    }catch(error){
        return new TypeError("Authentication failed!");
    }
}
