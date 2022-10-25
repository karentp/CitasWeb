import React, { useRef, useState, useEffect } from 'react'
import { BoxPlotChart } from '@sgratzl/chartjs-chart-boxplot';


function ShowBoxplot(props) {
    const { data } = props;
    let configs = [];
    let indexes = [];
    let index = 0;
    for (let key in data) {
        indexes.push(index);
        index++;
        const config = {
            // define label tree
            labels: [""],
            datasets: [{
                label: key,
                backgroundColor: 'rgba(255,0,0,0.5)',
                borderColor: 'red',
                borderWidth: 1,
                outlierColor: '#ffffff',
                padding: 5,
                itemRadius: 0,
                data: [data[key]]
            }]
        };
        configs.push(config);
    }


    useEffect(() => {
        indexes.forEach(i => {
            const context = document.getElementById("canvas" + i).getContext("2d");
            let boxplot = new BoxPlotChart(context, { data: configs[i] });
        })

    }, []);

    return (
        <div>
            {indexes.map((i) => (
                <canvas id={"canvas" + i} />
            ))}
        </div>

    )
}

export default ShowBoxplot;