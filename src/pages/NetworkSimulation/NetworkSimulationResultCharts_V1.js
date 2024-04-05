import React, { useEffect, useState, useRef } from "react";
import { RadioButton } from "primereact/radiobutton";
import { Bar } from "react-chartjs-2";
import {Modal} from "antd";
import moment from "moment";
import ApexChart from 'react-apexcharts'
import grid from "antd/lib/grid";
import { ResponsiveBar } from '@nivo/bar'
import Chart from "react-apexcharts";

const NetworkSimulationResultCharts = (props) => {

  let { processInput, marketGeneration, networkGeneration, zoneGeneration, dates, resolution} = props
  processInput = structuredClone(processInput)
  marketGeneration = structuredClone(marketGeneration)
  networkGeneration = structuredClone(networkGeneration)
  zoneGeneration = structuredClone(zoneGeneration)

  let start_hour = null
  let end_hour = null
  let start_of_day = null
  let end_of_day = null
  if(resolution === "hourly"){
    start_hour = Math.floor((new Date(dates) - new Date(processInput[0].base_year,0,0)) / (1000 * 60 * 60)) -23
    end_hour = Math.floor((new Date(dates) - new Date(processInput[0].base_year,0,0)) / (1000 * 60 * 60)) -23
    start_of_day = Math.floor((new Date(new Date(dates).getFullYear(),new Date(dates).getMonth(), new Date(dates).getDate()-1) - new Date(processInput[0].base_year,0,0)) / (1000 * 60 * 60)) + 1
    end_of_day = Math.floor((new Date(new Date(dates).getFullYear(),new Date(dates).getMonth(), new Date(dates).getDate()) - new Date(processInput[0].base_year,0,0)) / (1000 * 60 * 60))
  }
  else if (resolution === "daily" && dates){
    start_hour = Math.floor((new Date(dates[0]) - new Date(processInput[0].base_year,0,0)) / (1000 * 60 * 60)) -23
    end_hour = Math.floor((new Date(dates[1]) - new Date(processInput[0].base_year,0,0)) / (1000 * 60 * 60))
  }
  else if (resolution === "monthly" && dates){
    start_hour = Math.floor((new Date(dates[0]) - new Date(processInput[0].base_year,0,0)) / (1000 * 60 * 60)) -23
    end_hour = Math.floor((new Date(new Date(dates[1]).getFullYear(), new Date(dates[1]).getMonth()+1, 0) - new Date(processInput[0].base_year,0,0)) / (1000 * 60 * 60))
  }
  else if (resolution === "seasonally" && dates){
    start_hour = Math.floor((new Date(dates[0]) - new Date(processInput[0].base_year,0,0)) / (1000 * 60 * 60)) -23
    end_hour = Math.floor((new Date(new Date(dates[1]).getFullYear(), new Date(dates[1]).getMonth()+3, 0) - new Date(processInput[0].base_year,0,0)) / (1000 * 60 * 60))
  }  
  else if (resolution === "yearly"){
    start_hour = 1
    end_hour = 8760
  }




  
  let generationBreakdownHeader = "Generation Breakdown"
  const label_dic = {
    nuclear: "Nuclear",
    pv: "Solar",
    wind: "Wind",
    hydro: "Hydro Dam",
    ror: "Hydro RoR",
    geothermal: "Geothermal",
    biomass: "Biomass",
    coal: "Local Coal",
    import_coal: "Import Coal",
    lignite: "Lignite",
    gas: "Natural Gas",
    other: "Other",
  }

  const color_dic = {
    nuclear: "#FF0000",
    pv: "#FFC000",
    wind: "#009900",
    hydro: "#6699FF",
    ror: "#33CCFF",
    geothermal: "#990099",
    biomass: "#F4B183",
    coal: "#767171",
    import_coal: "#000000",
    lignite: "#A6A6A6",
    gas: "#CC66FF",
    other: "#000099",
  }
  
  let hourlyGenData = []
  let dateLabels = new Array(networkGeneration.length/9).fill(0)

  Object.keys(label_dic).map((label)=>{
    let data = new Array(networkGeneration.length/9).fill(0)
    networkGeneration.map((generation) =>{
      data[generation.hour - 1] += Math.round(generation[label])
      dateLabels[generation.hour -1] = (generation.hour-1)*3600000
    })
    hourlyGenData.push({name: label_dic[label], data:data})
  })

  let min = 0
  let max = networkGeneration.length/9
  if(resolution==="hourly"){
    min = start_of_day-1
    max = end_of_day
  }
  else if(resolution!="yearly"){
    min = start_hour-1
    max = end_hour
  }
  hourlyGenData.map((data)=>{
    data.data = data.data.slice(min,max)
  })
  dateLabels = dateLabels.slice(min,max)
  function getGenerationData(analysis, technology){
    let sum = 0
    if (analysis === 'Market'){
      marketGeneration.map((data)=>{
        if(resolution==="hourly"){
          if(data.hour>=start_of_day && data.hour<=end_of_day){
            sum += data[technology]
          }
        }
        else{
          if(data.hour>=start_hour && data.hour<=end_hour){
            sum += data[technology]
          }
        }
      }
      )
      return (sum).toFixed(2)
    }
    else if (analysis === 'Network'){
      networkGeneration.map((data)=>{
        if(resolution==="hourly"){
          if(data.hour>=start_of_day && data.hour<=end_of_day){
            sum += data[technology]
          }
        }
        else{
          if(data.hour>=start_hour && data.hour<=end_hour){
            sum += data[technology]
          }
        }
      }
      )
      return (sum).toFixed(2)
    }
  }
  const generation_labels = ['Market', 'Network']

  const hourlyGenDataMajor = [
    {
      name: "Nuclear",
      data: hourlyGenData[0].data,
      color: "#FF0000"
    }
  ]
  const res = [];
  const hydro = [];
  const total_coal = [];
  const other = [];
  const natural_gas = [];
  for (let i=0;i<hourlyGenData[1].data.length;i++){
    res.push(hourlyGenData[1].data[i] + hourlyGenData[2].data[i])
    natural_gas.push(hourlyGenData[10].data[i])
    hydro.push(hourlyGenData[3].data[i] + hourlyGenData[4].data[i])
    other.push(hourlyGenData[5].data[i] + hourlyGenData[6].data[i] + hourlyGenData[11].data[i])
    total_coal.push(hourlyGenData[7].data[i] + hourlyGenData[8].data[i] + hourlyGenData[9].data[i])
  }

  hourlyGenDataMajor.push(
    { name: 'Hydro',
      data: hydro,
      color: "#6699FF"
    },
    {
      name: 'Renewables',
      data: res,
      color:"#009900"
    },
    {
      name: 'Total Coal',
      data: total_coal,
      color:"#767171"
    },
    {
      name: 'Natural Gas',
      data: natural_gas,
      color:"#CC66FF"
    },
    {
      name: 'Other',
      data: other,
      color:"#F4B183"
    },

  )
  
  const capacityOptions = {
    plugins: {
      legend:{
        display:true,
        labels:{
          usePointStyle: true,
          pointStyle: "cirle",
        }
      },
      title: {
        display: true,
        text: 'Capacity Factor',
        font:{size:18},
      },
      datalabels:{
        display: true,
        formatter: function(value, context) {
          return value 
        },
        anchor: 'end',
        align: 'end',
        offset: 0,
        colors: "#000000"
      },
      tooltip: {
        enabled: true,
        callbacks: {
            label: function(context) { 
                return context.dataset.label + ": " + context.dataset.data[context.dataIndex] + '%';;
            }
        }
    },
    },
    responsive: true,
    scales: {
      x: {
        
      },
      y: {
        grid:{
          display: false,
        },
        title: {
          font:{size:14},
          display: true,
          text: "Capacity Factor (%)",
        },
      },
    },
    
  };

  let genData = []
  Object.keys(label_dic).map((label)=>{
    
    genData.push({label: label_dic[label], data:[getGenerationData('Market', label), getGenerationData('Network', label)], backgroundColor:color_dic[label]})
  })

  let capData = []
  let marketCapacity = []
  let networkCapacity = []
  Object.keys(label_dic).map((label)=>{
    let technology_capacity = 0
    zoneGeneration.map((data)=>{
      technology_capacity += data[label]
    })
    marketCapacity.push((getGenerationData('Market', label) / (resolution==="hourly"? (end_of_day - start_of_day + 1) : (end_hour - start_hour + 1)) / technology_capacity * 100).toFixed(2))
  })
  Object.keys(label_dic).map((label)=>{
    let technology_capacity = 0
    zoneGeneration.map((data)=>{
      technology_capacity += data[label]
    })
    networkCapacity.push((getGenerationData('Network', label) / (resolution==="hourly"? (end_of_day - start_of_day + 1) : (end_hour - start_hour + 1)) / technology_capacity * 100).toFixed(2))
  })
  capData.push({label:'Market', data: marketCapacity, backgroundColor:"blue"})
  capData.push({label:'Network', data: networkCapacity, backgroundColor:"red"})
  
  const generationData = {
  labels: generation_labels,
  datasets: genData
  };
  const capacityData = {
    labels: Object.values(label_dic),
    datasets: capData
    };

    

  const hourly_gen_options = 
  {
    chart: {
    type: 'area',
    height: 400,
    stacked: true,
    toolbar: {
      tools:{
        download: false
      }
    },
    animations:{
      enabled: false
    }
    },
    xaxis:{
      type:"datetime",
      categories:dateLabels,
      labels: {
        datetimeFormatter: {
          year: 'yyyy',
          month: 'MMM',
          day: 'dd MMM',
          hour: 'HH:mm'
        },
        style:{
          colors: "rgb(71, 71, 71)"
        }
      },
    },
    colors: Object.values(color_dic),
    dataLabels: {
    enabled: false
    },
    stroke: {
    curve: 'smooth',
    width: 2
    },
    fill: {
    type: 'gradient',
    gradient: {
        opacityFrom: 0.8,
        opacityTo: 1,
    }
    },
    legend: {
    position: 'bottom',
    horizontalAlign: 'left',
    },

    /*
    xaxis: {
    type: 'datetime',
    labels: {
        format: 'dd/MM/yyyy'
    },
    
    max: new Date(date.split('T')[0]).getTime() + 24*60*60*1000,
    min: new Date(date.split('T')[0]).getTime()
    }
    ,
    */
    yaxis: {
        title:{
            text:"MWh",
            style: {
                fontSize:  '14px',
                fontWeight:  'normal',
                color:  '#263238',
                fontFamily: 'Arial'
            },
        },
        min:0
    },
    title: {
        text: generationBreakdownHeader,
        align: 'center',
        margin: 10,
        offsetX: 0,
        offsetY: -5,
        floating: true,
        style: {
        fontSize:  '18px',
        fontWeight:  'bold',
        fontFamily: 'Arial',
        color:  '#5f5f5f'
        },
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: function(value, { series, seriesIndex, dataPointIndex, w }) {
          return value + " MWh"
        }
      },
      x: {
        formatter: function(value, { series, seriesIndex, dataPointIndex, w }) {
          let f = new Date(value)
          var userTimezoneOffset = f.getTimezoneOffset() * 60000;
          let d = new Date(f.getTime() + userTimezoneOffset) 
          return (d.getDate().toString().length==2?d.getDate().toString():"0"+d.getDate().toString()) + " " + (d.toLocaleString('en-GB', { month: 'short' })) +" "+(d.getHours().toString().length==2?d.getHours().toString():"0"+d.getHours().toString()) + ":00"
        }
      }

    },
};
  
    var series=[
    {
    name: generationData.datasets[0].label,
    data:[((generationData.datasets[0].data[0]/1000).toFixed(2)).toString(), ((generationData.datasets[0].data[1]/1000).toFixed(2)).toString()],
    },
    {
      name: generationData.datasets[1].label, 
      data:[((generationData.datasets[1].data[0]/1000).toFixed(2)).toString(), ((generationData.datasets[1].data[1]/1000).toFixed(2)).toString()]
    },
    {
      name: generationData.datasets[2].label, 
      data:[((generationData.datasets[2].data[0]/1000).toFixed(2)).toString(), ((generationData.datasets[2].data[1]/1000).toFixed(2)).toString()] 
    },
    {
      name: generationData.datasets[3].label, 
      data:[((generationData.datasets[3].data[0]/1000).toFixed(2)).toString() , ((generationData.datasets[3].data[1]/1000).toFixed(2)).toString()] 
    },
    {
      name: generationData.datasets[4].label, 
      data:[((generationData.datasets[4].data[0]/1000).toFixed(2)).toString() , ((generationData.datasets[4].data[1]/1000).toFixed(2)).toString()] 
    },
    {
      name: generationData.datasets[5].label, 
      data:[((generationData.datasets[5].data[0]/1000).toFixed(2)).toString() , ((generationData.datasets[5].data[1]/1000).toFixed(2)).toString()] 
    },
    {
      name: generationData.datasets[6].label, 
      data:[((generationData.datasets[6].data[0]/1000).toFixed(2)).toString(), ((generationData.datasets[6].data[1]/1000).toFixed(2)).toString()] 
    },
    {
      name: generationData.datasets[7].label, 
      data:[((generationData.datasets[7].data[0]/1000).toFixed(2)).toString() , ((generationData.datasets[7].data[1]/1000).toFixed(2)).toString()] 
    },
    {
      name: generationData.datasets[8].label, 
      data:[((generationData.datasets[8].data[0]/1000).toFixed(2)).toString() , ((generationData.datasets[8].data[1]/1000).toFixed(2)).toString()] 
    },
    {
      name: generationData.datasets[9].label,
      data:[((generationData.datasets[9].data[0]/1000).toFixed(2)).toString(), ((generationData.datasets[9].data[1]/1000).toFixed(2)).toString()] 
    },
    {
      name: generationData.datasets[10].label, 
      data:[((generationData.datasets[10].data[0]/1000).toFixed(2)).toString() , ((generationData.datasets[10].data[1]/1000).toFixed(2)).toString()] 
    },
    {
      name: generationData.datasets[11].label, 
      data:[((generationData.datasets[11].data[0]/1000).toFixed(2)).toString() , ((generationData.datasets[11].data[1]/1000).toFixed(2)).toString()] 
    }]


    var seriesMajor=[
      {
      name: 'Nuclear',
      data:[((generationData.datasets[0].data[0]/1000).toFixed(2)).toString() , ((generationData.datasets[0].data[1]/1000).toFixed(2)).toString()],
      color: "#FF0000"
      },
      {
        name: 'Hydro', 
        data:[(((generationData.datasets[3].data[0]/1000) + (generationData.datasets[4].data[0]/1000)).toFixed(2)).toString() , (((generationData.datasets[3].data[1]/1000) + (generationData.datasets[4].data[1]/1000)).toFixed(2)).toString()],
        color: "#6699FF" 
      },
      {
        name: 'Renewables', 
        data:[(((generationData.datasets[1].data[0]/1000) + (generationData.datasets[2].data[0]/1000)).toFixed(2)).toString() , (((generationData.datasets[1].data[1]/1000) + (generationData.datasets[2].data[1]/1000)).toFixed(2)).toString()],
        color: "#009900"
      },
      {
        name: 'Total Coal', 
        data:[(((generationData.datasets[7].data[0]/1000) + (generationData.datasets[8].data[0]/1000) + (generationData.datasets[9].data[0]/1000)).toFixed(2)).toString() , (((generationData.datasets[7].data[1]/1000) + (generationData.datasets[8].data[1]/1000) + (generationData.datasets[9].data[1]/1000)).toFixed(2)).toString()],
        color: "#767171"
      },
      {
        name: 'Natural Gas', 
        data:[((generationData.datasets[10].data[0]/1000).toFixed(2)).toString()  , ((generationData.datasets[10].data[1]/1000).toFixed(2)).toString()],
        color: "#CC66FF"
      },
      {
        name: 'Other', 
        data:[((((generationData.datasets[5].data[0]/1000) + (generationData.datasets[6].data[0]/1000) + (generationData.datasets[11].data[0]/1000)).toFixed(2))).toString() , ((((generationData.datasets[5].data[1]/1000) + (generationData.datasets[6].data[1]/1000) + (generationData.datasets[11].data[1]/1000)).toFixed(2))).toString()],
        color: "#F4B183"
      },
      
      ]

    var series1=[
      {
      name: generationData.datasets[0].label,
      data:[((generationData.datasets[0].data[0]/1000000).toFixed(2)).toString(), ((generationData.datasets[0].data[1]/1000000).toFixed(2)).toString()],
      },
      {
        name: generationData.datasets[1].label, 
        data:[((generationData.datasets[1].data[0]/1000000).toFixed(2)).toString(), ((generationData.datasets[1].data[1]/1000000).toFixed(2)).toString()]
      },
      {
        name: generationData.datasets[2].label, 
        data:[((generationData.datasets[2].data[0]/1000000).toFixed(2)).toString(), ((generationData.datasets[2].data[1]/1000000).toFixed(2)).toString()] 
      },
      {
        name: generationData.datasets[3].label, 
        data:[((generationData.datasets[3].data[0]/1000000).toFixed(2)).toString() , ((generationData.datasets[3].data[1]/1000000).toFixed(2)).toString()] 
      },
      {
        name: generationData.datasets[4].label, 
        data:[((generationData.datasets[4].data[0]/1000000).toFixed(2)).toString() , ((generationData.datasets[4].data[1]/1000000).toFixed(2)).toString()] 
      },
      {
        name: generationData.datasets[5].label, 
        data:[((generationData.datasets[5].data[0]/1000000).toFixed(2)).toString() , ((generationData.datasets[5].data[1]/1000000).toFixed(2)).toString()] 
      },
      {
        name: generationData.datasets[6].label, 
        data:[((generationData.datasets[6].data[0]/1000000).toFixed(2)).toString(), ((generationData.datasets[6].data[1]/1000000).toFixed(2)).toString()] 
      },
      {
        name: generationData.datasets[7].label, 
        data:[((generationData.datasets[7].data[0]/1000000).toFixed(2)).toString() , ((generationData.datasets[7].data[1]/1000000).toFixed(2)).toString()] 
      },
      {
        name: generationData.datasets[8].label, 
        data:[((generationData.datasets[8].data[0]/1000000).toFixed(2)).toString() , ((generationData.datasets[8].data[1]/1000000).toFixed(2)).toString()] 
      },
      {
        name: generationData.datasets[9].label,
        data:[((generationData.datasets[9].data[0]/1000000).toFixed(2)).toString(), ((generationData.datasets[9].data[1]/1000000).toFixed(2)).toString()] 
      },
      {
        name: generationData.datasets[10].label, 
        data:[((generationData.datasets[10].data[0]/1000000).toFixed(2)).toString() , ((generationData.datasets[10].data[1]/1000000).toFixed(2)).toString()] 
      },
      {
        name: generationData.datasets[11].label, 
        data:[((generationData.datasets[11].data[0]/1000000).toFixed(2)).toString() , ((generationData.datasets[11].data[1]/1000000).toFixed(2)).toString()] 
      }]

      
      var seriesMajor1=[
        {
        name: 'Nuclear',
        data:[((generationData.datasets[0].data[0]/1000000).toFixed(2)).toString() , ((generationData.datasets[0].data[1]/1000000).toFixed(2)).toString()],
        color: "#FF0000"
        },
        {
          name: 'Hydro', 
          data:[(((generationData.datasets[3].data[0]/1000000) + (generationData.datasets[4].data[0]/1000000)).toFixed(2)).toString() , (((generationData.datasets[3].data[1]/1000000) + (generationData.datasets[4].data[1]/1000000)).toFixed(2)).toString()],
          color:"#6699FF"
        },
        {
          name: 'Renewables', 
          data:[(((generationData.datasets[1].data[0]/1000000) + (generationData.datasets[2].data[0]/1000000)).toFixed(2)).toString() , (((generationData.datasets[1].data[1]/1000000) + (generationData.datasets[2].data[1]/1000000)).toFixed(2)).toString()],
          color: "#009900"
        },
        {
          name: 'Total Coal', 
          data:[(((generationData.datasets[7].data[0]/1000000) + (generationData.datasets[8].data[0]/1000000) + (generationData.datasets[9].data[0]/1000000)).toFixed(2)).toString() , (((generationData.datasets[7].data[1]/1000000) + (generationData.datasets[8].data[1]/1000000) + (generationData.datasets[9].data[1]/1000000)).toFixed(2)).toString()],
          color: "#767171" 
        },
        {
          name: 'Natural Gas', 
          data:[((generationData.datasets[10].data[0]/1000000).toFixed(2)).toString()  , ((generationData.datasets[10].data[1]/1000000).toFixed(2)).toString()],
          color: "#CC66FF" 
        },
        {
          name: 'Other', 
          data:[((((generationData.datasets[5].data[0]/1000000) + (generationData.datasets[6].data[0]/1000000) + (generationData.datasets[11].data[0]/1000000)).toFixed(2))).toString() , ((((generationData.datasets[5].data[1]/1000000) + (generationData.datasets[6].data[1]/1000000) + (generationData.datasets[11].data[1]/1000000)).toFixed(2))).toString()],
          color: "#F4B183"

        },
        
        ]

    const maxAxis= Math.max(series[0].data[0],series[0].data[1]) +  Math.max(series[1].data[0],series[1].data[1]) + Math.max(series[2].data[0],series[2].data[1]) + Math.max(series[3].data[0],series[3].data[1]) + Math.max(series[4].data[0],series[4].data[1]) + Math.max(series[5].data[0],series[5].data[1]) + Math.max(series[6].data[0],series[6].data[1]) + Math.max(series[7].data[0],series[7].data[1]) + Math.max(series[8].data[0],series[8].data[1]) + Math.max(series[9].data[0],series[9].data[1]) + Math.max(series[10].data[0],series[10].data[1]) + Math.max(series[11].data[0],series[11].data[1])
    const maxAxis1 = Math.max(series1[0].data[0],series1[0].data[1]) +  Math.max(series1[1].data[0],series1[1].data[1]) + Math.max(series1[2].data[0],series1[2].data[1]) + Math.max(series1[3].data[0],series1[3].data[1]) + Math.max(series1[4].data[0],series1[4].data[1]) + Math.max(series1[5].data[0],series1[5].data[1]) + Math.max(series1[6].data[0],series1[6].data[1]) + Math.max(series1[7].data[0],series1[7].data[1]) + Math.max(series1[8].data[0],series1[8].data[1]) + Math.max(series1[9].data[0],series1[9].data[1]) + Math.max(series1[10].data[0],series1[10].data[1]) + Math.max(series1[11].data[0],series1[11].data[1])
    const maxAxisMajor = Math.max(seriesMajor[0].data[0],seriesMajor[0].data[1]) +  Math.max(seriesMajor[1].data[0],seriesMajor[1].data[1]) + Math.max(seriesMajor[2].data[0],seriesMajor[2].data[1]) + Math.max(seriesMajor[3].data[0],seriesMajor[3].data[1]) + Math.max(seriesMajor[4].data[0],seriesMajor[4].data[1]) + Math.max(seriesMajor[5].data[0],seriesMajor[5].data[1])
    const maxAxisMajor1 = Math.max(seriesMajor1[0].data[0],seriesMajor1[0].data[1]) + Math.max(seriesMajor1[1].data[0],seriesMajor1[1].data[1]) + Math.max(seriesMajor1[2].data[0],seriesMajor1[2].data[1]) + Math.max(seriesMajor1[3].data[0],seriesMajor1[3].data[1]) + Math.max(seriesMajor1[4].data[0],seriesMajor1[4].data[1]) + Math.max(seriesMajor1[5].data[0],seriesMajor1[5].data[1])

    
  var totalgenOptions = {
      chart:{
        type:'bar',
        height: 350,
        stacked: true,
      },
      colors: Object.values(color_dic),
      plotOptions:{
        bar:{
          horizontal: true,
          dataLabels: {
            total:{
              enabled:true,
              offsetX:0,
              style:{
                fontSize:'13px',
                fontWeight:900
              }
            }
          }
        },
      },
      stroke:{
        width:1,
        colors:['#fff']
      },
      title:{
        text: 'Total Generation',
        align: 'center',
        margin: 10,
        offsetX: 0,
        offsetY: -5,
        floating: true,
        style: {
        fontSize:  '18px',
        fontWeight:  'bold',
        fontFamily: 'Arial',
        color:  '#5f5f5f'
        },

      },
      xaxis:{
        categories:['Market','Network'],
        
        max: maxAxis  ,
        labels:{
          formatter: function(val){
            return Math.round(val) + 'GWh'
          }
        }
      },
      yaxis:{
        title:{
          text: undefined
        }
      },
      tooltip:{
        y:{
          formatter: function(val){
            return val + 'GWh'
          }
        }  
      },
      fill:{
        opacity: 1
      },
      legend:{
        position:'bottom',
        horizontalAlign:'left',
        markers:{
          radius:12
        }
        
      }
  };
  var totalgenOptionsMajor = {
    chart:{
      type:'bar',
      height: 350,
      stacked: true,
    },
    colors: Object.values(color_dic),
    plotOptions:{
      bar:{
        horizontal: true,
        dataLabels: {
          total:{
            enabled:true,
            offsetX:0,
            style:{
              fontSize:'13px',
              fontWeight:900
            }
          }
        }
      },
    },
    stroke:{
      width:1,
      colors:['#fff']
    },
    title:{
      text: 'Total Generation',
      align: 'center',
      margin: 10,
      offsetX: 0,
      offsetY: -5,
      floating: true,
      style: {
      fontSize:  '18px',
      fontWeight:  'bold',
      fontFamily: 'Arial',
      color:  '#5f5f5f'
      },

    },
    xaxis:{
      categories:['Market','Network'],
      
      max: maxAxisMajor  ,
      labels:{
        formatter: function(val){
          return Math.round(val) + 'GWh'
        }
      }
    },
    yaxis:{
      title:{
        text: undefined
      }
    },
    tooltip:{
      y:{
        formatter: function(val){
          return val + 'GWh'
        }
      }  
    },
    fill:{
      opacity: 1
    },
    legend:{
      position:'bottom',
      horizontalAlign:'left',
      markers:{
        radius:12
      }
      
    }
};

  var totalgenOptions1 = {
    chart:{
      type:'bar',
      height: 350,
      stacked: true,
    },
    colors: Object.values(color_dic),
    plotOptions:{
      bar:{
        horizontal: true,
        dataLabels: {
          total:{
            enabled:true,
            offsetX:0,
            style:{
              fontSize:'13px',
              fontWeight:900
            }
          }
        }
      },
    },
    stroke:{
      width:1,
      colors:['#fff']
    },
    title:{
      text: 'Total Generation',
      align: 'center',
      margin: 10,
      offsetX: 0,
      offsetY: -5,
      floating: true,
      style: {
      fontSize:  '18px',
      fontWeight:  'bold',
      fontFamily: 'Arial',
      color:  '#5f5f5f'
      },

    },
    xaxis:{
      categories:['Market','Network'],
      min: 0,
      max: maxAxis1  ,
      labels:{
        formatter: function(val){
          return Math.round(val)+ 'GWh'
        }
      }
    },
    yaxis:{
      title:{
        text: undefined
      }
    },
    tooltip:{
      y:{
        formatter: function(val){
          return val + 'GWh'
        }
      }  
    },
    fill:{
      opacity: 1
    },
    legend:{
      position:'bottom',
      horizontalAlign:'left',
      markers:{
        radius:12
      }
      
    }
  };
  var totalgenOptionsMajor1 = {
    chart:{
      type:'bar',
      height: 350,
      stacked: true,
    },
    colors: Object.values(color_dic),
    plotOptions:{
      bar:{
        horizontal: true,
        dataLabels: {
          total:{
            enabled:true,
            offsetX:0,
            style:{
              fontSize:'13px',
              fontWeight:900
            }
          }
        }
      },
    },
    stroke:{
      width:1,
      colors:['#fff']
    },
    title:{
      text: 'Total Generation',
      align: 'center',
      margin: 10,
      offsetX: 0,
      offsetY: -5,
      floating: true,
      style: {
      fontSize:  '18px',
      fontWeight:  'bold',
      fontFamily: 'Arial',
      color:  '#5f5f5f'
      },

    },
    xaxis:{
      categories:['Market','Network'],
      
      max: maxAxisMajor1  ,
      labels:{
        formatter: function(val){
          return Math.round(val) + 'TWh'
        }
      }
    },
    yaxis:{
      title:{
        text: undefined
      }
    },
    tooltip:{
      y:{
        formatter: function(val){
          return val + 'TWh'
        }
      }  
    },
    fill:{
      opacity: 1
    },
    legend:{
      position:'bottom',
      horizontalAlign:'left',
      markers:{
        radius:12
      }
      
    }
  };

  const nuclearmajorMarket = capacityData.datasets[0].data[0];
  const nuclearmajorNetwork = capacityData.datasets[1].data[0];
  const resmajorMarket = (Number(capacityData.datasets[0].data[1]) + Number(capacityData.datasets[0].data[2])).toString();
  const resmajorNetwork = (Number(capacityData.datasets[1].data[1]) + Number(capacityData.datasets[1].data[2])).toString();
  const coalmajorMarket = (Number(capacityData.datasets[0].data[7]) + Number(capacityData.datasets[0].data[8]) + Number(capacityData.datasets[0].data[9])).toString();
  const coalmajorNetwork = (Number(capacityData.datasets[1].data[7]) + Number(capacityData.datasets[1].data[8]) + Number(capacityData.datasets[1].data[9])).toString();
  const othermajorMarket = (Number(capacityData.datasets[0].data[5]) + Number(capacityData.datasets[0].data[6]) + Number(capacityData.datasets[0].data[11])).toString();
  const othermajorNetwork = (Number(capacityData.datasets[1].data[5]) + Number(capacityData.datasets[1].data[6]) + Number(capacityData.datasets[1].data[11])).toString();
  const hydromajorMarket = (Number(capacityData.datasets[0].data[3]) + Number(capacityData.datasets[0].data[3])).toString();
  const hydromajorNetwork = (Number(capacityData.datasets[1].data[4]) + Number(capacityData.datasets[1].data[4])).toString();

  
  const capacityDataMajor = {
    labels: ["Nuclear" , "Hydro DAM" , "Solar" , "Wind", "Import Coal" , "Lignite" , "Natural Gas"],
    datasets: [{label: 'Market' , data: [capacityData.datasets[0].data[0] , capacityData.datasets[0].data[3] , capacityData.datasets[0].data[1] , capacityData.datasets[0].data[2] , capacityData.datasets[0].data[8] , capacityData.datasets[0].data[9] , capacityData.datasets[0].data[10]] , backgroundColor: "blue"}, {label: 'Network' , data: [capacityData.datasets[1].data[0] , capacityData.datasets[1].data[3] , capacityData.datasets[1].data[1] , capacityData.datasets[1].data[2] , capacityData.datasets[1].data[8] , capacityData.datasets[1].data[9] , capacityData.datasets[1].data[10]] , backgroundColor: "red"}]
  }



  const [choice, setChoice] = useState('all');
  return (
    <div>
      <div style={{alignItems:"center", display:"flex", justifyContent:"center", fontSize:"14px", marginTop:"10px"}}>
          <div className="card flex justify-content-center">
              <div className="flex flex-wrap gap-6">
                  <div className="flex align-items-center">
                      <RadioButton inputId="all" name="all" value="all" onChange={(e) => setChoice(e.value)} checked={choice === 'all'} />
                      <label htmlFor="all" className="ml-2">All Technologies</label>
                  </div>
                  <div className="flex align-items-center">
                    <RadioButton inputId="major" name="major" value="major" onChange={(e) => setChoice(e.value)} checked={choice === 'major'} />
                    <label htmlFor="major" className="ml-2">Major Technologies</label>
                  </div>
              </div>
            </div>
          </div>
        
      <div className="card">
        { choice === "all" && <ApexChart options={hourly_gen_options} series={hourlyGenData} type="area" height={400} width="100%" /> }
        { choice === "major" && <ApexChart options={hourly_gen_options} series={hourlyGenDataMajor} type="area" height={400} width="100%" /> }
      </div>
      <div className="card">
        {resolution == "hourly" && choice == "all" && 
        <ApexChart options={totalgenOptions} series={series}  type="bar" height={400} width="100%" />
        }
        {resolution != "hourly" && choice == "all" &&
        <ApexChart options={totalgenOptions1} series={series1}  type="bar" height={400} width="100%" />
        }
        {resolution == "hourly" && choice == "major" && 
        <ApexChart options={totalgenOptionsMajor} series={seriesMajor}  type="bar" height={400} width="100%" />
        }
        {resolution != "hourly" && choice == "major" &&
        <ApexChart options={totalgenOptionsMajor1} series={seriesMajor1}  type="bar" height={400} width="100%" />
        }
      </div>
      <div className="card">
        {choice === "all" && <Bar options={capacityOptions} data={capacityData}></Bar>}
        {choice === "major" && <Bar options={capacityOptions} data={capacityDataMajor}></Bar> }
      </div>
    </div>
   
  );
};

export default NetworkSimulationResultCharts;
