import React from 'react'
import { useHistory } from "react-router-dom";
import { Redirect, Route } from "react-router-dom";

export default function RequireAuth({ component: Component, ...rest }) {
    const history = useHistory();

    function isTokenExpired(token) {
        if(token){
            const payloadBase64 = token.split('.')[1];
            const decodedJson = Buffer.from(payloadBase64, 'base64').toString();
            const decoded = JSON.parse(decodedJson);
            const exp = decoded.exp;
            const expired = (Date.now() >= exp * 1000)
            return expired
        }
        
    }

    if(isTokenExpired(localStorage.getItem("authToken"))){
        localStorage.clear();
    }
    if (!localStorage.getItem("authToken")){
        history.push('/login');        
    }
    
    return(
        <Route
      {...rest}
      render={(props) =>
          <Component {...props} />
      }
    />
    );
}
