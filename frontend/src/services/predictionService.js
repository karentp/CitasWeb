import axios from 'axios';

const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    }
  };
const predictionsURL = process.env.REACT_APP_API_URL + '/api/private/prediction';

export const getPredictions = async (id) => {
    id = id || '';
    try{
        return await axios.get(`${predictionsURL}/${id}`, config);
    }    
    catch(error){
        return new TypeError("Authentication failed!");
    }
}

export const addPrediction = async (prediction) => {
    try{
        return await axios.post(`${predictionsURL}/`, prediction, config);
    }catch(error){
        return new TypeError("Authentication failed!");
    }
}

