import React, { useEffect, useState, useRef } from "react";
import { Panel } from "primereact/panel";
import { Dropdown as Dropdown1 } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";
import moment from "moment";
import { useParams } from "react-router-dom";
import { ProcessService } from "../../service/ProcessService";
import {Button as Button1} from 'primereact/button';
import { Toast } from 'primereact/toast';
import NetworkSimulationResultCharts from "./NetworkSimulationResultCharts_V1"
import { apiPath } from "../../environments/ApiPath";
import { Row, Col, Select, Button, DatePicker, Tag, Dropdown} from 'antd';
import { Divider } from 'antd';
import NetworkMap from "./NetworkMap_ResultsPage_V2";
import NetworkSimulationContingencyResult from "./NetworkSimulationContingencyResult";
import NetworkCongestionHoursResult from "./NetworkCongestionHoursResult";
import { Accordion, AccordionTab } from "primereact/accordion";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProgressSpinner } from "primereact/progressspinner";
import {Tooltip} from "react-leaflet";
import { height } from "@mui/system";
import './style.css'
import {Card} from "primereact/card"
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { RadioButton } from "primereact/radiobutton";
import "./App.css";
import ApexChart from "react-apexcharts";
import { ConsoleIcon } from "evergreen-ui";
import {Bar} from "react-chartjs-2";

const NetworkSimulationResults = (props) => {
  const processService = new ProcessService()
  let { id } = useParams()
  const [document,setDocument] =useState(null)
  const [processInput, setProcessInput] = useState(null)
  const [processName, setProcessName] = useState(null)
  const [processType, setProcessType] = useState(null)
  const [zoneResult, setZoneResult] = useState(null)
  const [lineResult, setLineResult] = useState(null)
  const [marketGeneration, setMarketGeneration] = useState(null)
  const [networkGeneration, setNetworkeneration] = useState(null)
  const [lineCapacities, setLineCapacities] = useState(null)
  const [lineLoadingResult, setLineLoadingResult] = useState(null)
  const [contingencyDefinition, setContingencyDefinition] = useState()
  const [contingencyResult, setContingencyResult] = useState()
  const [congestionHoursResult , setCongestionHoursResult] = useState()
  const [zoneGeneration, setZoneGeneration] = useState(null)
  const [visible, setVisible] = useState(false)
  const [visibleContingencyDialog, setVisibleContingencyDialog] = useState(false)
  const [visibleCongestionHoursDialog, setVisibleCongestionHoursDialog] = useState(false)
  const [resolution, setResolution] = useState("yearly")
  const [dates, setDates] = useState([])
  const [date, setDate] = useState()
  const [loading, setLoading] = useState(true)
  const toastBR = useRef(null);
  const [sorttype , setSortType] = useState("totalgen");
  const [zoneName , setZoneName] = useState("All Zones")
  const [generationType , setGenerationType] = useState("biomass")

  const [busOptions, setBusOptions] = useState([
    {label: "Load (TWh)", value: "load"}, 
    {label: "Generation (TWh)", value: "generation"}, 
    
  ])
  const [busOptions1, setBusOptions1] = useState([
    {label: "Curtailment (TWh)", value: "curtailment"},
    {label: "RenewableGeneration (TWh)", value: "renewable_generation"} 
    
    
  ])
  const [busOptions2, setBusOptions2] = useState([
    {label: "Redispatch Up (TWh)", value: "redispatch_up"}, 
    {label: "Redispatch Down (TWh)", value: "redispatch_down"}, 
    
  ])
  const [busOptionsMwh, setBusOptionsMwh] = useState([
    {label: "Load (MWh)", value: "load"}, 
    {label: "Generation (MWh)", value: "generation"}, 
    
  ])
  const [busOptions1Mwh, setBusOptions1Mwh] = useState([
    {label: "Curtailment (MWh)", value: "curtailment"},
    {label: "RenewableGeneration (MWh)", value: "renewable_generation"} 
    
    
  ])
  const [busOptions2Mwh, setBusOptions2Mwh] = useState([
    {label: "Redispatch Up (MWh)", value: "redispatch_up"}, 
    {label: "Redispatch Down (MWh)", value: "redispatch_down"}, 
    
  ])
  const [busResults, setBusResults] = useState(["load", "generation"])
  const { RangePicker } = DatePicker;
  const colors = {
    "load": "rgb(43, 84, 154)",
    "generation": "rgb(104,40,96)",
    "curtailment": "rgb(43, 84, 154)",
    "renewable_generation":"rgb(104,40,96)",
    "redispatch_up": "rgb(43, 84, 154)",
    "redispatch_down": "rgb(104,40,96)",
  }
  useEffect(() => {
    
    const loadData = async () => {
      
      const res = await processService.getNWProcessById(id);
      if (res.success) {
        debugger
        setProcessInput(res.object.inputs)
        setProcessName(res.object.processName)
        setProcessType(res.object.processType)
        setZoneResult(res.object.zoneResults)
        setLineResult(res.object.lineResult)
        setLineLoadingResult(res.object.lineLoadingResult)
        setMarketGeneration(res.object.marketGeneration)
        setNetworkeneration(res.object.networkGeneration)
        setLineCapacities(res.object.lineCapacities)
        setZoneGeneration(res.object.zoneGeneration)
        setContingencyDefinition(res.object.contingencyDefinition)
        setCongestionHoursResult(res.object.congestionHoursResult)
        setContingencyResult(res.object.contingencyResult)
        setLoading(false)
        const documentList = res.object.documentList;
        if(documentList){
            const documentData = documentList[0];
            setDocument(documentData)
        }
      }else{
        alert("Bu hata oluştu, admin ile iletişime geçiniz : "+res.message)
      }

    }
    loadData();
  }, [id]);
  
  const getDocument = async () => {
 
     if(document && document.documentId)
     {
       window.open(apiPath.API_BASE_PATH + "/document/download/"+ document.documentId)
     }
     else{
       alert("Document could not found! Please contact the admin.")
     }
 
   } 
   

  

  

   dayjs.extend(customParseFormat);



   let f = new Date(processInput && processInput[0].base_year, 0, 1);
   var userTimezoneOffset = f.getTimezoneOffset() * 60000;
   let startDate = new Date(f.getTime() - userTimezoneOffset) 
   const disabledDate = (e) => {
    let f = new Date(e._d)
    var userTimezoneOffset = f.getTimezoneOffset() * 60000;
    let date = new Date(f.getTime() - userTimezoneOffset) 
    var diff = date - startDate;
    var oneDay = 1000 * 60 * 60 * 24;
    return diff/oneDay < 0 || diff/oneDay >= processInput[0].to_hour / 24 
  }
  const tagRender = (props) => {
    const { label, value, closable, onClose } = props;
    const onPreventMouseDown = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };
  
    return (
      <Tag
        color={colors[value]}
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{ marginRight: 3 }}
      >
        {label}
      </Tag>
    );
  };

  const items = [
    {
      key: '1',
      label: (
        <div onClick={() => setVisible(true)}>
          Total Generation And Capacity Factor Results
        </div>
      ),
    },
    {
      type: 'divider',
    },
    /*{
      key: '2',
      label: (
        <div onClick={() => setVisibleContingencyDialog(true)}>
          Contingency Results
        </div>
      ),
    },
    {
      type: 'divider',
    },
    */
    {
      key: '3',
      label: (
        <div onClick={() => setVisibleCongestionHoursDialog(true)}>
          Line Congestion Hour Results
        </div>
      ),
    },
  ];
  let date1 = processInput ? moment(new Date(processInput[0].base_year,0,1,processInput[0].from_hour - 1)).format('DD/MM/YYYY') : ""
  let date2 = processInput ? moment(new Date(processInput[0].base_year,0,1,processInput[0].to_hour - 1)).format('DD/MM/YYYY') : ""
  const zoneBodyTemplate = (data) => {
    return <b>{data.zoneName}</b>
  };
  let resolutionOptions = [
    {value: "hourly", label:"Hourly"},
    {value: "daily", label:"Daily"},
    {value: "monthly", label:"Monthly"},
    {value: "seasonally", label:"Seasonally"},
    {value: "yearly", label:"Yearly"}
  ]
  let sortOptions = [
    {value: "totalgen" , label: "The Summary of Turkey Generation Types"},
    {value: "datatable" , label:"Datatable"},
    {value: "zone", label: "Zone Based"},
    {value: "generation", label: "Generation Based"},
  ]
   let generationOptions = [
    {value:"biomass" , label:"Biomass"},
    {value:"entsoe" , label:"ENTSOE"},
    {value:"georgia" , label:"Georgia"},
    {value:"geothermal" , label:"Geothermal"},
    {value:"coal" , label:"Local Coal"},
    {value:"hydro" , label:"Hydro"},
    {value:"ror" , label:"RoR"},
    {value:"import_coal" , label:"Import Coal"},
    {value:"lignite" , label:"Lignite"},
    {value:"gas" , label:"Natural Gas"},
    {value:"nuclear" , label:"Nuclear"},
    {value:"other" , label:"Other"},
    {value:"pv" , label:"Solar"},
    {value:"wind" , label:"Wind"}
   
   ]




  const changeResolution = (resolution)=>{
    setResolution(resolution)
    setDate()
    setDates([])
    
  }

  const changeSortType = (sorttype)=>{
    setSortType(sorttype)
  }

  const changeZone = (zoneName)=>{
    setZoneName(zoneName)
  }
  const changeGenerationType = (generationType) =>{
    setGenerationType(generationType)
  }


  const [visible1, setVisible1] = useState(false);
  const [selectData, setSelectData] =useState('loadgeneration');

  function MyFunc(e){
    if(e.value === 'loadgeneration'){
      setBusResults(["load" , "generation"])
      setSelectData(e.value) 
    }
    if(e.value === 'curtailment'){
      setBusResults(["curtailment" , "renewable_generation"])
      setSelectData(e.value) 
    }
    if(e.value === 'redispatchupdown'){
      setBusResults(["redispatch_up" , "redispatch_down"])
      setSelectData(e.value) 
    }
    

    
  }
  
  const [isShown , setIsShown] =useState(false);
  function changeBackground(e){
    e.target.style.background = 'grey';
    
  }
  function changeBackground1(e){
    e.target.style.background = 'royalblue';
    
  }


  const zoneGeneration_test = JSON.parse(JSON.stringify(zoneGeneration))


 //let zoneNames = [ zoneGeneration[1].zoneName ]



 const zoneNames = ["All Zones"];
 zoneGeneration?.map((data)=>{
  zoneNames.push(data?.zoneName)
 })

 zoneGeneration_test?.map((data) =>{
  delete data.zone_id
  delete data.consumption
  delete data.zoneName
 })


 const series = [];

 for(let i=0;i<zoneGeneration_test?.length;i++){
  series[i]={
    name: zoneNames[i+1],
    data: Object.values(zoneGeneration_test[i]),
  }
 }

  


 const seriesbyzone = [];
 for(let i=0;i<series.length;i++){
  if(series[i].name === zoneName){
    seriesbyzone.push(series[i])
  }
 }
debugger
 
  for(let i = 0;i<seriesbyzone[0]?.data.length ; i++){
    if(seriesbyzone[0].data[i] === null){
      seriesbyzone[0].data[i] = "null"
    }
  }
  for(let i = 0;i<seriesbyzone[0]?.data.length ; i++){
    if(seriesbyzone[0].data[i] === "null"){
      seriesbyzone[0].data.splice(i,1)
      i --;
    }
  }




 

  const xaxislabel = [];

  for(let i=0 ;i<zoneGeneration?.length; i++){
    if(zoneGeneration[i].zoneName === zoneName){
      if(zoneGeneration[i].biomass !== null ){
        xaxislabel.push("Biomass")
      }
      if(zoneGeneration[i].entsoe !== null){
        xaxislabel.push("ENTSOE")
      }
      if(zoneGeneration[i].georgia !== null){
        xaxislabel.push("Georgia")
      }
      if(zoneGeneration[i].geothermal !== null){
        xaxislabel.push("Geothermal")
      }
      if(zoneGeneration[i].coal !== null){
        xaxislabel.push("Local Coal")
      }
      if(zoneGeneration[i].hydro !== null){
        xaxislabel.push("Hydro")
      }
      if(zoneGeneration[i].ror !== null){
        xaxislabel.push("RoR")
      }
      if(zoneGeneration[i].import_coal !== null){
        xaxislabel.push("Import Coal")
      }
      if(zoneGeneration[i].lignite !== null){
        xaxislabel.push("Lignite")
      }
      if(zoneGeneration[i].gas !== null){
        xaxislabel.push("Natural Gas")
      }
      if(zoneGeneration[i].nuclear !== null){
        xaxislabel.push("Nuclear")
      }
      if(zoneGeneration[i].other !== null){
        xaxislabel.push("Other")
      }
      if(zoneGeneration[i].pv !== null){
        xaxislabel.push("Solar")
      }
      if(zoneGeneration[i].wind !== null){
        xaxislabel.push("Wind")
      }
    }
  }
  const xaxiscolor = [];

  for(let i=0 ;i<zoneGeneration?.length; i++){
    if(zoneGeneration[i].zoneName === zoneName){
      if(zoneGeneration[i].biomass !== null  ){
        xaxiscolor.push("#f4b183")
      }
      if(zoneGeneration[i].entsoe !== null ){
        xaxiscolor.push("#3c2268")
      }
      if(zoneGeneration[i].georgia !== null ){
        xaxiscolor.push("#449a48")
      }
      if(zoneGeneration[i].geothermal !== null ){
        xaxiscolor.push("#990099")
      }
      if(zoneGeneration[i].coal !== null ){
        xaxiscolor.push("#767171")
      }
      if(zoneGeneration[i].hydro !== null ){
        xaxiscolor.push("#6699ff")
      }
      if(zoneGeneration[i].ror!== null ){
        xaxiscolor.push("#33ccff")
      }
      if(zoneGeneration[i].import_coal !== null ){
        xaxiscolor.push("#000000")
      }
      if(zoneGeneration[i].lignite !== null ){
        xaxiscolor.push("#A6A6A6")
      }
      if(zoneGeneration[i].gas !== null ){
        xaxiscolor.push("#CC66FF")
      }
      if(zoneGeneration[i].nuclear !== null ){
        xaxiscolor.push("#FF0000")
      }
      if(zoneGeneration[i].other !== null ){
        xaxiscolor.push("#000099")
      }
      if(zoneGeneration[i].pv !== null ){
        xaxiscolor.push("#FFC000")
      }
      if(zoneGeneration[i].wind!== null ){
        xaxiscolor.push("#009900")
      }
      
    }
  }

  const test = [];
  let datakk = [];
  for (let i= 0;i<zoneGeneration?.length ; i++) {
   if(zoneGeneration[i].zoneName === zoneName){
     datakk = i
   }
  }

  /*for(let i = 0 ; i<xaxiscolor.length ; i++){
    if(xaxiscolor[i] === "1"){
      xaxiscolor.splice(i,1);
      i -- ;
    }
  }
*/
  
  

  
  
  
  


  var options = {
  chart: {
    id:"tw",
    group:"social",
    height: 350,
    type: 'line',
    zoom: {
      enabled: false
    }
  },
  colors: ["#e3342f" , "#f6993f" , "#ffed4a" , "#38c172" , "#4dc0b5" , "#3490dc" , "#6574cd" , "#9561e2" , "#f66d9b"],
  dataLabels: {
    enabled: false,
    formatter: function(value, context) {
      return value  +  " MW"
    },
    offsetY: -30
  },
  stroke: {
    width: 2,
    curve: 'smooth',
    dashArray: [5,5,5,5,5,5,5,5,5]
  },
  tooltip:{
    y:{
      formatter: function(val){
        if(val !== null){
          return val + ' MW'
        }
        
      }
    }  
  },
  markers: {
    size:8
  },
  title:{
    text: 'Distribution of Different Types of Generation by Zone',
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
      colors: ['#f3f3f3'], // takes an array which will be repeated on columns
      opacity: 0.5
    },
  },
  xaxis: {
    categories: ["Biomass" , "ENTSOE" , "Georgia" , "Geothermal" , "Local Coal" , "Hydro" , "RoR" , "Import Coal", "Lignite" , "Natural Gas" , "Nuclear" , "Other" , "Solar" , "Wind"],
  }
}

  var options1 =  {
  chart: {
    height: 350,
    type: 'bar',
    zoom: {
      enabled: false
    },
    dropShadow:{
      enabled:false
    }
  },
  colors: xaxiscolor,
  plotOptions:{
    bar:{
      distributed: true,
      dataLabels:{
        orientation: "horizontal",
        position: "top"
      }
    }
  },
  dataLabels: {
    style:{
      colors: ["#5F5F5F"]
    },
    formatter: function(value, context) {
      return value  +  " MW"
    },
    offsetY : -20
     

  },
  stroke: {
    curve: 'smooth',
  },
  tooltip:{
    y:{
      formatter: function(val){
        return val + ' MW'
      }
    }  
  },
  legend:{
    show: false,
  },
  title:{
    text: zoneName,
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
  },
  xaxis: {
    categories: xaxislabel,
  }}
  

  const generationData = [];
  zoneGeneration_test?.map((data) =>{
    if(generationType === "biomass"){
      generationData.push(data.biomass)
    }
    if(generationType === "entsoe"){
      generationData.push(data.entsoe)
    }
    if(generationType === "georgia"){
      generationData.push(data.georgia)
    }
    if(generationType === "geothermal"){
      generationData.push(data.geothermal)
    }
    if(generationType === "coal"){
      generationData.push(data.coal)
    }
    if(generationType === "hydro"){
      generationData.push(data.hydro)
    }
    if(generationType === "ror"){
      generationData.push(data.ror)
    }
    if(generationType === "import_coal"){
      generationData.push(data.import_coal)
    }
    if(generationType === "lignite"){
      generationData.push(data.lignite)
    }
    if(generationType === "gas"){
      generationData.push(data.gas)
    }
    if(generationType === "nuclear"){
      generationData.push(data.nuclear)
    }
    if(generationType === "other"){
      generationData.push(data.other)
    }
    if(generationType === "pv"){
      generationData.push(data.pv)
    }
    if(generationType === "wind"){
      generationData.push(data.wind)
    }})

    let seriesGeneration = [];

    
    const generationData_test = JSON.parse(JSON.stringify(generationData));
    var data1 = generationData_test.filter(elements => {
      return elements !== null;
    })

    
    
    debugger
    for(let i=0;i<generationOptions?.length;i++){
      if(generationOptions[i].value === generationType){
        seriesGeneration = [{
          name: generationOptions[i].label , 
          data: data1
        }]
      }
    }
    
    const generation_labels=[];
    if (generationData[0] !== undefined ){
      generation_labels.push(zoneNames[1])
    }
    if (generationData[1] !== undefined ){
      generation_labels.push(zoneNames[2])
    }
    if (generationData[2] !== undefined ){
      generation_labels.push(zoneNames[3])
    }
    if (generationData[3] !== undefined ){
      generation_labels.push(zoneNames[4])
    }
    if (generationData[4] !== undefined ){
      generation_labels.push(zoneNames[5])
    }
    if (generationData[5] !== undefined ){
      generation_labels.push(zoneNames[6])
    }
    if (generationData[6] !== undefined ){
      generation_labels.push(zoneNames[7])
    }
    if (generationData[7] !== undefined ){
      generation_labels.push(zoneNames[8])
    }
    if (generationData[8] !== undefined ){
      generation_labels.push(zoneNames[9])
    }


    var optionsGenerations =  {
      chart: {
        height: 350,
        type: 'bar',
        zoom: {
          enabled: false
        }
      },
      plotOptions:{
        bar:{
          columnWidth: seriesGeneration[0].data.length <= 2 ? "10%" : "70%",
          distributed: true,
          dataLabels:{
            orientation: "horizontal",
            position: "top"
          }
        }
      },
      legend:{
        show:false
      },
      colors: ["#e3342f" , "#f6993f" , "#ffed4a" , "#38c172" , "#4dc0b5" , "#3490dc" , "#6574cd" , "#9561e2" , "#f66d9b"],
      dataLabels: {
        style:{
          colors: ["#5F5F5F"]
        },
        formatter: function(value, context) {
          return value  +  "MW"
        },
        offsetY : -20
 
      },
   
      
      stroke: {
        width:1,
        curve: 'smooth'
      },
      tooltip:{
        y:{
          formatter: function(val){
            return val + 'MW'
          }
        }  
      },
      title:{
        text: seriesGeneration[0].name,
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
          colors: ['#f3f3f3'], // takes an array which will be repeated on columns
          opacity: 0.5
        },
      },
      xaxis: {
        categories: generation_labels,
      }}

      
     
      let data = [0,0,0,0,0,0,0,0,0,0,0,0,0,0]
      for (let i = 0;i<zoneGeneration_test?.length ; i++){
        data[0] += zoneGeneration[i].biomass !== null ? zoneGeneration_test[i].biomass : 0 
        data[1] += zoneGeneration[i].entsoe !== null ? zoneGeneration_test[i].entsoe : 0
        data[2] += zoneGeneration[i].georgia !== null ? zoneGeneration_test[i].georgia : 0
        data[3] += zoneGeneration[i].geothermal !== null ? zoneGeneration_test[i].geothermal : 0
        data[4] += zoneGeneration[i].coal !== null ? zoneGeneration_test[i].coal : 0
        data[5] += zoneGeneration[i].hydro !== null ? zoneGeneration_test[i].hydro : 0
        data[6] += zoneGeneration[i].ror !== null ? zoneGeneration_test[i].ror : 0
        data[7] += zoneGeneration[i].import_coal !== null ? zoneGeneration_test[i].import_coal : 0
        data[8] += zoneGeneration[i].lignite !== null ? zoneGeneration_test[i].lignite : 0 
        data[9] += zoneGeneration[i].gas !== null ? zoneGeneration_test[i].gas : 0
        data[10]+= zoneGeneration[i].nuclear !== null ? zoneGeneration_test[i].nuclear : 0
        data[11]+= zoneGeneration[i].other !== null ? zoneGeneration_test[i].other : 0
        data[12]+= zoneGeneration[i].pv !== null ? zoneGeneration_test[i].pv : 0
        data[13]+= zoneGeneration[i].wind !== null ? zoneGeneration_test[i].wind : 0
      }

      function compare(a,b){
        return b.value - a.value;
      }

      const datax = [{label : "Biomass" ,  value: data[0] , color: "#F4B183"} , {label : "ENTSOE" ,  value: data[1] , color: "#3c2268"} , {label : "Georgia" ,  value: data[2] , color:"#449a48"} , {label : "Geothermal" ,  value: data[3] , color: "#990099"} , {label : "Local Coal" ,  value: data[4] , color:"#767171"} , {label : "Hydro" ,  value: data[5] , color:"#6699FF"}, {label : "RoR" ,  value: data[6] , color:"#33CCFF"} , {label : "Import Coal" ,  value: data[7] , color:"#000000"} , {label : "Lignite" ,  value: data[8] , color:"#A6A6A6"} , {label : "Natural Gas" ,  value: data[9] , color:"#CC66FF"} , {label : "Nuclear" ,  value: data[10] , color:"#FF0000"} , {label : "Other" ,  value: data[11] , color:"#000099"} , {label : "Solar" ,  value: data[12] , color:"#ffc000"} , {label : "Wind" ,  value: data[13] , color:"#009900"}]
      const datanew = datax.sort(compare)

      const datanewlabel = [];
      for ( let i = 0;i<datanew.length ; i++){
        datanewlabel[i] = datanew[i].label
      }
      const datanewvalue = [];
      for ( let i = 0;i<datanew.length ; i++){
        datanewvalue[i] = datanew[i].value
      }

      const datanewcolor = [];
      for( let i = 0;i<datanew.length ; i++) {
        datanewcolor[i] = datanew[i].color
      }

      
      
      
      
      const seriesTotal = [
        {
          name: "",
          data: datanewvalue
        }
      ];

      

      var optionsTotal =  {
        chart: {
          height: 350,
          type: 'bar',
          zoom: {
            enabled: false
          }
        },
        
        colors: datanewcolor,
        plotOptions:{
          bar:{
            distributed: true,
            dataLabels:{
              orientation: "horizontal",
              position: "top"
            }
          }
        },
        legend:{
          show: false,
          position: 'bottom',
          horizontalAlign: 'center',
          markers:{
            radius:12,
          }
        },
        dataLabels: { 
          style:{
            colors: ["#5F5F5F"]
          },
          enabled: true,
          formatter: function(value, context) {
            return (value/1000).toFixed(2) + "GW"
          },
          offsetY: -20
        },
        stroke: {
          width:1,
          curve: 'smooth'
        },
        tooltip:{
          y:{
            formatter: function(val){
              return val.toFixed(0) + 'MW'
            }
          }  
        },
        yaxis:{
          labels:{
          formatter: function(val){
            return val.toFixed(0)/1000 + 'GW'}}
        },
        title:{
          text: "The Summary of Turkey Generation Types ",
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
            colors: ['#f3f3f3'], // takes an array which will be repeated on columns
            opacity: 0.5
          },
        },
        xaxis: {
          categories: datanewlabel,
          labels:{
            style: {
              colors: datanewcolor,
              fontSize: "12px"
            }
          }
        }}

         
     



 

 const zoneGeneration_table = [];
 if(zoneGeneration){
 zoneGeneration_table[0] = zoneGeneration[3]
 zoneGeneration_table[1] = zoneGeneration[7]
 zoneGeneration_table[2] = zoneGeneration[4]
 zoneGeneration_table[3] = zoneGeneration[2]
 zoneGeneration_table[4] = zoneGeneration[8]
 zoneGeneration_table[5] = zoneGeneration[6]
 zoneGeneration_table[6] = zoneGeneration[0]
 zoneGeneration_table[7] = zoneGeneration[1]
 zoneGeneration_table[8] = zoneGeneration[5]
 }
 

  

  return (
    <div>
      {loading && <Panel style={{fontSize:"20px" }}>
        <div style={{height:"80vh", display:"flex", justifyContent:"center", alignItems:"center"}}>
          <div>
            <ProgressSpinner style={{width:"150px", height:"150px"}}/>
            <br></br> 
            <div style={{textAlign:"center"}}>
              Loading...
            </div>
            
          </div>
        </div>
        
      </Panel>}
      {!loading && <Panel   style={{fontSize:"20px" , marginTop:"-1rem" , marginLeft:"-2rem" , marginRight:"-1rem" }}>
      <Toast ref={toastBR} position="top-right" />
      
   
     
      <div className="grid" style={{paddingTop:"1rem"}}>
        <div style={{width:"81%" , height:"100%" , marginBottom:"19px", marginLeft:"-1px" }}>
        
        <NetworkMap  zoneResult = {zoneResult} resolution={resolution} dates={resolution==="hourly" ? date : dates} processInput={processInput} busResults={busResults} lineResult={lineResult} networkGeneration = {networkGeneration} lineLoadingResult={lineLoadingResult}></NetworkMap>
          
        </div>
       
        <div style={{width:"18%"}}>
          <div   style={{textAlign:"center", fontFamily: 'Arial' , fontWeight:'bold', fontSize:'18px', color:'#5f5f5f'}}></div>
            
          <h4  style={{fontStyle:"Anuphan" , fontSize:"28px" , fontWeight:"bold" , color:"#5f5f5f" }}> {processName +  ' ' + 'Results'}  </h4> 
          <br></br>
          
         
        
          <Row>
            <Col span={14} >
            <label style={{ fontStyle:"Anuphan" , fontSize:"16px" , fontWeight:"bold" , color:"#5f5f5f" }}>Analysis Resolution: </label>
            </Col>
            <Col >
            <Select className="select-border" options={resolutionOptions} defaultValue="yearly" onChange={(e) => changeResolution(e)} style={{width:"120px" }}></Select>
            </Col>

          </Row>
          <div style={{height:"10px"}}></div>
          <div>
            <label style={{ fontStyle:"Anuphan" , fontSize:"16px", fontWeight:"bold"}}>Date:      </label>
            {resolution === "yearly" &&  <DatePicker style={{ float:"right", marginRight:"1.5em"}} picker="year" defaultValue={dayjs(String(processInput[0]?.base_year) + '-' + '01' + '-' + '01', 'YYYY')}  disabled>  </DatePicker>}
            {resolution === "hourly"  && <DatePicker style={{ float:"right", marginRight:"1.5em"}} defaultPickerValue= {moment(new Date(processInput[0].base_year,0,processInput[0].from_hour/24 + 1))} showTime={true} showNow={false} disabledDate={disabledDate} format="yyyy-MM-DD HH" value={date} onChange={(e)=> setDate(e)}></DatePicker>}
            {resolution === "daily" && <RangePicker style={{ float:"right", marginRight:"1.5em"}} defaultPickerValue= {[moment(new Date(processInput[0].base_year,0,processInput[0].from_hour/24 + 1)),moment(new Date(processInput[0].base_year,0,processInput[0].from_hour/24 + 1))]} disabledDate={disabledDate} onChange={(e)=> setDates(e)}></RangePicker>}
            {resolution === "monthly" && <RangePicker style={{ float:"right", marginRight:"1.5em"}} defaultPickerValue= {[moment(new Date(processInput[0].base_year,0,processInput[0].from_hour/24 + 1)),moment(new Date(processInput[0].base_year,0,processInput[0].from_hour/24 + 1))]} picker="month" disabledDate={disabledDate} onChange={(e)=> setDates(e)}></RangePicker>}
            {resolution === "seasonally" && <RangePicker style={{ float:"right", marginRight:"1.5em"}} defaultPickerValue= {[moment(new Date(processInput[0].base_year,0,processInput[0].from_hour/24 + 1)),moment(new Date(processInput[0].base_year,0,processInput[0].from_hour/24 + 1))]} picker="quarter" disabledDate={disabledDate} onChange={(e)=> setDates(e)}></RangePicker>}
          </div>
            <Divider style={{borderColor:"grey"}}></Divider> 
            <Row>
            <label style={{fontStyle:"Anuphan" , fontWeight:"bold", fontSize:"20px", color:"#808080",marginTop:"-20px",marginBottom:"20px"}} > Input Details </label> 
            </Row>


          <div className="App" style={{}}>
            <button  onMouseEnter={changeBackground} onMouseLeave={changeBackground1} className="button"     style={{width:"300px",height:"40px", color:"white",fontFamily:"Arial"}}   onClick={() => setVisible1(true)} >
            <i class= {visible1 === true ? "pi pi-folder-open": "pi pi-folder" }></i>  Analysis Input
            </button> 
              <Dialog  visible={visible1}  onHide={() => setVisible1(false)}>
                <Row>
                  <div>
                  <label style={{ fontStyle:"Anuphan" , fontSize:"16px" , fontWeight:"bold" , color:"#5f5f5f"}}>Analysis Type: </label>
                  <Dropdown1 options={sortOptions} defaultValue={"not_sorted"} onChange={(e) => setSortType(e.value)} value={sorttype} style={{ width:"180px", height:"40px", verticalAlign:"center",marginLeft:"10px"}}></Dropdown1>
                  </div>
                
                  {sorttype === "zone" && 
                    <div style={{marginLeft:"100px"}}>
                    <label style={{ fontStyle:"Anuphan" , fontSize:"16px" , fontWeight:"bold" , color:"#5f5f5f", marginLeft:"40px" }}> Select a Zone: </label>
                    <Dropdown1 options={zoneNames} defaultValue={"All Zones"} onChange={(e) => changeZone(e.value)} value={zoneName}    style={{ width:"180px", height:"40px", verticalAlign:"center",marginLeft:"10px"}}></Dropdown1>
                    <br></br><br></br>
                    <br></br>
                    {zoneName === "All Zones" &&
                    <div id="chart" style={{height:"400px",width:"1200px", marginLeft:"-400px"}}>
                    <ApexChart options={options} series={series}  type="line" height={400} width="100%" />
                    </div>}
                    {zoneName !== "All Zones" &&  
                    <div id="chart" style={{height:"400px",width:"1200px", marginLeft:"-400px"}}>
                    <ApexChart options={options1} series={seriesbyzone}  type="bar" height={400} width="100%" />
                    </div>}
                    </div>

                 }
                 {sorttype === "generation" &&
                    <div>
                    <div >
                    <label style={{ fontStyle:"Anuphan" , fontSize:"16px" , fontWeight:"bold" , color:"#5f5f5f", marginLeft:"140px" }}> Select a Generation Type: </label>
                    <Dropdown1 options={generationOptions} defaultValue={"gas"} onChange={(e) => changeGenerationType(e.value)} value={generationType}   style={{ width:"180px", height:"40px", verticalAlign:"center",marginLeft:"10px"}}></Dropdown1>
                    <br></br><br></br>
                    </div>
                    <div style={{height:"400px",width:"1200px", marginLeft:"-200px"}}>
                    <ApexChart options={optionsGenerations} series={seriesGeneration}  type="bar" height={450} width="90%" />  
                    </div>
                    </div>
                    
                 }

                {sorttype === "totalgen" &&
                    <div>
                    <div style={{height:"500px",width:"1200px", marginLeft:"-200px",marginTop:"30px"}}>
                    <ApexChart options={optionsTotal} series={seriesTotal}  type="bar" height={450} width="90%" />  
                    </div>
                    </div>
                    
                 }
                 
                
                </Row>
                  
                  <br></br><br></br>
                  {sorttype === "datatable" && 
                  <p className="m-0">
                    <DataTable style={{width:"1500px" , height:"550px"}} header={"Generation Fleet (" + date1 + " - " + date2 + ")"} scrollable scrollDirection='horizontal' value={zoneGeneration_table} responsiveLayout="scroll"
                  className="datatable-responsive"
                  emptyMessage="No result found.">
                  <Column header="Zone"  frozen body={zoneBodyTemplate} style={{minWidth:"13rem"}}></Column>
                  <Column field="gas" sortable header="Natural Gas (MW)" style={{minWidth:"12rem"}}></Column>
                  <Column field="lignite" sortable header="Lignite (MW)" style={{minWidth:"10rem"}}></Column>
                  <Column field="import_coal" sortable header="Import Coal (MW)" style={{minWidth:"12rem"}}></Column>
                  <Column field="coal" sortable header="Local Coal (MW)" style={{minWidth:"10rem"}}></Column>
                  <Column field="wind" sortable header="Wind (MW)" style={{minWidth:"10rem"}}></Column>
                  <Column field="pv" sortable header="Solar (MW)" style={{minWidth:"10rem"}}></Column>
                  <Column field="hydro" sortable header="Hydro (MW)" style={{minWidth:"10rem"}}></Column>
                  <Column field="ror" sortable header="RoR (MW)" style={{minWidth:"10rem"}}></Column>
                  <Column field="geothermal" sortable header="Geothermal (MW)" style={{minWidth:"12rem"}}></Column>
                  <Column field="biomass" sortable header="Biomass (MW)" style={{minWidth:"10rem"}}></Column>
                  <Column field="other" sortable header="Other (MW)" style={{minWidth:"10rem"}}></Column>
                  <Column field="nuclear" sortable header="Nuclear (MW)" style={{minWidth:"10rem"}}></Column>
                  <Column field="entsoe" sortable header="ENTSOE (MW)" style={{minWidth:"10rem"}}></Column>
                  <Column field="georgia" sortable header="Georgia (MW)" style={{minWidth:"10rem"}}></Column>
                  <Column field="consumption" sortable   header="Consumption (TWh)" style={{minWidth:"12rem"}}></Column>
                </DataTable>
           
                  </p>}
              </Dialog>
              <br></br>  
          </div>
   
            <Row>
            <Divider style={{borderColor:"grey"}} ></Divider>
              </Row> 
            <Row>
            <label style={{fontStyle:"Anuphan" , fontWeight:"bold", fontSize:"20px", color:"#808080",marginTop:"-20px",marginBottom:"20px"}} > Filter for the Results on the Map </label> 
            </Row>
            
            
            <div className="flex align-items-center">
                        <RadioButton  inputId="load" name="loadgeneration" value="loadgeneration"  onChange={ (e) => MyFunc(e)} checked={selectData === 'loadgeneration'} />
                        <label style={{fontSize:"16px", fontStyle:"Anuphan"}} htmlFor="loadgeneration" className="ml-2">Load & Generation</label>
                    </div>
                    <div className="flex align-items-center">
                        <RadioButton inputId="curtailment" name="curtailment" value="curtailment"  onChange={(e) => MyFunc(e)} checked={selectData === 'curtailment'} />
                        <label style={{fontSize:"16px", fontStyle:"Anuphan"}}  htmlFor="curtailment" className="ml-2">Curtailment & Renewable Generation</label>
                    </div>
                    <div className="flex align-items-center">
                        <RadioButton inputId="redispatchupdown" name="redispatchupdown" value="redispatchupdown"  onChange={(e) => MyFunc(e)} checked={selectData === 'redispatchupdown'} />
                        <label style={{fontSize:"16px", fontStyle:"Anuphan"}} htmlFor="redispatchupdown" className="ml-2">Redispatch Up & Down</label>
                    </div>
           


            <br></br>
           

            {selectData === 'loadgeneration' && (resolution==="yearly" || resolution=="seasonally" || resolution==="monthly") &&
            <Select
            mode="multiple"
            allowClear
            style={{ minWidth: '60%' }}
            placeholder="Select which bus results to show on the map"
            defaultValue={["load" , "generation"]}
            options={busOptions}
            onChange = {(e) => setBusResults(e)}
            
            tagRender={tagRender} />
            }
            {selectData === 'loadgeneration' && (resolution==="daily" || resolution==="hourly") &&
            <Select
            mode="multiple"
            allowClear
            style={{ minWidth: '60%' }}
            placeholder="Select which bus results to show on the map"
            defaultValue={["load" , "generation"]}
            options={busOptionsMwh}
            onChange = {(e) => setBusResults(e)}
            
            tagRender={tagRender} />
            }
            {selectData === 'curtailment' && (resolution==="yearly" || resolution=="seasonally" || resolution==="monthly") &&
            <Select
            mode="multiple"
            allowClear
            style={{ minWidth: '60%' }}
            placeholder="Select which bus results to show on the map"
            defaultValue={["curtailment","renewable_generation"]}
            options={busOptions1}
            onChange = {(e) => setBusResults(e)}
            tagRender={tagRender} />
            }
            {selectData === 'curtailment' && (resolution==="daily" || resolution==="hourly") &&
            <Select
            mode="multiple"
            allowClear
            style={{ minWidth: '60%' }}
            placeholder="Select which bus results to show on the map"
            defaultValue={["curtailment","renewable_generation"]}
            options={busOptions1Mwh}
            onChange = {(e) => setBusResults(e)}
            tagRender={tagRender} />
            }

            {selectData === 'redispatchupdown' && (resolution==="yearly" || resolution=="seasonally" || resolution==="monthly") &&
            <Select
            mode="multiple"
            allowClear
            style={{ minWidth: '60%' }}
            placeholder="Select which bus results to show on the map"
            defaultValue={["redispatch_up" , "redispatch_down"]}
            options={busOptions2}
            onChange = {(e) => setBusResults(e)}
            tagRender={tagRender} />
            }
            {selectData === 'redispatchupdown' && (resolution==="daily" || resolution==="hourly") &&
            <Select
            mode="multiple"
            allowClear
            style={{ minWidth: '60%' }}
            placeholder="Select which bus results to show on the map"
            defaultValue={["redispatch_up" , "redispatch_down"]}
            options={busOptions2Mwh}
            onChange = {(e) => setBusResults(e)}
            tagRender={tagRender} />
            }

        
        
            <br></br>
            

      <Row>
      <Divider style={{borderColor:"grey"}}></Divider>
      </Row>
      <Row>
      <label style={{fontStyle:"Anuphan" , fontWeight:"bold", fontSize:"20px", color:"#808080", marginTop:"-20px" ,marginBottom:"20px"}} > Detailed Results </label> 
      </Row>   
      


      <div style={{width:"100px"}} className="App"> 
        <button
        onMouseEnter={changeBackground}
        onMouseLeave={changeBackground1}
        className="button"
        style={{width:"300px",height:"40px", color:"white",fontFamily:"Arial"}}
        onClick={() => {setVisible(true)}}
        
        >
        <i class={visible === true ? "pi pi-folder-open": "pi pi-folder"}></i> Show Generation Breakdown
          
        </button>
        
        <button 
        onMouseEnter={changeBackground}
        onMouseLeave={changeBackground1}
        className="button"
        style={{width:"300px",height:"40px", color:"white",marginTop:"10px"}}
        onClick={() => {setVisibleContingencyDialog(true)}}
        
        >
        <i class={visibleContingencyDialog === true ? "pi pi-folder-open": "pi pi-folder"}></i> Show Congestion Hours
          
        </button>
      </div>
          <br ></br>
          <br></br>
          <br></br>   
 
          </div>
        
      </div>
      <div><br></br></div>

      <Dialog header="Total Generation And Capacity Factor Results" visible={visible} onHide={()=>{setVisible(false)}} style={{width:"55%", height:"100%"}}>
        <NetworkSimulationResultCharts 
          processInput={structuredClone(processInput)} 
          marketGeneration={structuredClone(marketGeneration)} 
          networkGeneration={structuredClone(networkGeneration)}
          zoneGeneration = {structuredClone(zoneGeneration)}
          dates={resolution==="hourly" ? date : dates}
          resolution={resolution}
          />
      </Dialog>  
      <Dialog visible={visibleContingencyDialog} onHide={()=>{setVisibleContingencyDialog(false)}} style={{width:"80%", height:"100%"}}>
      <NetworkCongestionHoursResult congestionHoursResult={congestionHoursResult} input={processInput}></NetworkCongestionHoursResult>
      </Dialog>
      
    </Panel>}
    </div>
    
  );
};

export default NetworkSimulationResults;