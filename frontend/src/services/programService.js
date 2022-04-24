import axios from 'axios';

const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    }
  };
const programsURL = process.env.REACT_APP_API_URL + '/api/private/program';


export const getPrograms = async (id) => {
    id = id || '';
    try{
        return await axios.get(`${programsURL}/${id}`, config);
    }    
    catch(error){
        return new TypeError("Authentication failed!");
    }
}

export const addProgram = async (programs) => {
    try{
        return await axios.post(`${programsURL}/`, programs, config);
    }catch(error){
        return new TypeError("Authentication failed!");
    }
}

export const deleteProgram = async (id) => {
    try{
        return await axios.delete(`${programsURL}/${id}`, config);
    }catch(error){
        throw Error(error?.response?.data?.error);
    }
}

export const editProgram = async (id, programs) => {
    try{
        return await axios.patch(`${programsURL}/${id}`, programs, config)
    }catch(error){
        return new TypeError("Authentication failed!");
    }
}