import React from 'react'
import { Bar } from 'react-chartjs-2'

export default function ShowHistogram(props) {
    const { data } = props;

    const options = {
        scales: {
            x: {
                type: 'linear',
            },
            y: {
                beginAtZero: true
            }
        },
        plugins: {
            tooltip: {
                callbacks: {
                    title: function () { },
                    label: function (context) {
                        let index = context.dataIndex;
                        let dataset = context.dataset.data;
                        let interval = "Intervalo: [";
                        interval += context.parsed.x + ", ";
                        interval += index < dataset.length - 1 ? dataset[index + 1].x : " ";
                        interval += "[";
                        let frequence = "Frecuencia: " + context.parsed.y;
                        return [interval, frequence];
                    }
                }
            }
        }
    };

    let configs = [];

    for (let key in data) {
        let dataVariable = Array.from(data[key]);
        dataVariable.sort(function (a, b) { return a - b });

        let classes = Math.ceil(Math.sqrt(dataVariable.length));
        let amplitude = 0;
        let range = 0;

        let parseData = [];
        if (classes > 0) {
            range = dataVariable.at(-1) - dataVariable.at(0);
            amplitude = Math.round(range / classes);
            let interval = Math.floor(dataVariable.at(0));
            let index = 0;
            while (index < dataVariable.length) {
                let frequence = 0;
                let previous = interval;
                interval += amplitude
                while (dataVariable[index] < interval) {
                    frequence++;
                    index++;
                }
                parseData.push({ x: previous, y: frequence });
            }
        }

        const config = {
            datasets: [{
                label: key,
                data: parseData,
                backgroundColor: '#8ecae6',
                borderColor: '#219ebc',
                borderWidth: 1,
                categoryPercentage: 1,
                barPercentage: 1
            }]
        };
        configs.push(config);
    }

    return (
        <div>
            {configs.map((config, index) => (
                <Bar data={config} options={options} />
            ))}
        </div>
    )
}
