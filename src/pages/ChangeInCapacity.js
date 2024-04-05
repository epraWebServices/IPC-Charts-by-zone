import { Panel } from "primereact/panel";
import React, {useEffect, useState} from "react";
import ApexChart from "react-apexcharts";
import "./IPCStyle.css"
export const ChangeInCapacity = () => {

  const installedCapacities = [{data: [4.6, 5.06, 5.46, 6.34, 7.33]}]
  let maxVal = Math.max(...installedCapacities[0].data)
  
  debugger

  const colors = ["#FADEEE", "#C8D6EE", "#F5C1C1", "#F2C096", "#ECCBF9"]  
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
    
    plotOptions:{
      bar:{
        distributed: true,
        columnWidth: "70%",
        dataLabels:{           
          orientation: "vertical",
          position: "center",

        }
      }
    },
    dataLabels: {
    enabled: true,
      style:{
        colors: ["black"],
        //colors: ["white"],
        fontSize: "20px",
        fontWeight: 500
      },
      formatter: function(value, context) {
        return value  +  " GW"
      },
      textAnchor: 'middle',
      offsetY: 0,
      offsetX: 0
    },
    
    stroke: {
      curve: 'smooth',
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
      categories: [2030,2035,2040,2045,2050],
      offsetY: -10,
      axisBorder:{
        show: false
      },
      axisTicks:{
        show: false
      },
      labels:{
        show: false,
      },
    },
    yaxis:{
      show: false,
      max: maxVal,
  }
}

  

    return (
        <div>
            
              
                <ApexChart options={options} series={installedCapacities}  type="bar" height={300} width="300px" />
              
                
                

                
           
                   
        </div>
    );
};