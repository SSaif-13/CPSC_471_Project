import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// registering the  necessary Chart.js components to enable some features scales, tooltips, titles, and legends
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const LineGraph = ({ multiSelectedData }) => {
    // predefinec colors for each line
    const colors = [
        { border: 'rgb(53, 149, 149)', background: 'rgba(63, 173, 173, 0.2)' },
        { border: 'rgb(190, 53, 83)', background: 'rgba(224, 76, 108, 0.2)' },
        { border: 'rgb(31, 129, 195)', background: 'rgba(42, 143, 211, 0.2)' },
        { border: 'rgb(222, 177, 62)', background: 'rgba(226, 180, 61, 0.2)' },
        { border: 'rgb(104, 53, 205)', background: 'rgba(124, 73, 226, 0.2)' },
    ];

    // all the country's datasets will have the same years
    // using the first country's data which is world data
    const labels =
        multiSelectedData[0]?.filteredData.map(entry => entry.Year) || [];

    // building an array of datasets one for each of the selected countries

    const datasets = multiSelectedData.map((countryData, index) => ({
        label: countryData.countryName + ' Emissions',
        data: countryData.filteredData.map(entry =>
            Number(entry['Annual CO2 emissions'])
        ),
        borderColor: colors[index].border,
        backgroundColor: colors[index].background,
        fill: false,
    }));

    // combining labels and datasets into a single object for the chart
    const chartData = { labels, datasets };

    return (
        <div className="line-graph">
            <div className="chart-container">
                {datasets.length > 0 ? (
                    <Line data={chartData} />
                ) : (
                    <p>Please select at least one country to display the chart</p>
                )}
            </div>
        </div>
    );
};

export default LineGraph;
