import React from 'react'
import { useEffect, useState } from 'react';
import FileBase64 from 'react-file-base64';
import { getBase64 } from '../services/getFileService';

export default function UploadFile() {
    // EJEMPLO EN BASE64
    const [state, setState] = useState([]);
    
    const handleFileInputChange = e => {
        
        let { file } = state;
    
        file = e.target.files[0];
    
        getBase64(file)
          .then(result => {
            file["base64"] = result;        
            setState({
              base64URL: result,
              file
            });
            
          })
          .catch(err => {
            console.log(err);
          });
    
        setState({
          file: e.target.files[0]
        });
        console.log(e.target.files[0]);
    };
    
    return (
        <div>
            <input type="file" name="file" onChange={handleFileInputChange} />
            <div>
                <div className="card" >
                     <div className="card-image waves-effect waves-block waves-light">
                         <img className="activator" style={{ width: '100%', height: 300 }} src={state.base64URL} />
                     </div>
                 </div>
            </div>
        </div>
    );

}
