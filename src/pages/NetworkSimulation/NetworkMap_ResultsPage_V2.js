
import {Marker, MapContainer, TileLayer, Tooltip, Polygon, Circle, Polyline, useMapEvents, Popup, useMap, CircleMarker} from "react-leaflet";
import 'leaflet/dist/leaflet.css'
import "react-leaflet-fullscreen/dist/styles.css";
import 'leaflet-arrowheads'
import React, {memo, useEffect, useState, useRef, ReactDOMServer } from "react";
import { Dialog } from 'primereact/dialog';
import 'antd/dist/antd.css';
import * as L from "leaflet";
import "leaflet-polylinedecorator";
import './iconStyle.css'
import "leaflet/dist/leaflet.css";
import { Button } from "primereact/button";
import Chart from 'react-apexcharts';
import moment from "moment";
import { Chart as Chart1 } from 'primereact/chart';
import { DivIcon } from "leaflet";
import {Card} from "primereact/card";
import './warningIcon.css';
import './Hover.css'

const NetworkMap = (props) => {
  const {zoneResult, dates, resolution, processInput, busResults, lineResult, networkGeneration, lineLoadingResult} = props
  const [areaChartData, setAreaChartData] = useState()
  const [lineChartData, setLineChartData] = useState([])
  const [lineChart2Data, setLineChart2Data] = useState([])
  const BusData = structuredClone(require('./BusData_V1.json'))
  const LineData = structuredClone(require('./LineData_V1.json'))
  const [visible, setVisible] = useState(false)
  const [visibleLineResult, setVisibleLineResult] = useState(false)
  const [dialogHeader, setDialogHeader] = useState("")
  const [lineResultDialogHeader, setLineResultDialogHeader] = useState("")
  const [dateLabels, setdateLabels] = useState([])
  const [overloadedLines, setOverloadedLines] = useState([])
  const [visibleLineLoadingMap, setVisibleLineLoadingMap] = useState(false)
  const [lineName, setLineName] = useState("")
  const [lineId, setLineId] = useState(1)

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


  const lineMapOptions = {
    1: {
      center: [40,31],
      zoom: 7
    },
    2: {
      center: [39,31],
      zoom: 7
    },
    3: {
      center: [39,28],
      zoom: 7
    },
    4: {
      center: [39,29],
      zoom: 7
    },
    5: {
      center: [40,32],
      zoom: 7
    },
    6: {
      center: [40,28],
      zoom: 7
    },
    7: {
      center: [39,40],
      zoom: 7
    },
    8: {
      center: [40,39],
      zoom: 7
    },
    9: {
      center: [38.5,34],
      zoom: 7
    },
    10: {
      center: [38.5,31],
      zoom: 7
    },
    11: {
      center: [40,35],
      zoom: 7
    },
    12: {
      center: [38.5,35],
      zoom: 7
    },
    13: {
      center: [38.5,37],
      zoom: 7
    },
    14: {
      center: [38,37],
      zoom: 7
    },
    15: {
      center: [38,31.5],
      zoom: 7
    },
    16: {
      center: [37.5,33.5],
      zoom: 7
    },
  }

  var warningIcon = new DivIcon({
    className:"WarningIcon",
    iconSize:[30,30]
  })
  var warningIcon1 = new DivIcon({
    className:"WarningIcon1",
    iconSize:[30,30]
  })
  var warningIcon2 = new DivIcon({
    className:"WarningIcon2",
    iconSize:[30,30]
  })
  function PolylineDecorator({ patterns, polyline, pathOptions}) {
    const map = useMap();
    let line = L.polyline(polyline, pathOptions).addTo(map);
    let x = L.polylineDecorator(polyline, {
      patterns
    })
    line.on("click",function(e) {
      lineResultDialog(pathOptions.data)
    })
    x.on("click",function(e) { 
      lineResultDialog(pathOptions.data)
    })
    x.addTo(map);
    return null;
  }
  function PolylineDecorator2({ patterns, polyline, pathOptions}) {
    const map = useMap();
    let line = L.polyline(polyline, pathOptions).addTo(map);
    let x = L.polylineDecorator(polyline, {
      patterns
    })
    x.addTo(map);
    
    return null;
  }
  function ResetArrows({}) {
    const map = useMap();
    map.eachLayer((layer)=>{
      if((layer.options.patterns && layer.options.patterns[0].className === "LineArrow") || layer.options.className === "TransmissionLine"){
        map.removeLayer(layer)
      }
    })
    
    return null;
  }

  const lineResultDialog = (lineData) =>{
    setLineResultDialogHeader(lineData.from + " -> " + lineData.to)
    setVisibleLineResult(true)
    let data = []
    let dataLoading = []
    let resultDate = []
    lineResult.map((result)=>{
      if(result.line_id === lineData.id && resolution==="hourly" && result.hour>=start_of_day && result.hour <= end_of_day){
        data.push(result.energy.toFixed(2))
        dataLoading.push(result.loading.toFixed(2))
        resultDate.push((result.hour-1)*3600000)
      }
      else if(result.line_id === lineData.id && resolution!=="hourly" && result.hour>=start_hour && result.hour <= end_hour){
        data.push(result.energy.toFixed(2))
        dataLoading.push(result.loading.toFixed(2))
        resultDate.push((result.hour-1)*3600000)
      }
    })

    let loadings = []
    lineLoadingResult.map((result)=>{
      if(resolution==="hourly" && result.hour === start_hour && result.from_region_id === lineData.from_id && result.to_region_id ===lineData.to_id){
        loadings.push(result)
      }
    })
    setLineChartData([
      {
        name: 'Energy Transferred',
        data: data,
      }
    ])
    setLineChart2Data([      
      {
      name: 'Loading',
      data: dataLoading,
      }
    ])
    setdateLabels(resultDate)
    setOverloadedLines(loadings)
    setLineName(lineData.name)
    setLineId(lineData.id)
  }

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


  

const LineLoadingIcon = (loading) => {
  const icon = new L.DivIcon({
  className: 'LineLoadingIcon',
  iconSize: [40,40],
  html: `<svg width="40px" height="40px" viewBox="0 0 40 40" className="donut" aria-labelledby="beers-title beers-desc" role="img">
  <circle className="donut-hole" cx="20" cy="20" r="20" fill="white" role="presentation"></circle>
  <circle className="donut-ring" cx="20" cy="20" r="20" fill="transparent" stroke="#d2d3d4" strokeWidth="3" role="presentation"></circle>
  <circle className="donut-segment" cx="20" cy="20" r="20" fill="transparent" stroke="#ce4b99" strokeWidth="3" strokeDasharray="${loading} ${100 - loading}" strokeDashoffset="25" aria-labelledby="donut-segment-1-title donut-segment-1-desc">
  </circle>
  <g className="chart-text">
    <text className="chart-number" x="40" y="40" dy="-15" dx="-20" text-anchor="middle">
      ${loading + "%"}
    </text>
  </g>
</svg>`
  
  })
  return icon
}

const LineLoadingIcon2 = (loading) => {
  const icon = new L.DivIcon({
  className: 'LineLoadingIcon',
  iconSize: [30,30],
  html: `<svg width="30px" height="30px" viewBox="0 0 30 30" className="donut" aria-labelledby="beers-title beers-desc" role="img">
  <circle className="donut-hole" cx="15" cy="15" r="15" fill="white" role="presentation"></circle>
  <circle className="donut-ring" cx="15" cy="15" r="15" fill="transparent" stroke="#d2d3d4" strokeWidth="3" role="presentation"></circle>
  <circle className="donut-segment" cx="15" cy="15" r="15" fill="transparent" stroke="#ce4b99" strokeWidth="3" strokeDasharray="${loading} ${100 - loading}" strokeDashoffset="25" aria-labelledby="donut-segment-1-title donut-segment-1-desc">
  </circle>
  <g className="chart-text">
    <text className="chart-number" x="30" y="30" dy="-10" dx="-15" text-anchor="middle">
      ${loading + "%"}
    </text>
  </g>
</svg>`
  
  })
  return icon
}

const areaChartOptions = {
  chart: {
  type: 'area',
  height: 400,
  stacked: true,
  toolbar: {
    tools:{
      download: false
    }
    
  },
  animations: {
    enabled: false
  }
  },
  xaxis:{
    type:"datetime",
    categories:dateLabels,
    title:{
      text:"date",
      style: {
          fontSize:  '14px',
          fontWeight:  'normal',
          color:  '#263238',
          fontFamily: 'Arial'
      },
      //offsetY:70
    }
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
      text: "Generation Breakdown",
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


const lineChartOptions = {
  chart: {
  type: 'line',
  height: 400,
  toolbar: {
    tools:{
      download: false
    }
    
  },
  animations: {
    enabled: false
  }
  },
  xaxis:{
    type:"datetime",
    categories:dateLabels,
    title:{
      text:"date",
      style: {
          fontSize:  '14px',
          fontWeight:  'normal',
          color:  '#263238',
          fontFamily: 'Arial'
      },
    },
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
    //offsetY:70,
  },
  dataLabels: {
  enabled: false
  },
  stroke: {
  curve: 'smooth',
  width: 2
  },
  fill: {
  type: 'solid',

  },

  yaxis: {
    title:{
        text:"Energy Transferred (MW)",
        style: {
            fontSize:  '14px',
            fontWeight:  'normal',
            color:  '#263238',
            fontFamily: 'Arial'
        },
    },
  },
  title: {
      text: "Energy Transferred Through Time",
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
        return value + " MW"
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
const lineChart2Options = {
  chart: {
  type: 'line',
  height: 400,
  toolbar: {
    tools:{
      download: false
    }
  },
  animations: {
    enabled: false
  }
  },
  xaxis:{
    type:"datetime",
    categories:dateLabels,
    title:{
      text:"date",
      style: {
          fontSize:  '14px',
          fontWeight:  'normal',
          color:  '#263238',
          fontFamily: 'Arial'
      },
    },
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
    //offsetY:70,
  },
  dataLabels: {
  enabled: false
  },
  stroke: {
  curve: 'smooth',
  width: 2
  },
  fill: {
  type: 'solid',

  },

  yaxis: {
    title:{
        text:"Loading (%)",
        style: {
            fontSize:  '14px',
            fontWeight:  'normal',
            color:  '#263238',
            fontFamily: 'Arial'
        },
    },
  },
  title: {
      text: "Loading of the Cooridor",
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
        return value + " %"
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
const BusContext = (zoneId, zoneName) =>{
  setDialogHeader(zoneName)
  let x = []
  let y = []
  Object.keys(label_dic).map((label)=>{
    let profile = []
    networkGeneration.map((row)=>{
      if(resolution!=="hourly" && row.zoneId === zoneId && row.hour>=start_hour && row.hour<=end_hour){
        profile.push(row[label])
        y.push((row.hour-1) * 3600000)
      }
      else if(resolution==="hourly" && row.zoneId === zoneId && row.hour>=start_of_day && row.hour<=end_of_day){
        profile.push(row[label])
        y.push((row.hour-1) * 3600000)
      }
    })
    x.push({name: label_dic[label], data:profile})
    
  })
  setdateLabels(y)
  setAreaChartData(x)
  setVisible(true)
}

let lineLoadings = new Array(16).fill(null)
for (let i=0; i<lineLoadings.length; i++){
  if(start_hour){
    lineResult.map((result)=>{
      if(result.hour === start_hour && result.line_id === i+1){
        lineLoadings[i] = result.loading
      }
    })
}}
let overloaded = new Array(16).fill(null)
for (let i=0; i<lineLoadings.length; i++){
  if(start_hour){
    lineResult.map((result)=>{
      if(result.hour === start_hour && result.line_id === i+1){
        overloaded[i] = result.overloadedLine
      }
    })
}}
const  toptooltipid = [1,2,5,8,9,11,14,15,16]
const lefttooltipid = [3,4,6,10,12,13]

  return (
    <div>
    <div style={{paddingTop:"5px"}}>
        <div style={{ height: "90vh", width: "99%", marginBottom: "-70px" }}>
            <MapContainer
              center={[39.55, 34.55]} 
              zoom={7} 
              doubleClickZoom={false}
              style={{ height: '100%', width: "100%" , marginTop:"-30px" , marginLeft:"-10px"}}
              dragging={true}
              zoomControl = {true}
              attributionControl={false}
              //maxZoom={7}
              //minZoom={7}
            >
            <TileLayer
              url='https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png'
              //url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              //url='https://api.tiles.mapbox.com/v4/mapbox.light/{z}/{x}/{y}.png'
              //attribution= '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              noWrap = {true}
            />
            
            <ResetArrows/>
            {BusData.buses.map((data) => {
              let curtailment = 0
              let renewable_generation = 0
              let redispatch_up = 0
              let redispatch_down = 0
              let load = 0
              let generation = 0
              zoneResult.map((e)=>{
                if(start_hour && end_hour){
                  if(e.zone_id === data.id && start_hour<= e.hour && e.hour<= end_hour){
                    curtailment += e.curtailment
                    redispatch_up += e.redispatch_up
                    redispatch_down += e.redispatch_down
                    load += e.load
                    generation += e.generation
                  } 
                }
              })
              networkGeneration.map((e) => {
                if(start_hour && end_hour){
                  if(e.zoneId == data.id && start_hour <= e.hour && e.hour <= end_hour){
                    renewable_generation += e.pv + e.wind 
                  }
                }
              })

              if(["yearly", "seasonally" ,"monthly"].includes(resolution)){
                curtailment /= 1e6
                redispatch_up /= 1e6
                renewable_generation /= 1e6
                redispatch_down /= 1e6
                load /= 1e6
                generation /= 1e6
              }
              const bardata = []
              const backgroundColorConfig =[]
              
              const labelConfig = []


            
              if(busResults.includes("load")){
                bardata[0] = load.toFixed(2)
                backgroundColorConfig[0] = 'rgb(43, 84, 154)'
                labelConfig[0] = 'Load'
              }
              if(busResults.includes("generation")){
                bardata[1] = generation.toFixed(2)
                backgroundColorConfig[1] = 'rgb(104,40,96)'
                labelConfig[1] = 'Generation'
              }
              if(busResults.includes("curtailment")){
                bardata[0] = curtailment.toFixed(2)
                backgroundColorConfig[0]  = 'rgb(43, 84, 154)'
                labelConfig[0] = 'Curtailment'
              }
              if(busResults.includes("renewable_generation")){
                bardata[1] = renewable_generation.toFixed(2)
                backgroundColorConfig[1]  = 'rgb(104,40,96)'
                labelConfig[1] = 'Renewable Generation'
              }
              if(busResults.includes("redispatch_up")){
                bardata[0] = redispatch_up.toFixed(2)
                backgroundColorConfig[0]  = 'rgb(43, 84, 154)'
                labelConfig[0] = 'Redispatch Up'
              }
              if(busResults.includes("redispatch_down")){
                bardata[1] = redispatch_down.toFixed(2)
                backgroundColorConfig[1] = 'rgb(104,40,96)'
                labelConfig[1] = 'Redispatch Down'
              }

              let widthConfig = 120 + bardata.length * 25;

             
                const options1 = {
                  maintainAspectRatio: false,
                  aspectRatio: 10,
                  plugins:{
                    datalabels: {
                      font:{
                        weight: 1000

                      },
                      color:"#ffffff",
                      formatter:
                       function(value, context) {
                        return Math.round(value*100)/100
                      },
                      anchor: 'start',
                      align: 'end',
                      offset: 0
                    },
                    legend:{
                      display:false
                    },
                    tooltip:{
                      enabled: true
                    }
                  },
                  
                
                  scales: {
                    x: {
                        ticks: {
                            display:false,
                            font: {
                                weight: 500
                            }
                        },
                        grid: {
                            display: false,
                            drawBorder: false
                        }
                    },
                    y: {
                        ticks: {
                            display:false,
                        },
                        grid: {
                            display:false,
                            drawBorder: false
                        }
                    }
                  }
                }

            
              return(
                <div>
                  <CircleMarker center={data.center} radius={20} 
                    className="hvr-float"
                    data= {data}
                    pathOptions={{
                    color: "rgb(150, 0, 0)",
                    weight: 3,
                    fillColor: "red",
                    fillOpacity: 1,
                    }}
                    zIndex={9999}
                    pane={"markerPane"}
                    eventHandlers={{
                      click: () => BusContext(data.id, data.name)
                    }}
                  >
                  {busResults.length !== 0 && ((resolution ==="hourly" && dates) || (resolution !=="hourly" && dates && dates.length) || resolution=="yearly") &&<Tooltip direction="top" offset={[0,-7]} height="1000" permanent  className="ZoneResult">
                      <Chart1 type="bar" 
                        height="100"
                        width= {widthConfig}
                        options={options1}
                        data = {{
                        labels: labelConfig,
                        datasets: [
                            {
                                label: '',
                                data: bardata,
                                backgroundColor: backgroundColorConfig,
                                borderWidth: 0
                            },
                        ]
                      }}
                      />
                    </Tooltip>
                  }
                  </CircleMarker>
                </div>)
            })}
            {LineData.lines.map((data) => {
              if(resolution==="hourly" && dates){
                let arrow = [
                  {
                    offset: "0%",
                    repeat: 100,
                    className: "LineArrow",
                    symbol: L.Symbol.arrowHead({
                      pixelSize: 10,
                      polygon: false,
                      pathOptions: { 
                        stroke: true, 
                        fillOpacity:"1", 
                        color: lineLoadings[data.id-1]>lineLoadings[data.id-1]>80? "red": (overloaded[data.id-1]? "orange" : "gray"),
                      }
                    }),
                  }
                ];

                return(
                  <div>
                    <PolylineDecorator 
                    patterns={arrow} 
                    polyline= {lineLoadings[data.id-1] >=0 ? data.coordinates : [data.coordinates[1], data.coordinates[0]]}
                    pathOptions={{color:lineLoadings[data.id-1]>80? "red": (overloaded[data.id-1]? "orange" : "gray"), weight:"3",  className:"TransmissionLine", data:data}}/>
                    <Marker icon={LineLoadingIcon(Math.abs(lineLoadings[data.id-1]).toFixed())} position={data.resultLabelCoordinate} eventHandlers={{click: () => lineResultDialog(data)}}></Marker>
                    {overloaded[data.id-1] && toptooltipid.includes(data.id) &&<Marker
                      icon={warningIcon}
                      position={data.resultLabelCoordinate}>
                      <Tooltip   direction="top" offset={[0,-35]}> There is an overloaded line.
                      </Tooltip>
                    </Marker>}
                    {overloaded[data.id-1] && lefttooltipid.includes(data.id) &&<Marker
                      icon={warningIcon1}
                      position={data.resultLabelCoordinate}>
                      <Tooltip  direction="top" offset={[-36,0]}> There is an overloaded line.
                      </Tooltip>
                    </Marker>}
                    {overloaded[data.id-1] && data.id == 7 &&<Marker
                      icon={warningIcon2}
                      position={data.resultLabelCoordinate}>
                      <Tooltip  direction="top" offset={[36,0]}> There is an overloaded line.
                      </Tooltip>
                    </Marker>}
                  </div>
                )
              }
              else{
                return(
                  <Polyline positions={[data.coordinates[1], data.coordinates[0]]} pathOptions={{color:"gray", weight:"3"}} eventHandlers={{click: () => lineResultDialog(data)}}></Polyline>
                )
              }
              
            })}
            
          </MapContainer>
          <Dialog visible={visible} header={dialogHeader} onHide={()=>{setVisible(false)}} style={{width:"55%", height:"550px"}}>
            <Chart options={areaChartOptions} series={areaChartData} type="area" height={400} width="100%" />
          </Dialog>
          <Dialog visible={visibleLineResult} header={lineResultDialogHeader} onHide={()=>{setVisibleLineResult(false)}} style={{width:"55%", height:"60%"}}>
            <Chart options={lineChartOptions} series={lineChartData} type="line" height={400} width="100%" />
            <Chart options={lineChart2Options} series={lineChart2Data} type="line" height={400} width="100%" />
            <div style={{textAlign:"center"}}>
              {overloadedLines.length >0 && <Button label="Show Overloaded Lines on the Map" className="p-button-help" onClick={()=>{setVisibleLineLoadingMap(true)}}></Button>}
            </div>
            
            {resolution==="hourly" && <Dialog visible={visibleLineLoadingMap} header={"Overloaded Lines betweeen " + lineName + " at " + moment(new Date(dates)).format("DD/MM/YYYY HH:00")} onHide={()=>{setVisibleLineLoadingMap(false)}} style={{width:"50%", height:"70%"}}>
            <MapContainer
              center={lineMapOptions[lineId].center} 
              zoom={lineMapOptions[lineId].zoom} 
              doubleClickZoom={false}
              style={{ height: '100%', width: "100%"}}
              dragging={true}
              zoomControl = {true}
              attributionControl={false}
              //maxZoom={7}
              //minZoom={7}
            >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              //url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              //url='https://api.tiles.mapbox.com/v4/mapbox.light/{z}/{x}/{y}.png'
              //attribution= '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              noWrap = {true}
            />
            {overloadedLines.map((line)=>{
              let arrow = [
                {
                  offset: "10%",
                  repeat: 100,
                  className: "LineArrow",
                  symbol: L.Symbol.arrowHead({
                    pixelSize: 10,
                    polygon: false,
                    pathOptions: { 
                      stroke: true, 
                      fillOpacity:"1", 
                      color: "black",
                    }
                  }),
                }
              ];
              return(
                <div>
                  <PolylineDecorator2   
                  patterns={arrow} 
                  polyline= {line.loading >=0 ?[[line.from_x, line.from_y], [line.to_x, line.to_y]] : [[line.to_x, line.to_y], [line.from_x, line.from_y]]}
                  pathOptions={{color:"black", weight:"3",  className:"TransmissionLine"}}/>
                  <Marker icon={LineLoadingIcon2(Math.abs(line.loading).toFixed())} position={[(line.from_x + line.to_x)/2, (line.from_y + line.to_y)/2]}></Marker>
                </div>
              )
            })}
            </MapContainer>
            </Dialog>}
          </Dialog>
        </div>  
    </div>        
  </div>  
  );
}
export default memo(NetworkMap)