import React, { useState, useEffect, useRef } from 'react';
import { Chart } from "primereact/chart";
import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button';
import ApexChart from 'react-apexcharts';
const NetworkSimulationCharts = (props) => {
    const {label, color, generation_fleet_data2, dataForLine, annual_demand, peak_load, DateRange} = props
    let updateddataForLine = structuredClone(dataForLine)
    const hour_of_first_day_of_month = {
      1: 0,
      2: 744,
      3: 1416,
      4: 2160,
      5: 2880,
      6: 3624,
      7: 4344,
      8: 5088,
      9: 5832,
      10: 6552,
      11: 7296,
      12: 8016,
    }
    let from = 0
    let to = 8760
    let start_month = 1
    let end_month = 12
    let start_day = 1
    let end_day = 31

    if (DateRange.length !== 0){
      start_month = DateRange[0].getMonth() + 1
      end_month = DateRange[1].getMonth() + 1
      start_day = DateRange[0].getDate()
      end_day = DateRange[1].getDate()
      if (start_month === 2 && start_day === 29){
        start_month = 3
        start_day = 1
      }
      if (end_month === 2 && end_day === 29){
        end_month = 2
        end_day = 28
      }
      from = hour_of_first_day_of_month[start_month] + 24 * (start_day - 1)
      to = hour_of_first_day_of_month[end_month] + 24 * end_day
      
    }
    
    const [basicOptions, setBasicOptions] = useState()
    const [basicOptions2, setBasicOptions2] = useState()
    const [chart, setChart] = useState()
    
    updateddataForLine.data[0].data = updateddataForLine.data[0].data.slice(from, to)
    updateddataForLine.labels = updateddataForLine.labels.slice(from, to)

    const peak_load_V1 = (Math.max(...updateddataForLine.data[0].data, 0)/1000).toFixed(2)
    const  demand = (updateddataForLine.data[0].data.reduce((partialSum, a) => partialSum + a, 0)/1000000).toFixed(2)
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
        },
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
        categories: updateddataForLine.labels,
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
    const annualLoadData = updateddataForLine.data
      return (
        <div className="card">
          <div>
            <Chart
              data={chart}
              width="100%"
              height="300px"
              type="bar"
              options={basicOptions}
            />    
            <div></div>      
            <Divider></Divider>
            <div><br/><br/></div>
            {/*<Chart
                data={updateddataForLine}
                width="100%"
                height="300px"
                type="line"
                options={basicOptions2}
      />*/}
            <ApexChart options={options} series={annualLoadData} type="line" width="100%" height="350"></ApexChart>
            <Divider></Divider>
            <p style={{textAlign:"center", fontSize:"16px"}}>
              {(DateRange.length !== 0 && (from !== 0 || to !== 8760)) && <span>In the selected time interval;</span>}
            </p>
            {(DateRange.length !== 0 && (from !== 0 || to !== 8760)) && <p style={{textAlign:"center", fontSize:"16px"}}>      
            Total demand is{" "}
              <span>
                <b>{demand}</b>
              </span>{" "}
              TWh
            </p>}
            {(DateRange.length === 0 || (from===0 && to === 8760)) && <p style={{textAlign:"center", fontSize:"16px"}}>      
            Annual demand is{" "}
              <span>
                <b>{demand}</b>
              </span>{" "}
              TWh
            </p>}
            <p style={{textAlign:"center", fontSize:"16px"}}>
            Peak load is{" "}
              <span>
                <b>{peak_load_V1}</b>
              </span>{" "}
              MW
            </p>      
          </div>  
        </div>
        
                                
      )
  }
  export default NetworkSimulationCharts