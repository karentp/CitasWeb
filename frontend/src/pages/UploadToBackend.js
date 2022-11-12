import React, { useState, useEffect } from 'react'
import { useForm, Form } from '../components/useForm';
import Controls from "../components/controls/Controls";
import axios from 'axios';
import {getLocalFile} from '../services/getFileService'
import i18n from '../../i18n';

// EJEMPLO PARA SUBIR EN BACKEND
export default function UploadToBackend() {
  const [screenShot, setScreenshot] = useState(undefined)
  const url = process.env.REACT_APP_API_URL + "/api/private/fetchImage/"
  async function fetchData(url) {
    // You can await here
    try{
      const [response, error] = await getLocalFile(url)
      console.log(response);
      setScreenshot(response)
    }catch(error){
      console.log(error)
    }
  }
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState();

  const submitHandler = (e) => {
    e.preventDefault(); //prevent the form from submitting
    let formData = new FormData();

    formData.append("file", selectedFiles[0]);
    //Clear the error message
    setError("");
    axios
      .post(process.env.REACT_APP_API_URL + "/api/private/upload_file/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        onUploadProgress: (data) => {
          //Set the progress value to show the progress bar
          setProgress(Math.round((100 * data.loaded) / data.total));
        },
      })
      .then((response) => {
        console.log(response);
        fetchData(url + response?.data?.filename);
      })
      .catch((error) => {
        //const { code } = error?.response?.data;
        console.log(error);
      });
  };
  return (

    <div>
      <Form onSubmit={submitHandler}>        
        <input type="file" name="file"
          onChange={(e) => {
            setSelectedFiles(e.target.files);
          }}
        />
        <Controls.Button
          type="submit"
          text={i18n.t('upload')}
        />
        <img className="activator" style={{ width: '100%', height: 300 }} src={screenShot} />
      </Form>
    </div>
  );
}
