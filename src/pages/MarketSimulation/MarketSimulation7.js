import React, { useState, useEffect, useRef } from 'react';
import { Divider } from 'primereact/divider';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Chart, registerables } from 'chart.js';
import { Toast } from 'primereact/toast';
import { BaseYearService} from '../../service/BaseYearService';
import { MarketSimulationService } from '../../service/MarketSimulation/MarketSimulationService';
import { useHistory } from 'react-router-dom';
import { Dialog } from 'primereact/dialog';

import './MarketSimulation.css'
import { InputText } from 'primereact/inputtext'
import MarketSimulationcharts from './MarketSimulationCharts';
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Table } from 'evergreen-ui'
import {GiWindTurbine, GiCoalWagon, GiCoalPile, GiPowerGenerator, GiNuclearPlant, GiMeshNetwork} from 'react-icons/gi';
import {FaSolarPanel} from 'react-icons/fa';

import {BiCategoryAlt} from 'react-icons/bi';
import {MdOutlineDownload} from 'react-icons/md';
import {InputNumber} from 'primereact/inputnumber'
import { InputNumber as Inp } from 'antd';
import { Slider } from 'antd';
Chart.register(...registerables)
Chart.register(ChartDataLabels)
const MarketSimulation = () => {

    const [BaseYearList, setBaseYearList] = useState([]);
    const [dropdownItem2, setDropdownItem2] = useState(null);
    const [dropdownItem3, setDropdownItem3] = useState(null);
    const [dropdownItem4, setDropdownItem4] = useState(null);
    const [AnnualLoad, setAnnualLoad] = useState([]);
    const [base_year, setbase_year] = useState([]);
    const [fleet, setfleet] = useState('');
    const [analysis_type, setAnalysisType] = useState('');
    const [mcp_estimation, setMCPEstimation] = useState('');
    const [visibleDrop, setVisibleDrop] = useState(false);
    const [visibleDrop2, setVisibleDrop2] = useState(false);
    const [IsSelectBaseYear, setIsSelectBaseYear] = useState(false);
    const [IsSelectFleet, setIsSelectFleet] = useState(false);
    const [IsSelectAnalysis, setIsSelectAnalysis] = useState(false);
    const [IsSelectMCP, setIsSelectMCP] = useState(false);
    const baseYearService = new BaseYearService();
    const marketSimulationService = new MarketSimulationService();
    const [annual_demand, SetAnnual_demand] = useState();
    const [peak_load, SetPeak_load] = useState();
    const [base_year_id, Setbase_year_id] = useState([]);
    const [generation_fleet_data, SetGenerationFleetData] = useState();
    const [generation_fleet_data2, SetGenerationFleetData2] = useState();
    const [gen_fleet, SetGenFleet] = useState();
    const [label,setlabel]=useState();
    const [color,setcolor]=useState();
    const toastBR = useRef(null);
    const history = useHistory();
    const [visible, setVisible] = useState(false)
    const [processname, setProcessName] = useState('')

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
        entsoe: "red",
        georgia:"red"
        }
      
    useEffect(() => {
        const loadData = async () => {
            const resBaseYearList = await baseYearService.getAll();
            if (resBaseYearList.success) {
                setBaseYearList(resBaseYearList.object);
            }    
        }
        
        
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
          }
          })
        
        loadData()
        
    }, [base_year]);
    const dataForLine = {
      labels: AnnualLoad.hour,
      datasets: [
        {
          label: "Annual Load",
          data: AnnualLoad.load,
          fill: false,
          borderColor: '#ED7D31',
          backgroundColor: '#ED7D31',
          tension: 0.4,
          datalabels:{
          display: false
        }
        }
      ],
    };
    var dropdownItems = []
    for(const key in BaseYearList){                    
        var obj = {};
        obj["name"] = BaseYearList[key].base_year
        obj["code"] = BaseYearList[key].base_year
        dropdownItems.push(obj)
    }
    
    const dropdownItems2 = [
        { name: 'Base Year', code: 'true' },
        { name: 'Customized', code: 'false' },
    ];

    const dropdownItems3 = [
      { name: 'Market Simulation (Optimization)', code: 'true' },
      { name: 'Market Simulation (Machine Learning Based Estimation)', code: 'false' },
    ];

    const dropdownItems4 = [
      { name: 'YES', code: 'true' },
      { name: 'NO', code: 'false' },
    ];

    const changebase_year = (data) => {
        setVisibleDrop(true)
        setIsSelectBaseYear(true)
        setbase_year(data);
        for(const key in BaseYearList){                    
            if (BaseYearList[key].base_year === data.code){
                
                SetAnnual_demand(BaseYearList[key].annual_demand)
                SetPeak_load(BaseYearList[key].peak_load)
                Setbase_year_id(BaseYearList[key].id)
                
            }    
        }
    }
    
    const changefleet = (data) => {
        setfleet(data);
        setDropdownItem2(data)
        if (data.code === 'false') {
            setVisibleDrop2(true)
            setIsSelectFleet(true)
        }else if (data.code === 'true'){
            setVisibleDrop2(false)
            setIsSelectFleet(true)
        }
    }

    const changeanalysistype = (data) => {
      
      setDropdownItem3(data)
      setAnalysisType(data)
      setIsSelectAnalysis(true)
    }

    const changemcpestimation = (data) => {
      setDropdownItem4(data)
      setMCPEstimation(data)
      setIsSelectMCP(true)
    }


      
      const MarketSimulationFleet = (props) => {
        const {base_year} = props
        const [MatchedTemplate, setMatchedTemplate] = useState()
        const [visible2, setVisible2] = useState(false)
        const [templateHeader, setTemplateHeader] = useState()
        const [templates, setTemplates] = useState()
        const toast2 = useRef(null);
        const [demandFactor,setDemandFactor] = useState(100)
        const [sliders, setSliders] = useState([0,0,0,0,0,0,0,0,0,0])
        function showTemplates(){
          setVisible2(true)
        }
        function HideDialog2(){
          setVisible2(false)
        }
        function updateSliders(e, index){
          setSliders(sliders =>({...sliders,[index]:e}))
        }
        function FleetFromTemplate(e){
          const type = e.currentTarget.name
          const year = e.currentTarget.id.split("_")[0]
          const scenario = e.currentTarget.id.split("_")[1]
          var target_fleet = {}
          profiles[type][String(year)].map((profile) => {
            if(profile.Scenario === scenario){
              target_fleet = profile
            }
          })
          setSliders(sliders =>(
            {...sliders,
              [0]: target_fleet["Gas"] - gen_fleet.natural_gas,
              [1]: target_fleet["Dam"] - gen_fleet.hydro_dam,
              [2]: target_fleet["Local Coal"] - gen_fleet.local_coal,
              [3]: target_fleet["Import Coal"] - gen_fleet.imported_coal,
              [4]: target_fleet["Lignite"] - gen_fleet.lignite,
              [5]: target_fleet["Solar"] - gen_fleet.solar_pv,
              [6]: target_fleet["Wind"] - gen_fleet.wind_onshore,
              [7]: target_fleet["Nuclear"] - gen_fleet.nuclear,
              [8]: target_fleet["ENTSO-E"] - gen_fleet.entsoe,
              [9]: target_fleet["Georgia"] - gen_fleet.georgia,
            }
            ))

          setDemandFactor(target_fleet["Consumption"] / annual_demand * 100)
          setVisible2(false)
          toast2.current.show({ severity: 'success', summary: 'Success', detail: 'Fleet is updated to ' + scenario + " scenario", life: 10000 });
        }
        const profiles = require('./Scenarios.json') 
        
        function checkMatchedTemplate(sliders){
          if (base_year.code === "2030"){
            if(demandFactor === 100 && sliders[0] === 0 && sliders[2]=== 0 && sliders[3]=== 0 && sliders[4]=== 0 && (sliders[5]>= 5 || sliders[6]>= 5)){
              setMatchedTemplate("Accelerated RES (ARES)")
              setTemplateHeader('Accelerated RES (ARES) Templates')
              setTemplates(
                <Table>
                  <Table.Head height="auto" style={{textAlign:"center"}}>
                    <Table.TextHeaderCell></Table.TextHeaderCell>
                    <Table.TextHeaderCell><BiCategoryAlt size="6em"/><br></br>Scenario</Table.TextHeaderCell>
                    <Table.TextHeaderCell><MdOutlineDownload size="6em"/><br></br>Total Consumption (TWh)</Table.TextHeaderCell>
                    <Table.TextHeaderCell><GiPowerGenerator size="6em"/><br></br>Natural Gas<br></br>(GW)</Table.TextHeaderCell>
                    <Table.TextHeaderCell><GiCoalWagon size="6em"/><br></br>Import Coal<br></br>(GW)</Table.TextHeaderCell>
                    <Table.TextHeaderCell><GiCoalPile size="6em"/><br></br>Lignite<br></br>(GW)</Table.TextHeaderCell>
                    <Table.TextHeaderCell><FaSolarPanel size="6em"/><br></br>Solar<br></br>(GW)</Table.TextHeaderCell>
                    <Table.TextHeaderCell><GiWindTurbine size="6em"/><br></br>Wind<br></br>(GW)</Table.TextHeaderCell>
                    <Table.TextHeaderCell><GiNuclearPlant size="6em"/><br></br>Nuclear<br></br>(GW)</Table.TextHeaderCell>
                    <Table.TextHeaderCell flexBasis="12%" flexShrink={0} flexGrow={0}><GiMeshNetwork size="6em"/><br></br>Net Transfer Capacity<br></br>(GW)</Table.TextHeaderCell>
                  </Table.Head>
                  <Table.VirtualBody height={150} style={{textAlign:"center"}}>
                    {profiles["ARES"][base_year.code].map((profile) => (
                      <Table.Row>
                        <Table.TextCell><Button id= {base_year.code + "_" + profile["Scenario"]} name="ARES" label="Apply" style={{width:"80px"}} className="p-button-warning" onClick={(e) => FleetFromTemplate(e)}></Button></Table.TextCell>
                        <Table.TextCell>{profile["Scenario"]}</Table.TextCell>
                        <Table.TextCell>{profile["Consumption"]}</Table.TextCell>
                        <Table.TextCell>{profile["Gas"]}</Table.TextCell>
                        <Table.TextCell>{profile["Import Coal"]}</Table.TextCell>
                        <Table.TextCell>{profile["Lignite"]}</Table.TextCell>
                        <Table.TextCell>{profile["Solar"]}</Table.TextCell>
                        <Table.TextCell>{profile["Wind"]}</Table.TextCell>
                        <Table.TextCell>{profile["Nuclear"]}</Table.TextCell>
                        <Table.TextCell flexBasis="12%" flexShrink={0} flexGrow={0}>ENTSO-E: {profile["ENTSO-E"]}  &emsp; Georgia: {profile["Georgia"]}</Table.TextCell>
                      </Table.Row>
                    ))}
                  </Table.VirtualBody>
              </Table>
              )
              }else if((demandFactor === 100 && sliders[0] <= -3 || sliders[2] <= -0.5 || sliders[3] <= -5 || sliders[4] <= -5) && sliders[5]=== 0 && sliders[6]=== 0){
                setMatchedTemplate("Coal Phase Down (CPD)")
                setTemplateHeader('Coal Phase Down (CPD) Templates')
                setTemplates(
                  <Table>
                    <Table.Head height="auto" style={{textAlign:"center"}}>
                      <Table.TextHeaderCell></Table.TextHeaderCell>
                      <Table.TextHeaderCell><BiCategoryAlt size="6em"/><br></br>Scenario</Table.TextHeaderCell>
                      <Table.TextHeaderCell><MdOutlineDownload size="6em"/><br></br>Total Consumption (TWh)</Table.TextHeaderCell>
                      <Table.TextHeaderCell><GiPowerGenerator size="6em"/><br></br>Natural Gas<br></br>(GW)</Table.TextHeaderCell>
                      <Table.TextHeaderCell><GiCoalWagon size="6em"/><br></br>Import Coal<br></br>(GW)</Table.TextHeaderCell>
                      <Table.TextHeaderCell><GiCoalPile size="6em"/><br></br>Lignite<br></br>(GW)</Table.TextHeaderCell>
                      <Table.TextHeaderCell><FaSolarPanel size="6em"/><br></br>Solar<br></br>(GW)</Table.TextHeaderCell>
                      <Table.TextHeaderCell><GiWindTurbine size="6em"/><br></br>Wind<br></br>(GW)</Table.TextHeaderCell>
                      <Table.TextHeaderCell><GiNuclearPlant size="6em"/><br></br>Nuclear<br></br>(GW)</Table.TextHeaderCell>
                      <Table.TextHeaderCell flexBasis="12%" flexShrink={0} flexGrow={0}><GiMeshNetwork size="6em"/><br></br>Net Transfer Capacity<br></br>(GW)</Table.TextHeaderCell>
                    </Table.Head>
                    <Table.VirtualBody height={150} style={{textAlign:"center"}}>
                      {profiles["CPD"][base_year.code].map((profile) => (
                        <Table.Row>
                          <Table.TextCell><Button id= {base_year.code + "_" + profile["Scenario"]} name="CPD" label="Apply" style={{width:"80px"}} className="p-button-warning" onClick={(e) => FleetFromTemplate(e)}></Button></Table.TextCell>
                          <Table.TextCell>{profile["Scenario"]}</Table.TextCell>
                          <Table.TextCell>{profile["Consumption"]}</Table.TextCell>
                          <Table.TextCell>{profile["Gas"]}</Table.TextCell>
                          <Table.TextCell>{profile["Import Coal"]}</Table.TextCell>
                          <Table.TextCell>{profile["Lignite"]}</Table.TextCell>
                          <Table.TextCell>{profile["Solar"]}</Table.TextCell>
                          <Table.TextCell>{profile["Wind"]}</Table.TextCell>
                          <Table.TextCell>{profile["Nuclear"]}</Table.TextCell>
                          <Table.TextCell flexBasis="12%" flexShrink={0} flexGrow={0}>ENTSO-E: {profile["ENTSO-E"]}  &emsp; Georgia: {profile["Georgia"]}</Table.TextCell>
                        </Table.Row>
                      ))}
                    </Table.VirtualBody>
                </Table>
                )
              }else if(demandFactor<=85 && demandFactor>=70){
                setMatchedTemplate("Business As Usual (BAU)")
                setTemplateHeader('Business As Usual (BAU) Templates')
                setTemplates(
                  <Table>
                    <Table.Head height="auto" style={{textAlign:"center"}}>
                      <Table.TextHeaderCell></Table.TextHeaderCell>
                      <Table.TextHeaderCell><BiCategoryAlt size="6em"/><br></br>Scenario</Table.TextHeaderCell>
                      <Table.TextHeaderCell><MdOutlineDownload size="6em"/><br></br>Total Consumption (TWh)</Table.TextHeaderCell>
                      <Table.TextHeaderCell><GiPowerGenerator size="6em"/><br></br>Natural Gas<br></br>(GW)</Table.TextHeaderCell>
                      <Table.TextHeaderCell><GiCoalWagon size="6em"/><br></br>Import Coal<br></br>(GW)</Table.TextHeaderCell>
                      <Table.TextHeaderCell><GiCoalPile size="6em"/><br></br>Lignite<br></br>(GW)</Table.TextHeaderCell>
                      <Table.TextHeaderCell><FaSolarPanel size="6em"/><br></br>Solar<br></br>(GW)</Table.TextHeaderCell>
                      <Table.TextHeaderCell><GiWindTurbine size="6em"/><br></br>Wind<br></br>(GW)</Table.TextHeaderCell>
                      <Table.TextHeaderCell><GiNuclearPlant size="6em"/><br></br>Nuclear<br></br>(GW)</Table.TextHeaderCell>
                      <Table.TextHeaderCell flexBasis="12%" flexShrink={0} flexGrow={0}><GiMeshNetwork size="6em"/><br></br>Net Transfer Capacity<br></br>(GW)</Table.TextHeaderCell>
                    </Table.Head>
                    <Table.VirtualBody height={200} style={{textAlign:"center"}}>
                      {profiles["BAU"][base_year.code].map((profile) => (
                        <Table.Row>
                          <Table.TextCell><Button id= {base_year.code + "_" + profile["Scenario"]} name="BAU" label="Apply" style={{width:"80px"}} className="p-button-warning" onClick={(e) => FleetFromTemplate(e)}></Button></Table.TextCell>
                          <Table.TextCell>{profile["Scenario"]}</Table.TextCell>
                          <Table.TextCell>{profile["Consumption"]}</Table.TextCell>
                          <Table.TextCell>{profile["Gas"]}</Table.TextCell>
                          <Table.TextCell>{profile["Import Coal"]}</Table.TextCell>
                          <Table.TextCell>{profile["Lignite"]}</Table.TextCell>
                          <Table.TextCell>{profile["Solar"]}</Table.TextCell>
                          <Table.TextCell>{profile["Wind"]}</Table.TextCell>
                          <Table.TextCell>{profile["Nuclear"]}</Table.TextCell>
                          <Table.TextCell flexBasis="12%" flexShrink={0} flexGrow={0}>ENTSO-E: {profile["ENTSO-E"]}  &emsp; Georgia: {profile["Georgia"]}</Table.TextCell>
                        </Table.Row>
                      ))}
                    </Table.VirtualBody>
                </Table>
                )

              }
              else{
                setMatchedTemplate()
              }
          }
        }

          useEffect(() => {
            checkMatchedTemplate(sliders)
          }, [sliders, demandFactor])
          return (
            <div>
            <Toast ref={toast2}></Toast>
            <table style={{ border:"none", paddingTop:"10px"}}>

            <thead><tr>
              <td class="corner"></td>
              <th style={{fontSize:"18px"}}>Technology</th>
              <th style={{fontSize:"18px"}}>Fleet in<br></br>Base Year (GW)</th>
              <th style={{fontSize:"18px"}}>Fleet <br></br>Add On (GW)</th>
              <th style={{fontSize:"18px"}}>Fleet</th>
            </tr></thead>

            <tr><th></th>
              <td style={{backgroundColor:"#FBE5D6", width:'160px', border:"none"}}>Natural Gas:</td>
              <td style={{backgroundColor:"#FBE5D6", width:'130px', textAlign:"center", border:"none"}}>{gen_fleet.natural_gas}</td>
              <td style={{border:"none"}}>
                <Slider tooltip={{open:false}} value={sliders[0]} onChange={(e) => updateSliders(e, 0)} min={-Number(gen_fleet.natural_gas)} max={30} trackStyle={{backgroundColor: sliders[0] === 0? "#91d5ff" : sliders[0] > 0 ? "#34D434": "#E02828"}} handleStyle={{borderColor:sliders[0] === 0? "#91d5ff" : sliders[0] > 0 ? "#34D434": "#E02828"}}/>
              </td>
              <Inp id="gas" style={{backgroundColor:"#FBE5D6"}} min={0} max={30+gen_fleet.natural_gas} value={Math.round((gen_fleet.natural_gas + sliders[0])*100)/100} onChange={(e) => setSliders(sliders =>({...sliders,[0]:e-gen_fleet.natural_gas}))} />
            </tr>

            <tr><th></th>
              <td style={{backgroundColor:"#9CD7FF", width:'160px', border:"none"}}>Hydro (Dam):</td>
              <td style={{backgroundColor:"#9CD7FF", width:'130px', textAlign:"center", border:"none"}}>{gen_fleet.hydro_dam}</td>
              <td style={{border:"none"}}>
                <Slider tooltip={{open:false}} value={sliders[1]} onChange={(e) => updateSliders(e, 1)} min={-Number(gen_fleet.hydro_dam)} max={30} trackStyle={{backgroundColor: sliders[1] === 0? "#91d5ff" : sliders[1] > 0 ? "#34D434": "#E02828"}} handleStyle={{borderColor:sliders[1] === 0? "#91d5ff" : sliders[1] > 0 ? "#34D434": "#E02828"}}/>
              </td>
              <Inp id="dam" style={{backgroundColor:"#9CD7FF"}} min={0} max={30+gen_fleet.hydro_dam} value={Math.round((gen_fleet.hydro_dam + sliders[1])*100)/100} onChange={(e) => setSliders(sliders =>({...sliders,[1]:e-gen_fleet.hydro_dam}))} />
            </tr>
            
            <tr><th></th>
              <td style={{backgroundColor:"#EDEDED", width:'160px', border:"none"}}>Coal Fired (Local):</td>
              <td style={{backgroundColor:"#EDEDED", width:'130px', textAlign:"center", border:"none"}}>{gen_fleet.local_coal}</td>
              <td style={{border:"none"}}>
                <Slider tooltip={{open:false}} value={sliders[2]} onChange={(e) => updateSliders(e, 2)} min={-Number(gen_fleet.local_coal)} max={30} trackStyle={{backgroundColor: sliders[2] === 0? "#91d5ff" : sliders[2] > 0 ? "#34D434": "#E02828"}} handleStyle={{borderColor:sliders[2] === 0? "#91d5ff" : sliders[2] > 0 ? "#34D434": "#E02828"}}/>
              </td>
              <Inp id="local" style={{backgroundColor:"#EDEDED"}} min={0} max={30+gen_fleet.local_coal} value={Math.round((gen_fleet.local_coal + sliders[2])*100)/100} onChange={(e) => setSliders(sliders =>({...sliders,[2]:e-gen_fleet.local_coal}))} />
            </tr>

            <tr><th></th>
              <td style={{backgroundColor:"#EDEDED", width:'160px', border:"none"}}>Coal Fired (Imported):</td>
              <td style={{backgroundColor:"#EDEDED", width:'130px', textAlign:"center", border:"none"}}>{gen_fleet.imported_coal}</td>
              <td style={{border:"none"}}>
                <Slider tooltip={{open:false}} value={sliders[3]} onChange={(e) => updateSliders(e, 3)} min={-Number(gen_fleet.imported_coal)} max={30} trackStyle={{backgroundColor: sliders[3] === 0? "#91d5ff" : sliders[3] > 0 ? "#34D434": "#E02828"}} handleStyle={{borderColor:sliders[3] === 0? "#91d5ff" : sliders[3] > 0 ? "#34D434": "#E02828"}}/>
              </td>
              <Inp id="import" style={{backgroundColor:"#EDEDED"}} min={0} max={30+gen_fleet.imported_coal} value={Math.round((gen_fleet.imported_coal + sliders[3])*100)/100} onChange={(e) => setSliders(sliders =>({...sliders,[3]:e-gen_fleet.imported_coal}))} />
            </tr>

            <tr><th></th>
              <td style={{backgroundColor:"#EDEDED", width:'160px', border:"none"}}>Coal Fired (Lignite):</td>
              <td style={{backgroundColor:"#EDEDED", width:'130px', textAlign:"center", border:"none"}}>{gen_fleet.lignite}</td>
              <td style={{border:"none"}}>
                <Slider tooltip={{open:false}} value={sliders[4]} onChange={(e) => updateSliders(e, 4)} min={-Number(gen_fleet.lignite)} max={30} trackStyle={{backgroundColor: sliders[4] === 0? "#91d5ff" : sliders[4] > 0 ? "#34D434": "#E02828"}} handleStyle={{borderColor:sliders[4] === 0? "#91d5ff" : sliders[4] > 0 ? "#34D434": "#E02828"}}/>
              </td>
              <Inp id="lignite" style={{backgroundColor:"#EDEDED"}} min={0} max={30+gen_fleet.lignite} value={Math.round((gen_fleet.lignite + sliders[4])*100)/100} onChange={(e) => setSliders(sliders =>({...sliders,[4]:e-gen_fleet.lignite}))} />
            </tr>

            <tr><th></th>
              <td style={{backgroundColor:"#E2F0D9", width:'160px', border:"none"}}>Solar:</td>
              <td style={{backgroundColor:"#E2F0D9", width:'130px', textAlign:"center", border:"none"}}>{gen_fleet.solar_pv}</td>
              <td style={{border:"none"}}>
                <Slider tooltip={{open:false}} value={sliders[5]} onChange={(e) => updateSliders(e, 5)} min={-Number(gen_fleet.solar_pv)} max={30} trackStyle={{backgroundColor: sliders[5] === 0? "#91d5ff" : sliders[5] > 0 ? "#34D434": "#E02828"}} handleStyle={{borderColor:sliders[5] === 0? "#91d5ff" : sliders[5] > 0 ? "#34D434": "#E02828"}}/>
              </td>
              <Inp id= "solar" style={{backgroundColor:"#E2F0D9"}} min={0} max={30+gen_fleet.solar_pv} value={Math.round((gen_fleet.solar_pv + sliders[5])*100)/100} onChange={(e) => setSliders(sliders =>({...sliders,[5]:e-gen_fleet.solar_pv}))} />
            </tr>

            <tr><th></th>
              <td style={{backgroundColor:"#E2F0D9", width:'160px', border:"none"}}>Wind:</td>
              <td style={{backgroundColor:"#E2F0D9", width:'130px', textAlign:"center", border:"none"}}>{gen_fleet.wind_onshore}</td>
              <td style={{border:"none"}}>
                <Slider tooltip={{open:false}} value={sliders[6]} onChange={(e) => updateSliders(e, 6)} min={-Number(gen_fleet.wind_onshore)} max={30} trackStyle={{backgroundColor: sliders[6] === 0? "#91d5ff" : sliders[6] > 0 ? "#34D434": "#E02828"}} handleStyle={{borderColor:sliders[6] === 0? "#91d5ff" : sliders[6] > 0 ? "#34D434": "#E02828"}}/>
              </td>
              <Inp id="wind" style={{backgroundColor:"#E2F0D9"}} min={0} max={30+gen_fleet.wind_onshore} value={Math.round((gen_fleet.wind_onshore + sliders[6])*100)/100} onChange={(e) => setSliders(sliders =>({...sliders,[6]:e-gen_fleet.wind_onshore}))} />
            </tr>
            <tr><th></th>
              <td style={{backgroundColor:"#E2F0D9", width:'160px', border:"none"}}>Nuclear:</td>
              <td style={{backgroundColor:"#E2F0D9", width:'130px', textAlign:"center", border:"none"}}>{gen_fleet.nuclear}</td>
              <td style={{border:"none"}}>
                <Slider tooltip={{open:false}} value={sliders[7]} onChange={(e) => updateSliders(e, 7)} min={-Number(gen_fleet.nuclear)} max={30} trackStyle={{backgroundColor: sliders[7] === 0? "#91d5ff" : sliders[7] > 0 ? "#34D434": "#E02828"}} handleStyle={{borderColor:sliders[7] === 0? "#91d5ff" : sliders[7] > 0 ? "#34D434": "#E02828"}}/>
              </td>
              <Inp id="nuclear" style={{backgroundColor:"#E2F0D9"}} min={0} max={30+gen_fleet.nuclear} value={Math.round((gen_fleet.nuclear + sliders[7])*100)/100} onChange={(e) => setSliders(sliders =>({...sliders,[7]:e-gen_fleet.nuclear}))} />
            </tr>
            <tr><th></th>
              <td style={{backgroundColor:"#E2F0D9", width:'160px', border:"none"}}>ENTSO-E:</td>
              <td style={{backgroundColor:"#E2F0D9", width:'130px', textAlign:"center", border:"none"}}>{gen_fleet.entsoe}</td>
              <td style={{border:"none"}}>
                <Slider tooltip={{open:false}} value={sliders[8]} onChange={(e) => updateSliders(e, 8)} min={-Number(gen_fleet.entsoe)} max={30} trackStyle={{backgroundColor: sliders[8] === 0? "#91d5ff" : sliders[8] > 0 ? "#34D434": "#E02828"}} handleStyle={{borderColor:sliders[8] === 0? "#91d5ff" : sliders[8] > 0 ? "#34D434": "#E02828"}}/>
              </td>
              <Inp id="entsoe" style={{backgroundColor:"#E2F0D9"}} min={0} max={30+gen_fleet.entsoe} value={Math.round((gen_fleet.entsoe + sliders[8])*100)/100} onChange={(e) => setSliders(sliders =>({...sliders,[8]:e-gen_fleet.entsoe}))} />
            </tr>
            <tr><th></th>
              <td style={{backgroundColor:"#E2F0D9", width:'160px', border:"none"}}>Georgia:</td>
              <td style={{backgroundColor:"#E2F0D9", width:'130px', textAlign:"center", border:"none"}}>{gen_fleet.georgia}</td>
              <td style={{border:"none"}}>
                <Slider tooltip={{open:false}} value={sliders[9]} onChange={(e) => updateSliders(e, 9)} min={-Number(gen_fleet.georgia)} max={30} trackStyle={{backgroundColor: sliders[9] === 0? "#91d5ff" : sliders[9] > 0 ? "#34D434": "#E02828"}} handleStyle={{borderColor:sliders[9] === 0? "#91d5ff" : sliders[9] > 0 ? "#34D434": "#E02828"}}/>
              </td>
              <Inp id="georgia" style={{backgroundColor:"#E2F0D9"}} min={0} max={30+gen_fleet.georgia} value={Math.round((gen_fleet.georgia + sliders[9])*100)/100} onChange={(e) => setSliders(sliders =>({...sliders,[9]:e-gen_fleet.georgia}))} />
            </tr>
            </table>
            <br></br>
            
            Demand Factor: <InputNumber id = "demand" inputId="horizontal" value={demandFactor} min={0} max={100} onValueChange={(e) => setDemandFactor(e.value)} showButtons buttonLayout="horizontal" decrementButtonClassName="p-button-danger" incrementButtonClassName="p-button-success" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" prefix="%" style={{width:"40%", height:"40px"}}/>
            &emsp; {(annual_demand * demandFactor / 100).toFixed(2)} TWh

            {fleet.name === "Customized" && MatchedTemplate && <div>
            <br></br>
            <p style={{fontStyle:"italic", textAlign:"justify", textJustify:"inter-word"}}>You may want to analyse <b>{MatchedTemplate}</b> scenario. To see the generation fleet templates click the button below.</p>
            <div style={{textAlign:"center"}}>
              <Button label="Check the templates" style={{width: "180px"}} className="p-button-success" onClick={showTemplates}></Button>
              {visible2 && <Dialog header={templateHeader} visible={visible2} style={{width:"90%",height:"60%"}} modal onHide={HideDialog2}>
                {templates}
              </Dialog>}
            </div>
          </div>}
          </div>
          )
      }
      function HideDialog(){
        setVisible(false)
      }
      
      const execute1 = async() =>{
        setVisible(true)
        
      }
      const execute2 = async () => {
        setVisible(false)
        var fleet_values= {
          "gas": 0,
          "dam": 0,
          "local": 0,
          "import": 0,
          "lignite": 0,
          "solar": 0,
          "wind": 0,
          "nuclear": 0,
          "entsoe": 0,
          "georgia": 0,
          "demand": 0
        }
        if(fleet.name ==="Customized"){
          fleet_values= {
            "gas": Number(document.getElementById("gas").value),
            "dam": Number(document.getElementById("dam").value),
            "local": Number(document.getElementById("local").value),
            "import": Number(document.getElementById("import").value),
            "lignite": Number(document.getElementById("lignite").value),
            "solar": Number(document.getElementById("solar").value),
            "wind": Number(document.getElementById("wind").value),
            "nuclear": Number(document.getElementById("nuclear").value),
            "entsoe": Number(document.getElementById("entsoe").value),
            "georgia": Number(document.getElementById("dam").value),
            "demand": Number(document.getElementById("demand").childNodes[0].value.split("%")[1])
          }
        }
       
        /*const fleet_values = initValues.map((item) => {
          return parseFloat(item.value);
        })
        */
       
        const data = {
            base_year_id: base_year_id,
            fleet:dropdownItem2.code === 'true',
            fleet_values: fleet_values,
            analysis_type: dropdownItem3.code === 'true',
            mcp_estimation: dropdownItem4.code === 'true',
            processname: processname
            }
        

        const response = await marketSimulationService.executee(data);

        if (response.success) {
            toastBR.current.show({ severity: 'success', summary: 'Your request has been received! You will be informed via e-mail after the process completed.', detail: 'Success', life: 10000 });
            history.push("/MarketSimulation")
        }
        else {
            toastBR.current.show({ severity: 'error', summary: 'Error Message', detail: response.message, life: 10000 });
        }
        setTimeout(() => {
          history.push('/MarketSimulationResults')
        }, 10000);
    }
    return (
        <div className="col-12">
          <Toast ref={toastBR} position="top-right" />
            <div className="card">
              <h4>Market Simulation & MCP Estimation</h4>
                <div className='grid'>
                  <div className="col-4">
                      <div className="p-fluid">
                          <div className="field" style={{paddingBottom:"5px"}}>
                              <label style={{fontSize:"18px"}}>Base Year Selection <img src="./info_V1.png" title="Info if necessary"/></label>
                              <Dropdown id="state" value={base_year} onChange={(e) => changebase_year(e.value)} options={dropdownItems} optionLabel="name" placeholder="Select Base Year" style={{width:'250px'}}></Dropdown> 
                          </div>
                          {IsSelectBaseYear && <div className="field" style={{paddingBottom:"5px"}}>
                            <label style={{fontSize:"18px"}}>Analysis Type <img src="./info_V1.png" title="Info if necessary"/></label>
                            <Dropdown id="state" disabled={!visibleDrop} value={analysis_type} onChange={(e) => changeanalysistype(e.value)} options={dropdownItems3} optionLabel="name" placeholder="Select Analysis Type" style={{width:'250px'}} ></Dropdown>
                          </div>
                          }   
                          {IsSelectBaseYear && <div className="field" style={{paddingBottom:"5px"}}>
                              <label style={{fontSize:"18px"}}>MCP Estimation <img src="./info_V1.png" title="Info if necessary"/></label>
                              <Dropdown id="state" disabled={!visibleDrop} value={mcp_estimation} onChange={(e) => changemcpestimation(e.value)} options={dropdownItems4} optionLabel="name" placeholder="Select MCP Estimation" style={{width:'250px'}} ></Dropdown>
                          </div>
                          }          
                          {IsSelectBaseYear && <div className="field" style={{paddingBottom:"10px"}}>
                              <label style={{fontSize:"18px"}}>Fleet Selection <img src="./info_V1.png" title="Info if necessary"/></label>
                              <Dropdown id="state" disabled={!visibleDrop} value={fleet} onChange={(e) => changefleet(e.value)} options={dropdownItems2} optionLabel="name" placeholder="Select Fleet" style={{width:'250px'}} ></Dropdown>
                          </div>
                          }                           
                        </div>
                        {generation_fleet_data &&<div className="p-fluid" >
                          <div className="field"style={{ display: visibleDrop2 ? '' : 'none'}}>
                              {<MarketSimulationFleet base_year={base_year}/>}
                          </div>
                          
                      </div>}    
                  </div>
                  <div className="col-0">
                      <Divider layout="vertical">
                      </Divider>
                  </div>
                    <div className="col-7">
                        {IsSelectBaseYear &&<MarketSimulationcharts label={label} color={color} generation_fleet_data2 = {generation_fleet_data2} dataForLine={dataForLine} annual_demand={annual_demand} peak_load={peak_load}/>}
                    </div>
                </div>
                {IsSelectBaseYear && IsSelectFleet && IsSelectAnalysis && IsSelectMCP && <Divider align="right">
                            <Button label="Execute" style={{color:"white"}}  icon="pi pi-search" className="p-button-outlined" onClick={execute1} ></Button>
                        </Divider>}
                <Dialog header="Process Info" visible={visible} style={{width:"20%",height:"20%"}} modal onHide={HideDialog}>
                  <div>
                    <label>Process Name: </label>
                    <InputText id="processname" value = {processname} style={{width:"240px"}} maxLength={255} onChange={(e) => setProcessName(e.target.value)}></InputText>
                  </div>
                  <div style={{display: "flex", paddingTop:"5px"}}>
                    <Button disabled={processname == ''} label="Execute" style={{color:"white", backgroundColor:"#3B82F6", marginLeft: "auto" }}  icon="pi pi-search" className="p-button-outlined" onClick={execute2} ></Button>
                  </div>
                </Dialog>
                
            </div>
            <div>
            </div>
        </div>


    )
}

export default MarketSimulation;