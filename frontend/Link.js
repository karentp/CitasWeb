// Link.react.js
import React, { useState } from 'react';

const Link = () => {
    const [counter, setCounter] = useState(0)


    return (
        <div>
            <h1>Hola</h1>
            <button id="increment-btn" onClick={()=> setCounter(counter+1)}>Increment</button>
            <button id="decrement-btn" onClick={()=> counter>0?setCounter(counter-1):counter}>Increment</button>
            <div id="counter-value" >{counter}</div>

        </div>


    );
};

export default Link;