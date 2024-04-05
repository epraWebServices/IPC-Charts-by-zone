import { Panel } from "primereact/panel";
import React, {useEffect, useState} from "react";
import ApexChart from "react-apexcharts";
import "./IPCStyle.css"
export const IPCCharts1 = () => {

    const maxVal = 12.5
    let capacityData = [[1.33, 0, 0, 0],[0.45, 0, 0, 0],[1.81, 0, 0, 0],[0.13, 0, 0, 0],[0, 0, 0.96, 0],[0, 0, 2.01, 0],[0, 2.29, 0, 0],[0, 2.1, 0, 0],[0, 0, 0, 0],[0, 0, 0, 0],[0, 0, 0.06, 0]]





    const installedCapacity = [
        {
          data: capacityData[0],
          name: "Gas"
        },
        {
          data: capacityData[1],
          name: "Lignite"
        },
        {
          data: capacityData[2],
          name: "Import Coal"},
        {
          data: capacityData[3],
          name: "Coal"},
        {
          data: capacityData[4],
          name: "Wind"
        },
        {
          data: capacityData[5],
          name: "PV"
        },
        {
          data: capacityData[6],
          name: "Hydro"
        },
        {
          data: capacityData[7],
          name: "RoR"
        },
        {
          data: capacityData[8],
          name: "Nuclear"
        },
        {
          data: capacityData[9],
          name: "Geothermal"
        },
        {
          data: capacityData[10],
          name: "Biomass"
        },
    ];
    let maxConventional = 0
    let maxHydro = 0
    let maxRenewable = 0
    let maxNuclear = 0
    for(let i=0; i<installedCapacity.length; i++){
      maxConventional += installedCapacity[i].data[0]
      maxHydro += installedCapacity[i].data[1]
      maxRenewable += installedCapacity[i].data[2]
      maxNuclear += installedCapacity[i].data[3]
    }
    
    debugger



    const colors = ["#CC66FF", "#A6A6A6", "#000000", "#767171", "#009900", "#FFC000", "#6699FF", "#33CCFF", "#FF0000", "#990099", "#F4B183"]
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
      
                text: String(Math.round(maxConventional*100)/100) + " GW"
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
      
                text: String(Math.round(maxHydro*100)/100) + " GW"
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
      
                text: String(Math.round(maxRenewable*100)/100) + " GW"
              }
            },
            {
              x: 4,
              y: maxNuclear,
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
      
                text: String(Math.round(maxNuclear*100)/100) + " GW"
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
            return value  +  " GW"
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
              return val + ' GW'
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

          
          <ApexChart options={options} series={installedCapacity}  type="bar" height={400} width="400px" />  
        </div>
    );
};