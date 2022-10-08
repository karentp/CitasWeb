import React from 'react'

export const getBase64 = file => {
  return new Promise(resolve => {
    let fileInfo;
    let baseURL = "";
    // Make new FileReader
    let reader = new FileReader();

    // Convert the file to base64 text
    reader.readAsDataURL(file);

    // on reader load somthing...
    reader.onload = () => {
      // Make a fileInfo Object
      baseURL = reader.result;
      resolve(baseURL);
    };

  });
};

export const checkFileValidations = info => {
  if(info.size >= 15165578){
    throw Error("LIMIT_FILE_SIZE")
  }
}

export async function getLocalFile(url) {
  try {
    const response = await fetch(url, {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      headers: {
        'Content-Type': 'image/jpeg',
        Authorization: `Bearer ${localStorage.getItem("authToken")}`
      }
    })
    const blob = await response.blob()
    return [URL.createObjectURL(blob), null];
  }
  catch (error) {
    console.error(`get: error occurred ${error}`);
    return [null, error]
  }
}