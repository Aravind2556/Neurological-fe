import React from 'react';
import ReactApexChart from 'react-apexcharts';

const CustomApexChart = ({ data, title, lineStyle, lineWidth, chartType, controls, color }) => {

    // Convert each data object into a series object expected by ApexCharts.
    const series = data.map((serie) => {
        const last100X = serie["x-axis"].slice(-100);
        const last100Y = serie["y-axis"].slice(-100);

        const seriesData = last100X.map((x, i) => ({
            x,
            y: last100Y[i]
        })).sort((a, b) => new Date(a.x) - new Date(b.x));

        return {
            name: serie.seriesName,
            data: seriesData,
            ...(serie.color && { color: serie.color })
        };
    });

    // X-axis min/max
    const xMin = series[0]?.data[0]?.x;
    const xMax = series[0]?.data[series[0]?.data.length - 1]?.x;

    // Y-axis min/max calculation for tight scaling
    const allY = series.flatMap(serie => serie.data.map(d => d.y));
    const yMin = Math.min(...allY);
    const yMax = Math.max(...allY);

    // Chart configuration
    const options = {
        chart: {
            height: 350,
            type: chartType,
            selection: {
                enabled: false,
                type: "x"
            },
            zoom: {
                enabled: controls?.zoomEnabled ?? true,
                type: controls?.zoomType || 'x',
                autoScaleYaxis: controls?.autoScaleYaxis ?? true
            },
            toolbar: {
                show: controls?.show ?? true,
                tools: {
                    download: controls?.download ?? true,
                    selection: controls?.selection ?? false,
                    zoom: controls?.zoom ?? true,
                    zoomin: controls?.zoomin ?? true,
                    zoomout: controls?.zoomout ?? true,
                    pan: controls?.pan ?? true,
                    reset: controls?.reset ?? true
                }
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: lineStyle,
            width: lineWidth
        },
        title: {
            text: title,
            align: 'left',
            style: {
                color: color || "#000"
            }
        },
        grid: {
            row: {
                colors: title === "Heart rate" ? ['transparent', 'transparent'] : ['#f3f3f3', '#fff'],
                opacity: 0.5
            }
        },

        // ⭐ X-AXIS
        xaxis: {
            type: 'datetime',
            tickAmount: 10,
            title: {
                text: "Time",
                style: {
                    color: "#333",
                    fontSize: "13px",
                    fontWeight: 600
                }
            },
            labels: {
                formatter: (value) => new Date(value).toLocaleString(),
                rotate: -45
            },
            min: xMin,
            max: xMax,
        },

        //Y-AXIS
        yaxis: {
            min: yMin - 5,
            max: yMax + 5,
            tickAmount: 6,
            decimalsInFloat: 1,
            title: {
                text: title + " Value",
                style: {
                    color: "#333",
                    fontSize: "13px",
                    fontWeight: 600
                }
            },
            labels: {
                style: {
                    colors: "#666",
                    fontSize: "12px"
                }
            }
        }
    };

    // Special heart rate grid background
    const containerStyle = {
        width: "100%",
        height: 350,
        position: "relative",
        backgroundImage: `
            linear-gradient(rgba(247, 23, 53, 0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(247, 23, 53, 0.2) 1px, transparent 1px)
        `,
        backgroundSize: "10px 10px"
    };

    return (
        <div>
            <div id="chart">
                <ReactApexChart
                    key={chartType}
                    options={options}
                    series={series}
                    height={350}
                    type={chartType}
                    width={"100%"}
                    style={title === "Heart rate" ? containerStyle : {}}
                />
            </div>
        </div>
    );
};

export default CustomApexChart;
