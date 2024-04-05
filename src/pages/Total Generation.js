import { Panel } from "primereact/panel";
import React, {useEffect, useState} from "react";
import ApexChart from "react-apexcharts";
import "./IPCStyle.css"
export const TotalGeneration = () => {
  const maxVal = 50
  const genData = [[4.16, 0, 0],[16.18, 0, 0],[0.23, 0, 0],[0.06, 0, 0],[0, 0, 6.43],[0, 0, 6.7],[0, 28.93, 0],[0, 2.1, 0],[0, 0, 0],[0, 0, 0.48]]

















  const generationData = [
      {
        data: genData[0],
        name: "Gas"
      },
      {
        data: genData[1],
        name: "Lignite"
      },
      {
        data: genData[2],
        name: "Import Coal"},
      {
        data: genData[3],
        name: "Coal"},
      {
        data: genData[4],
        name: "Wind"
      },
      {
        data: genData[5],
        name: "PV"
      },
      {
        data: genData[6],
        name: "Hydro"
      },
      {
        data: genData[7],
        name: "RoR"
      },
      {
        data: genData[8],
        name: "Geothermal"
      },
      {
        data: genData[9],
        name: "Biomass"
      }
  ]
  let maxConventional = 0
  let maxHydro = 0
  let maxRenewable = 0
  for(let i=0; i<generationData.length; i++){
    maxConventional += generationData[i].data[0]
    maxHydro += generationData[i].data[1]
    maxRenewable += generationData[i].data[2]
  }
  




  const colors = ["#CC66FF" ,"#A6A6A6", "#000000", "#767171", "#009900", "#FFC000", "#6699FF", "#33CCFF", "#990099", "#F4B183"]
  const technologies= ["Conventional", "Hydro", "Renewable"]
  var options =  {
      chart: {
        height: 350,
        type: 'bar',
        stacked: true,
        zoom: {
          enabled: false
        },
        dropShadow:{
          enabled:false
        }
      },
      colors: colors,
      annotations: {
  
        points: [
          {
            x: 1,
            y: maxConventional,
            marker: {
              size: 0,
              fillColor: "transparent",
              strokeColor: "transparent",
              radius: 0
            },
            label: {
              borderColor: "#FF4560",
              offsetY: 0,
              style: {
                fontSize: '16px',
                color: "#fff",
                background: "#FF4560"
              },
    
              text: String(Math.round(maxConventional*100)/100) + " TWh"
            }
          },
          {
            x: 2,
            y: maxHydro,
            marker: {
              size: 0,
              fillColor: "transparent",
              strokeColor: "transparent",
              radius: 0
            },
            label: {
              borderColor: "#FF4560",
              offsetY: 0,
              style: {
                fontSize: '16px',
                color: "#fff",
                background: "#FF4560"
              },
    
              text: String(Math.round(maxHydro*100)/100) + " TWh"
            }
          },
          {
            x: 3,
            y: maxRenewable,
            marker: {
              size: 0,
              fillColor: "transparent",
              strokeColor: "transparent",
              radius: 0
            },
            label: {
              borderColor: "#FF4560",
              offsetY: 0,
              style: {
                fontSize: '16px',
                color: "#fff",
                background: "#FF4560"
              },
    
              text: String(Math.round(maxRenewable*100)/100) + " TWh"
            }
          }
        ]
      },
      plotOptions:{
        bar:{
          distributed: false,
          columnWidth: "70%",
          dataLabels:{
              total: {
                  enabled: true,
                  offsetX: 50,
                  offsetY: -20,
                  style: {
                    color: "#373d3f",
                    fontSize: '13px',
                    fontWeight: 500
                  }
                },               
            orientation: "horizontal",
            position: "center",
          }
        }
      },
      dataLabels: {
      enabled: true,
        style:{
          //colors: ["black"],
          colors: ["white"],
          fontSize: "16px",
          fontWeight: 500
        },
        /*formatter: function(value, context) {
          return value  +  " TWh"
        },*/
        textAnchor: 'middle',
        offsetY: 0,
        offsetX: 0
      },
      
      stroke: {
        curve: 'smooth',
      },
      tooltip:{
        y:{
          formatter: function(val){
            return val + ' TWh'
          }
        }  
      },
      legend:{
        show: false,
      },
      title:{
        text: undefined,
        //text: installedCapacity[0].name,
        align: 'center',
        margin: 10,
        offsetX: 0,
        offsetY: -5,
        floating: true,
        style: {
        fontSize:  '18px',
        fontWeight:  'bold',
        fontFamily: 'Arial',
        color:  '#5F5F5F'
        }},
      grid: {
        row: {
          colors: ['none' ], // takes an array which will be repeated on columns
          opacity: 0.5
        },
        yaxis: {
          lines: {
              show: false
          }
      },  
      },
      xaxis: {
        axisBorder:{
          show: false
        },
        axisTicks:{
          show: false
        },
        labels:{
          show: false,
          style:{
              fontSize:"16px"
          }
        },
      },
      yaxis:{
          show: false,
          max: maxVal*1.05,
      }
  }

  

    return (
        <div>
            
              
                <ApexChart options={options} series={generationData}  type="bar" height={300} width="300px" />
              
                
                

                
           
                   
        </div>
    );
};