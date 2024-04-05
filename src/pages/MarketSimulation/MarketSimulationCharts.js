import React, { useState, useEffect, useRef } from 'react';
import { Chart } from "primereact/chart";
import { Divider } from 'primereact/divider';

import ApexChart from "react-apexcharts";
import ApexCharts from 'apexcharts';
import "./AnnualLoadChart.css"
const MarketSimulationCharts = (props) => {
    const {label, color, generation_fleet_data2, dataForLine, annual_demand, peak_load} = props
    const [selection, setSelection] = useState("")
    const [basicOptions, setBasicOptions] = useState()
    const [basicOptions2, setBasicOptions2] = useState()
    const [chart, setChart] = useState()
    const chartRef = useRef()
    const [x, setX] = useState(0)
    useEffect(() => {
      setBasicOptions({
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: {
          title: {
              display: true,
              text: 'Generation Fleet',
              font:{size:18},
          },
          legend: {
            display:false,
            labels: {
              font:{size:15},
              color: "#495057",
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: "#495057",
            },
            grid: {
              color: "#ebedef",
            },
          },
          y: {
            ticks: {
              color: "#495057",
            },
            grid: {
              color: "#ebedef",
            },
            title: {
              font:{size:14},
              display: true,
              text: "Installed Capacity [GW]",
            },
          },
        },
      })

      setBasicOptions2({
        pointRadius: 0,
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: {
          title: {
            display: true,
            text: 'Annual Load',
            font:{size:18},
        },
          legend: {
            display: false,
            labels: {
              font:{size:15},
              color: "#495057",
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: "#495057",
            },
            grid: {
              color: "#ebedef",
            },
          },
          y: {
            ticks: {
              color: "#495057",
            },
            grid: {
              color: "#ebedef",
            },
            title: {
              font:{size:14},
              display: true,
              text: "Load [MW]",
            },
          },
        },
      })

      setChart(
        {labels: label,
        datasets: [
            {
                label: "Generation Fleet",
                backgroundColor: color,
                data: generation_fleet_data2,
                datalabels:{
                  display: false
                }
            }
        ]})
      setSelection("")
    },[generation_fleet_data2])

    const options ={
      chart: {
        id: "annualLoad",
        type: 'line',
        height: 350,
        zoom: {
          autoScaleYaxis: true
        },
        animations:{
          enabled: false
        },
        toolbar:{
          tools:{
            download: false
          }
        }
      },
      dataLabels: {
        enabled: false
      },
      markers: {
        size: 0,
      },
      colors:["#ED7D31"],
      xaxis: {
        type:"datetime",
        categories: dataForLine.labels,
        labels: {
          datetimeFormatter: {
            month: 'MMM',
            day: 'dd MMM',
            hour: 'HH:mm'
          },
          style: { colors: "rgb(71, 71, 71)" },
        },
        title:{
          text: "date",
          style: {
            color: "rgb(71, 71, 71)",
            fontSize: '14px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 500,
          },
        }
      },
      yaxis:{
        labels: {
          style: { colors: "rgb(71, 71, 71)" },
        },
        title:{
          text: "Load (MW)",
          style: {
            color: "rgb(71, 71, 71)",
            fontSize: '14px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 500,
          },
        }
      },
      tooltip: {
        enabled: true,
        x: {
          format: 'dd MMM HH:mm'
        },
        y: {
          formatter: function(value, { series, seriesIndex, dataPointIndex, w }) {
            return value.toFixed(2) + " MW"
          }
        }
      },
      fill: {
        type: 'solid',
      },
      stroke:{
        curve: "smooth",
        width: 3,
      },
      title:{
        text: "Annual Load",
        align: "center",
        style: {
          fontSize:  '15px',
          fontWeight:  'bold',
          fontFamily:  undefined,
          color:  '#263238'
        },
      },
      selection: ""
    }
    const annualLoadData = dataForLine.data
    const updateData = (timeline) =>{

      chartRef.current.setState({
        selection: timeline
      })
      setSelection(timeline)
      setX(Math.random())

      switch (timeline) {
        case 'winter':
          ApexCharts.exec(
            'annualLoad',
            'zoomX',
            0,
            3600000*90*24
          )
          break
        case 'spring':
          ApexCharts.exec(
            'annualLoad',
            'zoomX',
            3600000*90*24,
            3600000*181*24
          )
          break
        case 'summer':
          ApexCharts.exec(
            'annualLoad',
            'zoomX',
            3600000*180*24,
            3600000*273*24
          )
          break
        case 'fall':
          ApexCharts.exec(
            'annualLoad',
            'zoomX',
            3600000*273*24,
            3600000*365*24
          )
          break
        case 'all':
          ApexCharts.exec(
            'annualLoad',
            'zoomX',
            0,
            3600000*8760
          )
          break
        default:
      }
    }
      return (
        
        <div>
          <Chart
            data={chart}
            width="100%"
            height="300px"
            type="bar"
            options={basicOptions}
          />    

        <Divider></Divider>
        <div><br /><br /></div>
        {/*<Chart
            data={dataForLine}
            width="100%"
            height="300px"
            type="line"
            options={basicOptions2}
      />*/}
        <div class="toolbar" style={{textAlign:"center"}}>
          <button id="winter" className={selection==="winter"? "selected" : "unselected"}
              onClick={()=>updateData('winter')}>
            Winter
          </button>
          &nbsp;
          <button id="spring" className={selection==="spring"? "selected" : "unselected"}
              onClick={()=>updateData('spring')}>
            Spring
          </button>
          &nbsp;
          <button id="summer" className={selection==="summer"? "selected" : "unselected"}
              onClick={()=>updateData('summer')}>
            Summer
          </button>
          &nbsp;
          <button id="fall" className={selection==="fall"? "selected" : "unselected"}
              onClick={()=>updateData('fall')}>
            Fall
          </button>
          &nbsp;
          <button id="all" className={selection==="all"? "selected" : "unselected"}
              onClick={()=>updateData('all')}>
            ALL
          </button>
        </div>
        <br></br>
        {dataForLine.labels && <ApexChart options={options} series={annualLoadData} type="line" width="100%" height="350" ref={chartRef}></ApexChart>}

        <Divider></Divider>
        <p style={{textAlign:"center", fontSize:"18px", paddingTop:"5px"}}>
         Annual demand is{" "}
          <span>
            <b>{annual_demand}</b>
          </span>{" "}
          TWh
        </p>
        <p style={{textAlign:"center", fontSize:"18px"}}>
         Peak load is{" "}
          <span>
            <b>{peak_load}</b>
          </span>{" "}
          MW
        </p>      
    </div>  
                                
      )
  }
  export default MarketSimulationCharts




