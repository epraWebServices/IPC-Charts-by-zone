import React, { useEffect, useState, useRef } from "react";

import { Bar } from "react-chartjs-2";
import {Modal} from "antd";
import moment from "moment";
import ApexChart from 'react-apexcharts'

const NetworkSimulationResultCharts = (props) => {

  let { processInput, marketGeneration, networkGeneration, zoneGeneration, networkDate} = props
  processInput = structuredClone(processInput)
  marketGeneration = structuredClone(marketGeneration)
  networkGeneration = structuredClone(networkGeneration)
  zoneGeneration = structuredClone(zoneGeneration)
  const [hourlyGenData, setHourlyGenData] = useState([])
  const CalenderDate = networkDate ? moment(networkDate._d) : null
  const [dates, setDates] = useState([])
  let generationBreakdownHeader = networkDate ? "Generation Breakdown (" + networkDate._d.toLocaleDateString("en-GB")+ ")": "Generation Breakdown"
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
  
  function getGenerationData(analysis, technology){
    let sum = 0
    if (analysis === 'Market'){
      marketGeneration.map((data)=>{
        sum += data[technology]
      }
      )
      return (sum).toFixed(2)
    }
    else if (analysis === 'Network'){
      networkGeneration.map((data)=>{
        sum += data[technology]
      }
      )
      return (sum).toFixed(2)
    }
  }
  const generation_labels = ['Market', 'Network']

  const generationOptions = {
    plugins: {
      title: {
        display: true,
        text: 'Total Generation',
        font:{size:18},
      },
      datalabels:{
        display: false
      },
      tooltip: {
        enabled: true,
        callbacks: {
            label: function(context) { 
                return context.dataset.label + ": " + context.dataset.data[context.dataIndex] + ' MWh';;
            }
        }
    },
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        title: {
          font:{size:14},
          display: true,
          text: "Total Generation (MWh)",
        },
      },
    },
  };
  
  const capacityOptions = {
    plugins: {
      title: {
        display: true,
        text: 'Capacity Factor',
        font:{size:18},
      },
      datalabels:{
        display: false
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
    marketCapacity.push((getGenerationData('Market', label) / (processInput[0].to_hour - processInput[0].from_hour + 1) / technology_capacity * 100).toFixed(2))
  })
  Object.keys(label_dic).map((label)=>{
    let technology_capacity = 0
    zoneGeneration.map((data)=>{
      technology_capacity += data[label]
    })
    networkCapacity.push((getGenerationData('Network', label) / (processInput[0].to_hour - processInput[0].from_hour + 1) / technology_capacity * 100).toFixed(2))
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
      categories:dates,
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
    horizontalAlign: 'left'
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
        offsetY: 0,
        floating: true,
        style: {
        fontSize:  '20px',
        fontWeight:  'bold',
        fontFamily: 'Arial',
        color:  '#263238'
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
}

useEffect(()=>{
  if(CalenderDate){
    let date = new Date(CalenderDate._d.getFullYear(),CalenderDate._d.getMonth(), CalenderDate._d.getDay()-1 )
    let d = []
    for(let i=0; i<24; i++){
      d.push(date.getTime() - date.getTimezoneOffset() * 60000 + i * 3600000)
    }
    var start = new Date(date.getFullYear(), 0, 0);
    var diff = date - start;
    var oneDay = 1000 * 60 * 60 * 24;
    var day = Math.floor(diff / oneDay);
    var hour_start = (day-1)*24 + 1
    var hour_end = day*24
    let x = []
    Object.keys(label_dic).map((label)=>{ 
    let hours = []
    let profile = []
    networkGeneration.map((e)=>{
      hours.push(e.hour)
      profile.push(e[label])
    })
  
    let a = hours.map((e,i) => (e >= hour_start &&  e<= hour_end)? i : undefined).filter(x => x!=undefined) 
    a.sort(function(b, c) {return b - c;});
  
    let profile_ordered = []
    for(let i=0; i<a.length; i+=9){
      let h = 0
      for(let j=0; j<9; j++){
        h += networkGeneration[i+j][label]
      }
      profile_ordered.push(h.toFixed(3))
    }

    x.push({name: label_dic[label], data:profile_ordered})
    setHourlyGenData(x)
    setDates(d)
  })
  }
  else{
    let f = new Date(processInput[0].base_year,0,processInput[0].from_hour)
    var userTimezoneOffset = f.getTimezoneOffset() * 60000;
    let date = new Date(f.getTime() - userTimezoneOffset) 
    var start = new Date(date.getFullYear(), 0, 0);
    var diff = date - start;
    var oneDay = 1000 * 60 * 60 * 24;
    var day = Math.floor(diff / oneDay);
    var hour_start = (day-1)*24 + 1
    var hour_end = day*24
    let x = []
    Object.keys(label_dic).map((label)=>{ 
    let hours = []
    let profile = []
    
    networkGeneration.map((e)=>{
      hours.push(e.hour)
      profile.push(e[label])
    })
    let d = []
    for(let i=0; i<hours.length/9; i++){
      d.push(date.getTime() + i * 3600000)
    }
    let a = hours.map((e,i) => (e)? i : undefined).filter(x => x!=undefined) 
    a.sort(function(b, c) {return b - c;});
  
    let profile_ordered = []
    for(let i=0; i<a.length; i+=9){
      let h = 0
      for(let j=0; j<9; j++){
        h += networkGeneration[i+j][label]
      }
      profile_ordered.push(h.toFixed(3))
    }
    x.push({name: label_dic[label], data:profile_ordered})
    setHourlyGenData(x)
    setDates(d)
  })
  }
  },[CalenderDate?.d])

  return (
    <div>
      <div className="card">
        <ApexChart options={hourly_gen_options} series={hourlyGenData} type="area" height={400} width="100%" />
      </div>
      <div className="card">
        <Bar options={generationOptions} data={generationData}></Bar>
      </div>
      <div className="card">
        <Bar options={capacityOptions} data={capacityData}></Bar>
      </div>
    </div>
   
  );
};

export default NetworkSimulationResultCharts;
