import React, { useState, useEffect, useRef } from 'react';
import { Chart } from "primereact/chart";
import { Divider } from 'primereact/divider';

import ApexChart from "react-apexcharts";
import ApexCharts from 'apexcharts';
import "./AnnualLoadChart.css"
import { Slider } from "antd";
import { Dropdown } from 'primereact/dropdown';
import { Col, Row } from 'antd/lib';
const MarketSimulationCharts = (props) => {
    const {label, color, generation_fleet_data2, dataForLine, annual_demand, peak_load} = props
    const [period, setPeriod] = useState("Yearly")
    const [visibleSeason, setVisibleSeason] = useState(false)
    const [visibleMonth, setVisibleMonth] = useState(false)
    const [visibleWeek, setVisibleWeek] = useState(false)
    const [visibleDay, setVisibleDay] = useState(false)
    const [basicOptions, setBasicOptions] = useState()
    const [chart, setChart] = useState()
    const chartRef = useRef()
    const [sliderMin, setSliderMin] = useState(0)
    const [sliderMax, setSliderMax] = useState(365)
    const [sliderRange, setSliderRange] = useState([0,365])
    const [isVisibleSlider, setIsVisibleSlider] = useState(true)
    const dropdownOptions = [{value:"Yearly", code:"yearly"},{value:"Seasonally", code:"seasonally"},{value:"Monthly", code:"monthly"},{value:"Weekly", code:"weekly"},{value:"Daily", code:"daily"}]
    const seasonDropdown = [{value:"Winter", code:1}, {value:"Spring", code:2}, {value:"Summer", code:3}, {value:"Fall", code:4}]
    const weekDropdown = [{value:"1", code:1}, {value:"2", code:2}, {value:"3", code:3}, {value:"4", code:4}, {value:"5", code:5}, {value:"6", code:6}, 
    {value:"7", code:7}, {value:"8", code:8}, {value:"9", code:9}, {value:"10", code:10}, {value:"11", code:11}, {value:"12", code:12}, {value:"13", code:13}]
    const [season, setSeason] = useState()
    const [week, setWeek] = useState()
    const [day, setDay] = useState()
    const monthDropdown = [
      {value:"January", code:1},
      {value:"February", code:2},
      {value:"March", code:3},
      {value:"April", code:4},
      {value:"May", code:5},
      {value:"June", code:6},
      {value:"July", code:7},
      {value:"August", code:8},
      {value:"September", code:9},
      {value:"October", code:10},
      {value:"November", code:11},
      {value:"December", code:12},
    ]
    const[dayDropdown, setDayDropdown] = useState([])
    const monthRange = {
      January: {min:0, max: 31, days:31},
      February: {min:31, max: 59, days:28},
      March: {min:59, max: 90, days:31},
      April: {min:90, max: 120, days:30},
      May: {min:120, max: 151, days:31},
      June: {min:151, max: 181, days:30},
      July: {min:181, max: 212, days:31},
      August: {min:212, max: 243, days:31},
      September: {min:243, max: 273, days:30},
      October: {min:273, max: 304, days:31},
      November: {min:304, max: 334, days:30},
      December: {min:334, max: 365, days:31},
    }
    const seasonRange = {
      Winter: {min:0, max: 90},
      Spring: {min:90, max: 181},
      Summer: {min:181, max: 273},
      Fall: {min:273, max: 365},
    }
    const [month, setMonth] = useState()
    

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
        setPeriod("Yearly")
        setVisibleSeason(false)
        setSeason()
        setVisibleMonth(false)
        setMonth()
        setVisibleWeek(false)
        setWeek()
        setVisibleDay(false)
        setDay()
        setIsVisibleSlider(true)
        setSliderMin(0)
        setSliderMax(365)
        setSliderRange([0,365])
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

    const changeZoom = (min,max) => {
      ApexCharts.exec(
        'annualLoad',
        'zoomX',
        min,
        max
      )
    }
    const changePeriod = (value) =>{
      setPeriod(value)
      if(value === "Yearly"){
        setVisibleSeason(false)
        setSeason()
        setVisibleMonth(false)
        setMonth()
        setVisibleWeek(false)
        setWeek()
        setVisibleDay(false)
        setDay()
        changeZoom(0,3600000*365*24)
        setIsVisibleSlider(true)
        setSliderMin(0)
        setSliderMax(365)
        setSliderRange([0,365])
      }
      if(value === "Seasonally"){
        setVisibleSeason(true)
        setIsVisibleSlider(false)
        setVisibleMonth(false)
        setVisibleWeek(false)
        setVisibleDay(false)
        setDay()
        setWeek()
        setMonth()
        setSeason()
      }
      if(value === "Monthly"){
        setVisibleSeason(false)
        setIsVisibleSlider(false)
        setVisibleMonth(true)
        setVisibleWeek(false)
        setVisibleDay(false)
        setDay()
        setSeason()
        setWeek()
        setMonth()
      }
      if(value === "Weekly"){
        setVisibleSeason(true)
        setIsVisibleSlider(false)
        setVisibleMonth(false)
        setVisibleWeek(true)
        setVisibleDay(false)
        setDay()
        setMonth()
        setSeason()
        setWeek()
      }
      if(value === "Daily"){
        setVisibleSeason(false)
        setIsVisibleSlider(false)
        setVisibleMonth(true)
        setVisibleWeek(false)
        setMonth()
        setSeason()
        setWeek()
        setDay()
        setVisibleDay(true)
      }
    }
    const changeSeason = (value) =>{
      setSeason(value)
      if(period !== "Seasonally"){
        setWeek()
      }
      setIsVisibleSlider(true)
      let seasonData = seasonRange[value]
      setSliderMin(seasonData.min)
      setSliderMax(seasonData.max)
      setSliderRange([seasonData.min,seasonData.max])
      changeZoom(seasonData.min*3600000*24,seasonData.max*3600000*24-3600000)


    }

    const changeMonth = (value) =>{
      setMonth(value)
      if(period === "Monthly"){
        setIsVisibleSlider(true)
        let monthData = monthRange[value]
        setSliderMin(monthData.min)
        setSliderMax(monthData.max)
        setSliderRange([monthData.min,monthData.max])
        changeZoom(monthData.min*3600000*24,monthData.max*3600000*24-3600000)
      }
      else{
        let dayOptions = []
        for(let i=1; i<=monthRange[value].days; i++){
          dayOptions.push({value: i, code: i})
        }
        setDayDropdown(dayOptions)
        setDay()
      }

    }
    const changeWeek = (value) =>{
      setIsVisibleSlider(true)
      let seasonData = seasonRange[season]
      setWeek(value)
      setSliderMin(seasonData.min + (value-1)*7)
      setSliderMax(seasonData.min+(value)*7)
      setSliderRange([seasonData.min + (value-1)*7,seasonData.min+(value)*7])
      changeZoom((seasonData.min + Number(value-1)*7)*3600000*24,(seasonData.min + Number(value)*7)*3600000*24-3600000)
    }
    const sliderRangeChange = (value) =>{
      setSliderRange(value)
      changeZoom(3600000*value[0]*24,3600000*value[1]*24-3600000)
    }
    const changeDay = (value) =>{
      setDay(value)
      changeZoom(3600000*(monthRange[month].min+Number(value-1))*24,3600000*(monthRange[month].min+Number(value))*24-3600000)
    }

      return (
        
        <div>
          <div className="card">
            <Chart
              data={chart}
              width="100%"
              height="300px"
              type="bar"
              options={basicOptions}
            />    
          </div>
        <div className="card">
        <Row>
          <Col span={24} style={{textAlign:"center"}}>
          <label>Period: </label>
          <Dropdown value={period} options={dropdownOptions} optionLabel="value" style={{width:"200px"}} onChange={(e)=> changePeriod(e.value)}></Dropdown><br></br>
          </Col>
        </Row>
        
        <br></br>
        <Row>
          <Col span={visibleWeek || visibleDay? 12 : 24} style={{textAlign:"center"}}>
            {visibleSeason && <div>
            <label>Season: </label>
            <Dropdown value={season} options={seasonDropdown} optionLabel="value" placeholder='Select Season' style={{width:"200px"}} onChange={(e)=> changeSeason(e.value)}></Dropdown>
          </div>}
          {visibleMonth && <div>
            <label>Month: </label>
            <Dropdown value={month} options={monthDropdown} optionLabel="value" placeholder='Select Month' style={{width:"200px"}} onChange={(e)=> changeMonth(e.value)}></Dropdown>
          </div>}
          </Col>
          <Col span={12} style={{textAlign:"center"}}>
          {visibleWeek && <div>
          <label>Week: </label>
          <Dropdown disabled={!season} value={week} options={weekDropdown} optionLabel="value" placeholder='Select Week' style={{width:"200px"}} onChange={(e)=> changeWeek(e.value)}></Dropdown>
        </div>}
        {visibleDay && <div>
          <label>Day: </label>
          <Dropdown disabled={!month} value={day} options={dayDropdown} optionLabel="value" placeholder='Select Day' style={{width:"200px"}} onChange={(e)=> changeDay(e.value)}></Dropdown>
        </div>}
          </Col>
        </Row>
        

        {isVisibleSlider&&<Slider range={{draggableTrack: true }} value={sliderRange} min={sliderMin} max={sliderMax} onChange={(e)=>sliderRangeChange(e)}/>}
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
        
        
    </div>  
                                
      )
  }
  export default MarketSimulationCharts




