import React, { useState, useEffect, useRef } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Panel } from 'primereact/panel';
import { BaseYearService} from '../../service/BaseYearService';
import NetworkSimulationCharts from './NetworkSimulationCharts'
import NetworkMap from './NetworkMap_V8';
import { MarketSimulationService } from '../../service/MarketSimulation/MarketSimulationService';
import { Dialog } from 'primereact/dialog';
import { Row, Col, Form, Select} from 'antd';
import { Button } from 'primereact/button';
import { useHistory } from 'react-router-dom';
import { DateRangePicker } from 'rsuite';
import isAfter from 'date-fns/isAfter';
import isBefore from 'date-fns/isBefore';
import { InputText } from 'primereact/inputtext'
import { Toast } from 'primereact/toast';
import {InputSwitch} from 'primereact/inputswitch';
import { Divider as DivAntd } from 'antd';
import "./DialogCss.css"
const NetworkSimulation = (props) => {
    const [BaseYearList, setBaseYearList] = useState([]);
    const [AnnualLoad, setAnnualLoad] = useState([]);
    const [base_year, setbase_year] = useState([]);
    const [analysisDate, setAnalysisDate] = useState();
    const [IsSelectBaseYear, setIsSelectBaseYear] = useState(false);
    const [IsSelectDate, setIsSelectedDate] = useState(false);
    const[DateRange, SetDateRange] = useState([])
    const baseYearService = new BaseYearService();
    const [annual_demand, SetAnnual_demand] = useState();
    const [peak_load, SetPeak_load] = useState();
    const [base_year_id, Setbase_year_id] = useState();
    const [generation_fleet_data, SetGenerationFleetData] = useState();
    const [generation_fleet_data2, SetGenerationFleetData2] = useState();
    const [dataForLine, setdataForLine] = useState({label:[], data:[{name:"", data:[]}]});
    const [gen_fleet, SetGenFleet] = useState();
    const [label,setlabel]=useState();
    const [color,setcolor]=useState();
    const [visible, SetVisible] = useState(false)
    const [visible2, SetVisible2] = useState(false)
    const [processname, setProcessName] = useState('')
    const [mapHeight , SetMapHeight] = useState("87vh")
    const toastBR = useRef(null);
    const history = useHistory();
    const marketSimulationService = new MarketSimulationService();
    const [BusData, setBusData] = useState(structuredClone(require('./BusData_V1.json')))
    const [BusDataCopy, setBusDataCopy] = useState(structuredClone(require('./BusData_V1.json')))
    const [LineData, setLineData] = useState(structuredClone(require('./LineData_V1.json')))
    const [substationData, setSubstationData] = useState()
    const [substationDataCopy, setSubstationDataCopy] = useState()
    const [loading, setLoading] = useState(false)
    const [n1_contingency,setN1_Contingency] =useState(false)
    
    const label_dic = {
      natural_gas: "Natural Gas",
      hydro_dam: "Hydro Dam",
      imported_coal: "Imported Coal",
      wind_onshore: "Wind Onshore",
      lignite: "Lignite",
      solar_pv: "Solar PV",
      nuclear: "Nuclear",
      geothermal: "Geothermal",
      biomass: "Biomass",
      hydro_ror: "Hydro RoR",
      local_coal: "Local Coal",
      other: "Other",
      entsoe: "ENTSO-E",
      georgia: "Georgia"
    }
    const technology = ["biomass", "entsoe", "georgia", "geothermal", "hard_coal", "hydro_dam", "hydro_ror", "import_coal", "lignite", "natural_gas", "nuclear", "other", "solar", "wind", "load"]
    const color_dic = {
      natural_gas: "#CC66FF",
      hydro_dam: "#6699FF",
      imported_coal: "#000000",
      wind_onshore: "#009900",
      lignite: "#A6A6A6",
      solar_pv: "#FFC000",
      nuclear: "#FF0000",
      geothermal: "#990099",
      biomass: "#F4B183",
      hydro_ror: "#33CCFF",
      local_coal: "#767171",
      other: "#000099",
      entsoe: "#4CB6AC",
      georgia:"#4CB6AC"
    }
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
    function HideDialog(){
      SetVisible(false)
    }
    function HideDialog2(){
      SetVisible2(false)
    }
    useEffect(() => {
      const loadData = async () => {
          const resBaseYearList = await baseYearService.getAll();
          if (resBaseYearList.success) {
              setBaseYearList(resBaseYearList.object);
          }    
      }
      
      if(base_year_id){
        setSubstationData(structuredClone(require("./substationData_" + base_year.name + ".json")))
        setSubstationDataCopy(structuredClone(require("./substationData_" + base_year.name + ".json")))
        baseYearService.getGenerationFleet(base_year_id).then(res=>{
          if (res.success) {
            const gen_fleet = {"natural_gas": res.object['natural_gas'],
                              "lignite": res.object['lignite'],
                              "biomass": res.object['biomass'],
                              "geothermal": res.object['geothermal'],
                              "hydro_dam": res.object['hydro_dam'],
                              "hydro_ror": res.object['hydro_ror'],
                              "imported_coal": res.object['imported_coal'],
                              "local_coal": res.object['local_coal'],
                              "nuclear": res.object['nuclear'],
                              "other": res.object['other'],
                              "solar_pv": res.object['solar_pv'],
                              "wind_onshore": res.object['wind_onshore'],
                              "entsoe": res.object['entsoe'],
                              "georgia": res.object['georgia']
                            }
            SetGenFleet(gen_fleet)
            const chart_keys = Object.keys(gen_fleet)
            const values = Object.values(gen_fleet)
            var updated_values = values;
            var test_with_index = [];
            for (var i=0; i<updated_values.length; i++) {
                test_with_index.push([updated_values[i], i]);
            }
            test_with_index.sort(function(left, right) {
              return left[0] > right[0] ? -1 : 1;
            });
            var indexes = [];
            updated_values = [];
            for (var j=0; j<test_with_index.length; j++) {
              updated_values.push(test_with_index[j][0]);
              indexes.push(Number(test_with_index[j][1]));
            }
            var updated_keys = [];
            for(i=0; i<indexes.length; i++){
              updated_keys.push(label_dic[chart_keys[indexes[i]]])
            } 
            var colors = [];
            for (i=0; i<indexes.length; i++){
              colors.push(color_dic[chart_keys[indexes[i]]])
            }
            SetGenerationFleetData2(updated_values)
            setlabel(updated_keys)
            setcolor(colors)
            ;}
          SetGenerationFleetData( {labels: [
              'Natural Gas',
              'Hydro Dam',
              'Lignite',
              'Imported Coal',
              'Wind Onshore',
              'Hydro RoR',
              'Solar PV',
              'Geothermal',
              'Other',
              'Biomass',
              'Local Coal',
              //'Wind Offshore',
              'Nuclear'],
            datasets: [
                {
                    label: "Generation Fleet",
                    backgroundColor: color_dic,
                    data: [res.object.natural_gas, 
                      res.object.hydro_dam, 
                      res.object.lignite, 
                      res.object.imported_coal,
                      res.object.wind_onshore,
                      res.object.hydro_ror,
                      res.object.solar_pv,
                      res.object.geothermal,
                      res.object.other,
                      res.object.biomass,
                      res.object.local_coal,
                      //res.object.wind_offshore,
                      res.object.nuclear]
                }
            ]})
  
        })
        
        baseYearService.getAnnualLoad(base_year_id).then(res=>{
          if (res.success) {
            setAnnualLoad(res.object);
            let labels = []
              for(let i=0; i<res.object.hour_in_year.length; i++){
                labels.push(res.object.hour_in_year[i]*3600000)
              }
            setdataForLine(
              /*{
                labels: res.object.hour_in_year,
                datasets: [
                  {
                    label: "Annual Load",
                    data: res.object.load,
                    fill: false,
                    borderColor: '#ED7D31',
                    backgroundColor: '#ED7D31',
                    tension: 0.4,
                    datalabels:{
                    display: false
                  }
                  }
                ],
              }*/
              {labels: labels, data: [{name:"Load", data: res.object.load}]}
            )
          }
          })
      }
      setBusData(structuredClone(require('./BusData_V1.json')))
      setBusDataCopy(structuredClone(require('./BusData_V1.json')))
      setLineData(structuredClone(require('./LineData_V1.json')))
        
      loadData()
        
      
  }, [base_year]);

  useEffect(() =>{
    let from = 0
    let to = 8759
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

    if(base_year.code){
      BusData.buses.map((data)=>{
        if (DateRange.length !== 0){
          let char = structuredClone(data.Load[base_year.code + "_characteristic"])
          char = char.slice(from, to)
          data[base_year.code].load.capacity = (char.reduce((partialSum, a) => partialSum + a, 0)/1000000).toFixed(3)
        }
        else{
          data[base_year.code].load.capacity = null
        }
      })
      BusDataCopy.buses.map((data)=>{
        if (DateRange.length !== 0){
          let char = structuredClone(data.Load[base_year.code + "_characteristic"])
          char = char.slice(from, to)
          data[base_year.code].load.capacity = (char.reduce((partialSum, a) => partialSum + a, 0)/1000000).toFixed(3)
        }
        else{
          data[base_year.code].load.capacity = null
        }
      })
    }
    
  },[DateRange])
    var dropdownItems = []
    var years = []
    if (BaseYearList.length > 0){
      for(const key in BaseYearList){
        years.push(Number(BaseYearList[key].base_year))
      }
    }
    if(years.length > 0)
    {
      var indexes = Array.from(Array(years.length).keys())
      .sort((a, b) => years[a] < years[b] ? -1 : (years[b] < years[a]) | 0)
        for(var i=0; i< indexes.length; i++){    
          if(BaseYearList[indexes[i]]){
            var obj = {};
            obj["code"] = BaseYearList[indexes[i]].base_year
            obj["name"] = BaseYearList[indexes[i]].base_year
            dropdownItems.push(obj)
          }              
      }
    }
   
    

    const changebase_year = (data) => {
      let a = base_year.code
        setIsSelectBaseYear(true)
        setbase_year(data);
        for(const key in BaseYearList){                    
            if (BaseYearList[key].base_year === data.code){
                
                SetAnnual_demand(BaseYearList[key].annual_demand)
                SetPeak_load(BaseYearList[key].peak_load)
                Setbase_year_id(BaseYearList[key].id)
                
            }    
        }
        
        if( a || (DateRange.length === 2 && (DateRange[0].getFullYear() != Number(data.code) || DateRange[1].getFullYear() != Number(data.code)))){
          SetDateRange([])
          setIsSelectedDate(false)
        }
    }

    const AnalysesDateChange = (data) => {
      if (data === null){
        setIsSelectedDate(false)
      }
      else{
        SetDateRange(data)
        setIsSelectedDate(true)
      }
    }

    const ResetDateRange = () => {
      SetDateRange([])
      setIsSelectedDate(false)
    }
      const execute = async () => {
        SetVisible2(true)
    }

    const execute2 = async () => {
      setLoading(true)
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
        from = hour_of_first_day_of_month[start_month] + 24 * (start_day - 1) + 1
        to = hour_of_first_day_of_month[end_month] + 24 * end_day
        
      }
      let line_capacities = new Array(Object.keys(LineData.lines).length).fill(null);
      LineData.lines.map((data)=>{
        if(data[base_year.code].outofservice !== true){
          line_capacities[data.id-1] = data[base_year.code].capacity
        }
      })

      let zone1_generation = new Array(16).fill(null);
      let zone2_generation = new Array(16).fill(null);
      let zone3_generation = new Array(16).fill(null);
      let zone4_generation = new Array(16).fill(null);
      let zone5_generation = new Array(16).fill(null);
      let zone6_generation = new Array(16).fill(null);
      let zone7_generation = new Array(16).fill(null);
      let zone8_generation = new Array(16).fill(null);
      let zone9_generation = new Array(16).fill(null);
      zone1_generation[0] = 1
      zone2_generation[0] = 2
      zone3_generation[0] = 3
      zone4_generation[0] = 4
      zone5_generation[0] = 5
      zone6_generation[0] = 6
      zone7_generation[0] = 7
      zone8_generation[0] = 8
      zone9_generation[0] = 9
      let busGenerationDTOList = []
      substationData.data.map((data)=>{
        let bus_info = {
          zone_id:null, 
          bus_id:null, 
          bus_name:null, 
          base_kv: null, 
          natural_gas: null, 
          lignite: null, 
          import_coal:null, 
          coal:null, 
          wind: null, 
          solar: null, 
          hydro: null, 
          geothermal: null, 
          biomass: null, 
          other: null, 
          nuclear: null
        }
        bus_info.zone_id = data.zoneId
        bus_info.bus_id = data.id
        bus_info.bus_name = data.name
        bus_info.base_kv = data.baseKV
        if(data.generation.naturalGas && data.generation.naturalGas.checked && data.generation.naturalGas.capacity){
          bus_info.natural_gas = Number(data.generation.naturalGas.capacity.toFixed(2))
        }
        if(data.generation.lignite && data.generation.lignite.checked && data.generation.lignite.capacity){
          bus_info.lignite = Number(data.generation.lignite.capacity.toFixed(2))
        }
        if(data.generation.importCoal && data.generation.importCoal.checked && data.generation.importCoal.capacity){
          bus_info.import_coal = Number(data.generation.importCoal.capacity.toFixed(2))
        }
        if(data.generation.coal && data.generation.coal.checked && data.generation.coal.capacity){
          bus_info.coal = Number(data.generation.coal.capacity.toFixed(2))
        }
        if(data.generation.wind && data.generation.wind.checked && data.generation.wind.capacity){
          bus_info.wind = Number(data.generation.wind.capacity.toFixed(2))
        }
        if(data.generation.solar && data.generation.solar.checked && data.generation.solar.capacity){
          bus_info.solar = Number(data.generation.solar.capacity.toFixed(2))
        }
        if(data.generation.hydro && data.generation.hydro.checked && data.generation.hydro.capacity){
          bus_info.hydro = Number(data.generation.hydro.capacity.toFixed(2))
        }
        if(data.generation.geothermal && data.generation.geothermal.checked && data.generation.geothermal.capacity){
          bus_info.geothermal = Number(data.generation.geothermal.capacity.toFixed(2))
        }
        if(data.generation.biomass && data.generation.biomass.checked && data.generation.biomass.capacity){
          bus_info.biomass = Number(data.generation.biomass.capacity.toFixed(2))
        }
        if(data.generation.other && data.generation.other.checked && data.generation.other.capacity){
          bus_info.other = Number(data.generation.other.capacity.toFixed(2))
        }
        if(data.generation.nuclear && data.generation.nuclear.checked && data.generation.nuclear.capacity){
          bus_info.nuclear = Number(data.generation.nuclear.capacity.toFixed(2))
        }
      busGenerationDTOList.push(bus_info)
      })

      for (let i=0; i < technology.length; i++){
        if(BusData.buses[0][base_year.code][technology[i]].active == true){
          zone1_generation[i+1] = Number(BusData.buses[0][base_year.code][technology[i]].capacity)
        }
      }
      for (let i=0; i < technology.length; i++){
        if(BusData.buses[1][base_year.code][technology[i]].active == true){
          zone2_generation[i+1] = Number(BusData.buses[1][base_year.code][technology[i]].capacity)
        }
      }
      for (let i=0; i < technology.length; i++){
        if(BusData.buses[2][base_year.code][technology[i]].active == true){
          zone3_generation[i+1] = Number(BusData.buses[2][base_year.code][technology[i]].capacity)
        }
      }
      for (let i=0; i < technology.length; i++){
        if(BusData.buses[3][base_year.code][technology[i]].active == true){
          zone4_generation[i+1] = Number(BusData.buses[3][base_year.code][technology[i]].capacity)
        }
      }
      for (let i=0; i < technology.length; i++){
        if(BusData.buses[4][base_year.code][technology[i]].active == true){
          zone5_generation[i+1] = Number(BusData.buses[4][base_year.code][technology[i]].capacity)
        }
      }
      for (let i=0; i < technology.length; i++){
        if(BusData.buses[5][base_year.code][technology[i]].active == true){
          zone6_generation[i+1] = Number(BusData.buses[5][base_year.code][technology[i]].capacity)
        }
      }
      for (let i=0; i < technology.length; i++){
        if(BusData.buses[6][base_year.code][technology[i]].active == true){
          zone7_generation[i+1] = Number(BusData.buses[6][base_year.code][technology[i]].capacity)
        }
      }
      for (let i=0; i < technology.length; i++){
        if(BusData.buses[7][base_year.code][technology[i]].active == true){
          zone8_generation[i+1] = Number(BusData.buses[7][base_year.code][technology[i]].capacity)
        }
      }
      for (let i=0; i < technology.length; i++){
        if(BusData.buses[8][base_year.code][technology[i]].active == true){
          zone9_generation[i+1] = Number(BusData.buses[8][base_year.code][technology[i]].capacity)
        }
      }
      const data = {
        base_year_id: base_year_id,
        processname: processname,
        from_hour: from,
        to_hour: to,
        n1_contingency: n1_contingency, // true or false
        /*
        zone_generation: {
            zone_id: 1,
            biomass: 5,
            entsoe: 2,
            georgia: 4,
            geothermal: 1,
            hard_coal: 1,
            hydro_dam: 2.5,
            hydro_ror: 3,
            import_coal: 1,
            lignite: 2,
            natural_gas: 2,
            nuclear: null,
            other: 1,
            solar: 4.555,
            wind: 5,
            consumption: 4
          },
        */
        zone1_generation: zone1_generation,
        zone2_generation: zone2_generation,
        zone3_generation: zone3_generation,
        zone4_generation: zone4_generation,
        zone5_generation: zone5_generation,
        zone6_generation: zone6_generation,
        zone7_generation: zone7_generation,
        zone8_generation: zone8_generation,
        zone9_generation: zone9_generation,
        line_capacities : line_capacities,
        busGenerationDTOList: busGenerationDTOList
      }


      const response = await marketSimulationService.executeeNW(data);
      if (response.success) {
        setLoading(false)
        toastBR.current.show({ severity: 'success', summary: 'Success', detail: 'Your request has been received! You will be informed via e-mail after the process completed.', life: 10000 });
        history.push("/NetworkSimulation")
        setTimeout(() => {
          history.push('/NetworkSimulationResults')
        }, 10000);
      }
      else {
          setLoading(false)
          toastBR.current.show({ severity: 'error', summary: 'Error', detail: response.message, life: 10000 });
      }
      
      
      SetVisible2(false)
    }

    function PanelCollapsed (){
      SetMapHeight("78vh")
    }
    function PanelExpanded (){
      SetMapHeight("72vh")
    }

    const Ranges = [
      {
        label: 'Whole year',
        value: base_year.code && [new Date(Number(base_year.code),0,1), new Date(Number(base_year.code),11,31)],
        placement: 'left'
      },
      {
        label: 'January',
        value: base_year.code && [new Date(Number(base_year.code),0,1), new Date(Number(base_year.code),0,31)],
        placement: 'left'
      },
      {
        label: 'February',
        value: base_year.code && [new Date(Number(base_year.code),1,1), Number(base_year.code) % 4 === 0 ? new Date(Number(base_year.code),1,29) : new Date(Number(base_year.code),1,28)],
        placement: 'left'
      },
      {
        label: 'March',
        value: base_year.code && [new Date(Number(base_year.code),2,1), new Date(Number(base_year.code),2,31)],
        placement: 'left'
      },
      {
        label: 'April',
        value: base_year.code && [new Date(Number(base_year.code),3,1), new Date(Number(base_year.code),3,30)],
        placement: 'left'
      },
      {
        label: 'May',
        value: base_year.code && [new Date(Number(base_year.code),4,1), new Date(Number(base_year.code),4,31)],
        placement: 'left'
      },
      {
        label: 'June',
        value: base_year.code && [new Date(Number(base_year.code),5,1), new Date(Number(base_year.code),5,30)],
        placement: 'left'
      },
      {
        label: 'July',
        value: base_year.code && [new Date(Number(base_year.code),6,1), new Date(Number(base_year.code),6,31)],
        placement: 'left'
      },
      {
        label: 'August',
        value: base_year.code && [new Date(Number(base_year.code),7,1), new Date(Number(base_year.code),7,31)],
        placement: 'left'
      },
      {
        label: 'September',
        value: base_year.code && [new Date(Number(base_year.code),8,1), new Date(Number(base_year.code),8,30)],
        placement: 'left'
      },
      {
        label: 'October',
        value: base_year.code && [new Date(Number(base_year.code),9,1), new Date(Number(base_year.code),9,31)],
        placement: 'left'
      },
      {
        label: 'November',
        value: base_year.code && [new Date(Number(base_year.code),10,1), new Date(Number(base_year.code),10,30)],
        placement: 'left'
      },
      {
        label: 'December',
        value: base_year.code && [new Date(Number(base_year.code),11,1), new Date(Number(base_year.code),11,31)],
        placement: 'left'
      }
      
    ];

    return (
      <Panel   style={{fontSize:"20px" , marginTop:"-1rem" , marginLeft:"-2rem" , marginRight:"-1rem",marginBottom:0 }}>

        <Toast ref={toastBR} position="top-right" />
        <div className='grid' style={{paddingTop:"1rem"}}>
        <div style={{width:"80%" , height:"100%" , marginBottom: "-19px", marginLeft:"-1rem", marginTop:"-2rem" }}>
        <NetworkMap base_year={base_year} mapHeight={mapHeight} BusData = {BusData} setBusData = {setBusData} BusDataCopy = {BusDataCopy} setBusDataCopy = {setBusDataCopy} LineData = {LineData} setLineData = {setLineData} DateRange = {DateRange} substationData={substationData} setSubstationData={setSubstationData} substationDataCopy={substationDataCopy} setSubstationDataCopy={setSubstationDataCopy}></NetworkMap>
        </div>
        <div style={{width:"20%"}}>

        <div style={{textAlign:"center", fontFamily: 'Arial' , fontWeight:'bold', fontSize:'18px', color:'#5f5f5f', marginRight:"-1rem"}}>
          <h4 style={{fontStyle:"Anuphan" , fontSize:"28px" , fontWeight:"bold" , color:"#5f5f5f", marginTop:"70px"}}>Network Simulation</h4> 
        </div>
        
        <br></br>
        <Row style={{marginRight:"-1.5rem"}}>
            <Col span={10}>
              <label style={{paddingRight:"15px",marginLeft:"10px",fontFamily:"Arial",fontSize:"18px",fontWeight:"bold"}}>Base Year:</label>
            </Col>
            <Col span={14}>
              <Dropdown id="state" value={base_year} onChange={(e) => changebase_year(e.value)} options={dropdownItems} optionLabel="name" placeholder="Base Year" style={{width:'100%', height:"3em"}}></Dropdown> 
            </Col>
        </Row>
        <div style={{height:"10px"}}></div>
        <Row style={{marginRight:"-1.5rem"}}>
          <Col span={10}>
          <label style={{paddingRight:"10px", marginLeft:"10px", fontFamily:"Arial", fontSize:"18px", fontWeight:"bold" ,  color: base_year.code ? "#495057" : "#e5e5ea"}}>Time Interval:</label>
          </Col>
        <Col span={14}>
          <DateRangePicker 
            disabled = {!base_year.code}
            value={DateRange}
            defaultCalendarValue = {base_year.code && [new Date(Number(base_year.code),0,1), new Date(Number(base_year.code),11,31)]} 
            size='lg' placeholder="Select Time Interval" ranges={Ranges} 
            showOneCalendar 
            format='dd-MM-yyyy'
            disabledDate={date => base_year.code && (isAfter(date, new Date(Number(base_year.code) + 1,0,0)) || isBefore(date, new Date(Number(base_year.code),0,1)))} 
            style={{width:"100%"}}
            onChange={AnalysesDateChange}
            onClean= {ResetDateRange}
            placement='bottomEnd'
          />
        </Col>

        </Row>
        <DivAntd  style={{ backgroundColor:"#BDBDBD"  , marginLeft:"10px"}}/>
        <br></br>

        <Button disabled={!(IsSelectBaseYear && IsSelectDate)} style={{height:"3em" , marginLeft:"40px"}} label="Show Generation Fleet and Load Charts" className='p-button-warning' icon="pi pi-chart-bar" onClick={e => {SetVisible(true)}} ></Button>
        
        <br></br>
        <br></br>
        <DivAntd  style={{ backgroundColor:"#BDBDBD"  , marginLeft:"10px"}}/>
        <br></br>

        <Button disabled={!(IsSelectBaseYear && IsSelectDate)} style={{height:"3em",marginLeft:"150px",backgroundColor:"royalblue"}} label="Execute" className="hvr-grow-shadow" icon="pi pi-search" onClick={execute}></Button>
        

        <Dialog className="NetworkDataDialog" header="Generation Fleet and Load Charts" visible={visible} style={{width:"50%",height:"100%"}} modal onHide={HideDialog}> 
          <NetworkSimulationCharts label={label} color={color} generation_fleet_data2 = {generation_fleet_data2} dataForLine={dataForLine} annual_demand={annual_demand} peak_load={peak_load} DateRange={DateRange}/>
        </Dialog>
        <Dialog header="Process Info" visible={visible2} style={{width:"30%",height:"30%"}} modal onHide={HideDialog2}>
          <div>
            <label style={{width:"20%"}}>Process Name: </label>
            <InputText id="processname" autoComplete='off' value = {processname} style={{width:"100%"}} maxLength={255} onChange={(e) => setProcessName(e.target.value)}></InputText>
            <div style = {{marginTop:"20px"}}>
            <label style={{width:"20%"}}>N - 1 Contingency Analysis:</label>
            <InputSwitch id="n1_contingency"  checked ={n1_contingency} value = {n1_contingency} style={{marginLeft:"30px" , verticalAlign:"middle"}}  onChange={(e) => setN1_Contingency(e.value)}></InputSwitch>
          </div>
          </div>
          <div style={{float:"right", marginTop:"5px"}}>
            <Button disabled={processname == ''} className="hvr-grow-shadow" label="Execute" style={{color:"white", backgroundColor:"#3B82F6"}}  icon="pi pi-check" loading={loading}  onClick={execute2} ></Button>
          </div>
        </Dialog>


        </div>
        </div>
      </Panel>
          
        
      
      

    )
}

export default NetworkSimulation;