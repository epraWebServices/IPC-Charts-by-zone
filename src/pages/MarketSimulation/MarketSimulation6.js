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
import $ from 'jquery';
import './MarketSimulation.css'
import { InputText } from 'primereact/inputtext'
import MarketSimulationcharts from './MarketSimulationCharts';
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Table } from 'evergreen-ui'
import {GiWindTurbine, GiCoalWagon, GiCoalPile, GiPowerGenerator} from 'react-icons/gi';
import {FaSolarPanel} from 'react-icons/fa';
import {FcDam} from 'react-icons/fc';
import {BiCategoryAlt} from 'react-icons/bi';
Chart.register(...registerables)
Chart.register(ChartDataLabels)
const MarketSimulation = () => {
  $(document).ready(function() {
    $("input[type=number]").on("focus", function() {
      $(this).on("keydown", function(event) {
        if (event.keyCode === 38 || event.keyCode === 40) {
          event.preventDefault();
        }
      });
    });
  });
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
    const initValues = [
        {
            value: 0.0,
        },
        {
            value: 0.0,
        },
        {
            value: 0.0,
        },
        {
            value: 0.0,
        },
        {
            value: 0.0,
        },
        {
            value: 0.0,
        },
        {
            value: 0.0,
        },
        {
            value: 0.0,
        }
    ];
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
      other: "Other"
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
        other: "#000099"
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
        
        loadData().then(res => {
        });
        
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
        const [fleet_values, setfleet_values] = useState(initValues);
        const[templateHeader, setTemplateHeader] = useState()
        const [templates, setTemplates] = useState()
        const toast2 = useRef(null);
        function showTemplates(){
          setVisible2(true)
        }
        function HideDialog2(){
          setVisible2(false)
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
          var inp = $("#Natural_Gas")
          inp.val(Math.round((target_fleet["Gas"]-gen_fleet.natural_gas)*100)/100)
          var inp = $("#Hydro_Dam")
          inp.val(Math.round((target_fleet["Dam"]-gen_fleet.hydro_dam)*100)/100)
          var inp = $("#Local")
          inp.val(Math.round((target_fleet["Local Coal"]-gen_fleet.local_coal)*100)/100)
          var inp = $("#Imported")
          inp.val(Math.round((target_fleet["Import Coal"]-gen_fleet.imported_coal)*100)/100)
          var inp = $("#Lignite")
          inp.val(Math.round((target_fleet["Lignite"]-gen_fleet.lignite)*100)/100)
          var inp = $("#Solar")
          inp.val(Math.round((target_fleet["Solar"]-gen_fleet.solar_pv)*100)/100)
          var inp = $("#Onshore")
          inp.val(Math.round((target_fleet["Wind"]-gen_fleet.wind_onshore)*100)/100)
          setfleet_values([
            {
                value: target_fleet["Gas"]-gen_fleet.natural_gas,
            },
            {
                value: target_fleet["Dam"]-gen_fleet.hydro_dam,
            },
            {
                value: 0.0,
            },
            {
                value: target_fleet["Local Coal"]-gen_fleet.local_coal,
            },
            {
                value: target_fleet["Import Coal"]-gen_fleet.imported_coal,
            },
            {
                value: target_fleet["Lignite"]-gen_fleet.lignite,
            },
            {
                value: target_fleet["Solar"]-gen_fleet.solar_pv,
            },
            {
                value: target_fleet["Wind"]-gen_fleet.wind_onshore,
            }
        ])
        setVisible2(false)
        toast2.current.show({ severity: 'success', summary: 'Success', detail: 'Fleet is updated to ' + scenario + " scenario", life: 10000 });
        }
        
        const profiles = {
          "CPD": {
            "2020": [{
              "Scenario": "CPD Base",
              "Gas": 22.74,
              "Dam": 23.54,
              "Import Coal": 3.14,
              "Local Coal": 0,
              "Lignite": 1.84,
              "Wind": 32.22,
              "Solar": 41.33
            },
            {
              "Scenario": "CPD Path1",
              "Gas": 25.85,
              "Dam": 23.54,
              "Import Coal": 3.14,
              "Local Coal": 0,
              "Lignite": 1.84,
              "Wind": 32.22,
              "Solar": 41.33
            },
            {
              "Scenario": "CPD Path2",
              "Gas": 25.85,
              "Dam": 23.54,
              "Import Coal": 0,
              "Local Coal": 0,
              "Lignite": 5,
              "Wind": 29.22,
              "Solar": 34.33
            }],
            "2025": [{
              "Scenario": "CPD Base",
              "Gas": 22.74,
              "Dam": 23.54,
              "Import Coal": 3.14,
              "Local Coal": 0,
              "Lignite": 1.84,
              "Wind": 32.22,
              "Solar": 41.33
            },
            {
              "Scenario": "CPD Path1",
              "Gas": 25.85,
              "Dam": 23.54,
              "Import Coal": 3.14,
              "Local Coal": 0,
              "Lignite": 1.84,
              "Wind": 32.22,
              "Solar": 41.33
            },
            {
              "Scenario": "CPD Path2",
              "Gas": 25.85,
              "Dam": 23.54,
              "Import Coal": 0,
              "Local Coal": 0,
              "Lignite": 5,
              "Wind": 29.22,
              "Solar": 34.33
            }],
            "2030": [{
              "Scenario": "CPD Base",
              "Gas": 22.74,
              "Dam": 23.54,
              "Import Coal": 3.14,
              "Local Coal": 0,
              "Lignite": 1.84,
              "Wind": 32.22,
              "Solar": 41.33
            },
            {
              "Scenario": "CPD Path1",
              "Gas": 25.85,
              "Dam": 23.54,
              "Import Coal": 3.14,
              "Local Coal": 0,
              "Lignite": 1.84,
              "Wind": 32.22,
              "Solar": 41.33
            },
            {
              "Scenario": "CPD Path2",
              "Gas": 25.85,
              "Dam": 23.54,
              "Import Coal": 0,
              "Local Coal": 0,
              "Lignite": 5,
              "Wind": 29.22,
              "Solar": 34.33
            }]
          },
          "ARES": {
            "2020":[{
                  "Scenario": "ARES Base",
                  "Gas": 22.74,
                  "Dam": 23.54,
                  "Import Coal": 6.17,
                  "Local Coal": 0.81,
                  "Lignite": 7.50,
                  "Wind": 29.22,
                  "Solar": 34.33
              }],
            "2025":[{
              "Scenario": "ARES Base",
              "Gas": 22.74,
              "Dam": 23.54,
              "Import Coal": 6.19,
              "Local Coal": 0.81,
              "Lignite": 7.50,
              "Wind": 29.22,
              "Solar": 34.33
            }],  
            "2030":[{
              "Scenario": "ARES Base",
              "Gas": 22.74,
              "Dam": 23.54,
              "Import Coal": 6.19,
              "Local Coal": 0.81,
              "Lignite": 7.50,
              "Wind": 29.22,
              "Solar": 34.33
            }],
          }    
        }
        



        function checkMatchedTemplate(){
          // gen_fleet = {} => base year
          // fleet_values => add on
          if (base_year.code === "2030"){
            if(((Number(fleet_values[6].value) + Number(fleet_values[7].value)) >= 10 && (Number(fleet_values[6].value) + Number(fleet_values[7].value)) < 28)||  
              ((Number(fleet_values[6].value) + Number(fleet_values[7].value)) >= 0  && -12 < (Number(fleet_values[0].value) + Number(fleet_values[3].value) + Number(fleet_values[4].value) + Number(fleet_values[5].value)) && 
              (Number(fleet_values[0].value) + Number(fleet_values[3].value) + Number(fleet_values[4].value) + Number(fleet_values[5].value)) <= -6))
              {
              setMatchedTemplate("Accelerated RES")
              setTemplateHeader('Accelerated RES Templates')
              setTemplates(
                <Table>
                  <Table.Head height={100} style={{textAlign:"center"}}>
                    <Table.TextHeaderCell></Table.TextHeaderCell>
                    <Table.TextHeaderCell><BiCategoryAlt size="6em"/><br></br>Scenario</Table.TextHeaderCell>
                    <Table.TextHeaderCell><GiPowerGenerator size="6em"/><br></br>Natural Gas</Table.TextHeaderCell>
                    <Table.TextHeaderCell><FcDam size="6em"/><br></br>Hydro (Dam)</Table.TextHeaderCell>
                    <Table.TextHeaderCell><GiCoalWagon size="6em"/><br></br>Import Coal</Table.TextHeaderCell>
                    <Table.TextHeaderCell><GiCoalPile size="6em"/><br></br>Lignite</Table.TextHeaderCell>
                    <Table.TextHeaderCell><FaSolarPanel size="6em"/><br></br>Solar</Table.TextHeaderCell>
                    <Table.TextHeaderCell><GiWindTurbine size="6em"/><br></br>Wind</Table.TextHeaderCell>
                  </Table.Head>
                  <Table.VirtualBody height={50} style={{textAlign:"center"}}>
                    {profiles["ARES"][base_year.code].map((profile) => (
                      <Table.Row>
                        <Table.TextCell><Button id= {base_year.code + "_" + profile["Scenario"]} name="ARES" label="Apply" style={{width:"80px"}} className="p-button-warning" onClick={(e) => FleetFromTemplate(e)}></Button></Table.TextCell>
                        <Table.TextCell>{profile["Scenario"]}</Table.TextCell>
                        <Table.TextCell>{profile["Gas"]}</Table.TextCell>
                        <Table.TextCell>{profile["Dam"]}</Table.TextCell>
                        <Table.TextCell>{profile["Import Coal"]}</Table.TextCell>
                        <Table.TextCell>{profile["Lignite"]}</Table.TextCell>
                        <Table.TextCell>{profile["Solar"]}</Table.TextCell>
                        <Table.TextCell>{profile["Wind"]}</Table.TextCell>
                      </Table.Row>
                    ))}
                  </Table.VirtualBody>
              </Table>
              )
              }
            else if(((Number(fleet_values[0].value) + Number(fleet_values[3].value) + Number(fleet_values[4].value) + Number(fleet_values[5].value)) <= -12) ||
              (((Number(fleet_values[0].value) + Number(fleet_values[3].value) + Number(fleet_values[4].value) + Number(fleet_values[5].value)) <= 0) && (Number(fleet_values[6].value) + Number(fleet_values[7].value)) >= 28)
              )
              {
              setMatchedTemplate("Coal Phase Down")
              /*
              setTemplateHeader(
                <div>
                  <div style={{float:"left"}}>Accelerated RES Templates</div>
                  <div style={{float:"right", paddingRight:"2rem"}}>
                  <SplitButton label='Apply' className="p-button-warning" model={items}></SplitButton>
                  </div>
              </div>
              )
              */
              setTemplateHeader("Coal Phase Down Templates")
             setTemplates(
              <Table>
              <Table.Head height="auto" style={{textAlign:"center"}}>
                <Table.TextHeaderCell></Table.TextHeaderCell>
                <Table.TextHeaderCell><BiCategoryAlt size="6em"/><br></br>Scenario</Table.TextHeaderCell>
                <Table.TextHeaderCell><GiPowerGenerator size="6em"/><br></br>Natural Gas</Table.TextHeaderCell>
                <Table.TextHeaderCell><FcDam size="6em"/><br></br>Hydro (Dam)</Table.TextHeaderCell>
                <Table.TextHeaderCell><GiCoalWagon size="6em"/><br></br>Import Coal</Table.TextHeaderCell>
                <Table.TextHeaderCell><GiCoalPile size="6em"/><br></br>Lignite</Table.TextHeaderCell>
                <Table.TextHeaderCell><FaSolarPanel size="6em"/><br></br>Solar</Table.TextHeaderCell>
                <Table.TextHeaderCell><GiWindTurbine size="6em"/><br></br>Wind</Table.TextHeaderCell>
              </Table.Head>
              <Table.VirtualBody height={150} style={{textAlign:"center"}}>
                {profiles["CPD"][base_year.code].map((profile) => (
                  <Table.Row>
                    <Table.TextCell><Button id= {base_year.code + "_" + profile["Scenario"]} name="CPD" label="Apply" style={{width:"80px"}} className="p-button-warning" onClick={(e) => FleetFromTemplate(e)}></Button></Table.TextCell>
                    <Table.TextCell>{profile["Scenario"]}</Table.TextCell>
                    <Table.TextCell>{profile["Gas"]}</Table.TextCell>
                    <Table.TextCell>{profile["Dam"]}</Table.TextCell>
                    <Table.TextCell>{profile["Import Coal"]}</Table.TextCell>
                    <Table.TextCell>{profile["Lignite"]}</Table.TextCell>
                    <Table.TextCell>{profile["Solar"]}</Table.TextCell>
                    <Table.TextCell>{profile["Wind"]}</Table.TextCell>
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
        const fleet_value_handler = (event, i) => {
        
          const vals = [...fleet_values];
          const val = vals[i];
          val.value = event.currentTarget.value;
          vals[i] = val;
          initValues[i].value = val.value
          setfleet_values(vals);
          checkMatchedTemplate()
          }
          const natural_gas_decrease = async () => {           
            var inp = $("#Natural_Gas"),        
            step = Number(inp.data("step")),
            min = Number(inp.data("min")),
            val = Number(inp.val());
            val = val - step;
            if (val < min)
            {
              val = min
            }
            inp.val(val);
            const f_values = [...fleet_values];
            const f_val = f_values[0];
            f_val.value = val;
            f_values[0] = f_val;
            initValues[0].value = f_val.value
            setfleet_values(f_values);
            checkMatchedTemplate()
            }
             
          const natural_gas_increase = async () => {           
            var inp = $("#Natural_Gas"),        
            step = Number(inp.data("step")),
            val = Number(inp.val());
            val = val + step;
            inp.val(val);
            const f_values = [...fleet_values];
            const f_val = f_values[0];
            f_val.value = val;
            f_values[0] = f_val;
            initValues[0].value = f_val.value
            setfleet_values(f_values);
            checkMatchedTemplate()
            }
          /*
          const ror_decrease = async () => {            
            var inp = $("#Hydro_RoR"),        
            step = Number(inp.data("step")),
            min = Number(inp.data("min")),
            val = Number(inp.val());
            val = val - step;
            if (val < min)
            {
              val = min
            }
            inp.val(val);
            const f_values = [...fleet_values];
            const f_val = f_values[1];
            f_val.value = val;
            f_values[1] = f_val;
            initValues[1].value = f_val.value
            setfleet_values(f_values);
            }
          const ror_increase = async () => {           
            var inp = $("#Hydro_RoR"),        
            step = Number(inp.data("step")),
            val = Number(inp.val());
            val = val + step;
            inp.val(val);
            const f_values = [...fleet_values];
            const f_val = f_values[1];
            f_val.value = val;
            f_values[1] = f_val;
            initValues[1].value = f_val.value
            setfleet_values(f_values);
            }
          */
          const dam_decrease = async () => {           
            var inp = $("#Hydro_Dam"),        
            step = Number(inp.data("step")),
            min = Number(inp.data("min")),
            val = Number(inp.val());
            val = val - step;
            if (val < min)
            {
              val = min
            }
            inp.val(val);
            const f_values = [...fleet_values];
            const f_val = f_values[1];
            f_val.value = val;
            f_values[2] = f_val;
            initValues[2].value = f_val.value
            setfleet_values(f_values);
            checkMatchedTemplate()
            }
          const dam_increase = async () => {           
            var inp = $("#Hydro_Dam"),        
            step = Number(inp.data("step")),
            val = Number(inp.val());
            val = val + step;
            inp.val(val);
            const f_values = [...fleet_values];
            const f_val = f_values[1];
            f_val.value = val;
            f_values[2] = f_val;
            initValues[2].value = f_val.value
            setfleet_values(f_values);
            checkMatchedTemplate()
            }
          const local_decrease = async () => {            
            var inp = $("#Local"),        
            step = Number(inp.data("step")),
            min = Number(inp.data("min")),
            val = Number(inp.val());
            val = val - step;
            if (val < min)
            {
              val = min
            }
            inp.val(val);
            const f_values = [...fleet_values];
            const f_val = f_values[3];
            f_val.value = val;
            f_values[3] = f_val;
            initValues[3].value = f_val.value
            setfleet_values(f_values);
            checkMatchedTemplate()
            }
          const local_increase = async () => {            
            var inp = $("#Local"),        
            step = Number(inp.data("step")),
            val = Number(inp.val());
            val = val + step;
            inp.val(val);
            const f_values = [...fleet_values];
            const f_val = f_values[3];
            f_val.value = val;
            f_values[3] = f_val;
            initValues[3].value = f_val.value
            setfleet_values(f_values);
            checkMatchedTemplate()
            }
            const imported_decrease = async () => {              
              var inp = $("#Imported"),        
              step = Number(inp.data("step")),
              min = Number(inp.data("min")),
              val = Number(inp.val());
              val = val - step;
              if (val < min)
              {
                val = min
              }
              inp.val(val);
              const f_values = [...fleet_values];
              const f_val = f_values[4];
              f_val.value = val;
              f_values[4] = f_val;
              initValues[4].value = f_val.value
              setfleet_values(f_values);
              checkMatchedTemplate()
              }
            const imported_increase = async () => {              
              var inp = $("#Imported"),        
              step = Number(inp.data("step")),
              val = Number(inp.val());
              val = val + step;
              inp.val(val);
              const f_values = [...fleet_values];
              const f_val = f_values[4];
              f_val.value = val;
              f_values[4] = f_val;
              initValues[4].value = f_val.value
              setfleet_values(f_values);
              checkMatchedTemplate()
              }
            const lignite_decrease = async () => {              
              var inp = $("#Lignite"),        
              step = Number(inp.data("step")),
              min = Number(inp.data("min")),
              val = Number(inp.val());
              val = val - step;
              if (val < min)
              {
                val = min
              }
              inp.val(val);
              const f_values = [...fleet_values];
              const f_val = f_values[5];
              f_val.value = val;
              f_values[5] = f_val;
              initValues[5].value = f_val.value
              setfleet_values(f_values);
              checkMatchedTemplate()
              }
            const lignite_increase = async () => {           
              var inp = $("#Lignite"),        
              step = Number(inp.data("step")),
              val = Number(inp.val());
              val = val + step;
              inp.val(val);
              const f_values = [...fleet_values];
              const f_val = f_values[5];
              f_val.value = val;
              f_values[5] = f_val;
              initValues[5].value = f_val.value
              setfleet_values(f_values);
              checkMatchedTemplate()
              }
            const solar_decrease = async () => {             
              var inp = $("#Solar"),        
              step = Number(inp.data("step")),
              min = Number(inp.data("min")),
              val = Number(inp.val());
              val = val - step;
              if (val < min)
              {
                val = min
              }
              inp.val(val);
              const f_values = [...fleet_values];
              const f_val = f_values[6];
              f_val.value = val;
              f_values[6] = f_val;
              initValues[6].value = f_val.value
              setfleet_values(f_values);
              checkMatchedTemplate()
              }
            const solar_increase = async () => {              
              var inp = $("#Solar"),        
              step = Number(inp.data("step")),
              val = Number(inp.val());
              val = val + step;
              inp.val(val);
              const f_values = [...fleet_values];
              const f_val = f_values[6];
              f_val.value = val;
              f_values[6] = f_val;
              initValues[6].value = f_val.value
              setfleet_values(f_values);
              checkMatchedTemplate()
              }
            const onshore_decrease = async () => {              
              var inp = $("#Onshore"),        
              step = Number(inp.data("step")),
              min = Number(inp.data("min")),
              val = Number(inp.val());
              val = val - step;
              if (val < min)
              {
                val = min
              }
              inp.val(val);
              const f_values = [...fleet_values];
              const f_val = f_values[7];
              f_val.value = val;
              f_values[7] = f_val;
              initValues[7].value = f_val.value
              setfleet_values(f_values);
              checkMatchedTemplate()
              }
            const onshore_increase = async () => {             
              var inp = $("#Onshore"),        
              step = Number(inp.data("step")),
              val = Number(inp.val());
              val = val + step;
              inp.val(val);
              const f_values = [...fleet_values];
              const f_val = f_values[7];
              f_val.value = val;
              f_values[7] = f_val;
              initValues[7].value = f_val.value
              setfleet_values(f_values);
              checkMatchedTemplate()
              } 
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
                <button style= {{width:'30px', height:'30px', backgroundColor:"#007bff", color:'white', fontSize:"12px", border:"none", paddingTop:"2px", cursor:"pointer"}} data-dir_gas="-1" onClick={natural_gas_decrease}>-</button>
                <input id ="Natural_Gas" type="number" data-step="1" data-min={-gen_fleet.natural_gas} defaultValue={0} onChange={(e) => fleet_value_handler(e, 0)} style={{width:'60px', textAlign:"center", height:'30px', fontSize:"16px", border:"0", outline:"0"}}/>
                <button style= {{width:'30px', height:'30px', backgroundColor:"#007bff", color:'white', fontSize:"12px", border:"none", paddingTop:"2px", cursor:"pointer"}} data-dir_gas="+1" onClick={natural_gas_increase}>+</button>
              </td>
              <td id="Natural_Gas_Fleet" style={{backgroundColor:"#FBE5D6", textAlign:"center", border:"none", width:"70px"}}>{(Number(gen_fleet.natural_gas) + Number(fleet_values[0].value)).toFixed(2)}</td>
            </tr>

            <tr><th></th>
              <td style={{backgroundColor:"#9CD7FF", width:'160px', border:"none"}}>Hydro (Dam):</td>
              <td style={{backgroundColor:"#9CD7FF", width:'130px', textAlign:"center", border:"none"}}>{gen_fleet.hydro_dam}</td>
              <td style={{border:"none"}}>
                <button style= {{width:'30px', height:'30px', backgroundColor:"#007bff", color:'white', fontSize:"12px", border:"none", paddingTop:"2px", cursor:"pointer"}} data-dir_dam="-1" onClick={dam_decrease}>-</button>
                <input id ="Hydro_Dam" type="number" data-step="1" data-min={-gen_fleet.hydro_dam} defaultValue={0} onChange={(e) => fleet_value_handler(e, 1)} style={{width:'60px', textAlign:"center", height:'30px', fontSize:"16px", border:"0", outline:"0"}}/>
                <button style= {{width:'30px', height:'30px', backgroundColor:"#007bff", color:'white', fontSize:"12px", border:"none", paddingTop:"2px", cursor:"pointer"}} data-dir_dam="+1"onClick={dam_increase}>+</button>
              </td>
              <td id="Hydro_Dam_Fleet" style={{backgroundColor:"#9CD7FF", textAlign:"center", border:"none", width:"70px"}}>{(Number(gen_fleet.hydro_dam) + Number(fleet_values[1].value)).toFixed(2)}</td>
            </tr>
            
            <tr><th></th>
              <td style={{backgroundColor:"#EDEDED", width:'160px', border:"none"}}>Coal Fired (Local):</td>
              <td style={{backgroundColor:"#EDEDED", width:'130px', textAlign:"center", border:"none"}}>{gen_fleet.local_coal}</td>
              <td style={{border:"none"}}>
                <button style= {{width:'30px', height:'30px', backgroundColor:"#007bff", color:'white', fontSize:"12px", border:"none", paddingTop:"2px", cursor:"pointer"}} data-dir_local="-1" onClick={local_decrease}>-</button>
                <input id ="Local" type="number" data-step="1" data-min={-gen_fleet.local_coal} defaultValue={0} onChange={(e) => fleet_value_handler(e, 3)} style={{width:'60px', textAlign:"center", height:'30px', fontSize:"16px", border:"0", outline:"0"}}/>
                <button style= {{width:'30px', height:'30px', backgroundColor:"#007bff", color:'white', fontSize:"12px", border:"none", paddingTop:"2px", cursor:"pointer"}} data-dir_local="+1" onClick={local_increase}>+</button>
              </td>
              <td id="Local_Fleet" style={{backgroundColor:"#EDEDED", textAlign:"center", border:"none", width:"70px"}}>{(Number(gen_fleet.local_coal) + Number(fleet_values[3].value)).toFixed(2)}</td>
            </tr>

            <tr><th></th>
              <td style={{backgroundColor:"#EDEDED", width:'160px', border:"none"}}>Coal Fired (Imported):</td>
              <td style={{backgroundColor:"#EDEDED", width:'130px', textAlign:"center", border:"none"}}>{gen_fleet.imported_coal}</td>
              <td style={{border:"none"}}>
                <button style= {{width:'30px', height:'30px', backgroundColor:"#007bff", color:'white', fontSize:"12px", border:"none", paddingTop:"2px", cursor:"pointer"}} data-dir_imported="-1" onClick={imported_decrease}>-</button>
                <input id ="Imported" type="number" data-step="1" data-min={-gen_fleet.imported_coal} defaultValue={0} onChange={(e) => fleet_value_handler(e, 4)} style={{width:'60px', textAlign:"center", height:'30px', fontSize:"16px", border:"0", outline:"0"}}/>
                <button style= {{width:'30px', height:'30px', backgroundColor:"#007bff", color:'white', fontSize:"12px", border:"none", paddingTop:"2px", cursor:"pointer"}} data-dir_imported="+1" onClick={imported_increase}>+</button>
              </td>
              <td id="Imported_Fleet" style={{backgroundColor:"#EDEDED", textAlign:"center", border:"none", width:"70px"}}>{(Number(gen_fleet.imported_coal) + Number(fleet_values[4].value)).toFixed(2)}</td>
            </tr>

            <tr><th></th>
              <td style={{backgroundColor:"#EDEDED", width:'160px', border:"none"}}>Coal Fired (Lignite):</td>
              <td style={{backgroundColor:"#EDEDED", width:'130px', textAlign:"center", border:"none"}}>{gen_fleet.lignite}</td>
              <td style={{border:"none"}}>
                <button style= {{width:'30px', height:'30px', backgroundColor:"#007bff", color:'white', fontSize:"12px", border:"none", paddingTop:"2px", cursor:"pointer"}} data-dir_lignite="-1" onClick={lignite_decrease}>-</button>
                <input id ="Lignite" type="number" data-step="1" data-min={-gen_fleet.lignite} defaultValue={0} onChange={(e) => fleet_value_handler(e, 5)} style={{width:'60px', textAlign:"center", height:'30px', fontSize:"16px", border:"0", outline:"0"}}/>
                <button style= {{width:'30px', height:'30px', backgroundColor:"#007bff", color:'white', fontSize:"12px", border:"none", paddingTop:"2px", cursor:"pointer"}} data-dir_lignite="+1" onClick={lignite_increase}>+</button>
              </td>
              <td id="Lignite_Fleet" style={{backgroundColor:"#EDEDED", textAlign:"center", border:"none", width:"70px"}}>{(Number(gen_fleet.lignite) + Number(fleet_values[5].value)).toFixed(2)}</td>
            </tr>

            <tr><th></th>
              <td style={{backgroundColor:"#E2F0D9", width:'160px', border:"none"}}>Solar:</td>
              <td style={{backgroundColor:"#E2F0D9", width:'130px', textAlign:"center", border:"none"}}>{gen_fleet.solar_pv}</td>
              <td style={{border:"none"}}>
                <button style= {{width:'30px', height:'30px', backgroundColor:"#007bff", color:'white', fontSize:"12px", border:"none", paddingTop:"2px", cursor:"pointer"}} data-dir_solar="-1" onClick={solar_decrease}>-</button>
                <input id ="Solar" type="number" data-step="1" data-min={-gen_fleet.solar_pv} defaultValue={0} onChange={(e) => fleet_value_handler(e, 6)} style={{width:'60px', textAlign:"center", height:'30px', fontSize:"16px", border:"0", outline:"0"}}/>
                <button style= {{width:'30px', height:'30px', backgroundColor:"#007bff", color:'white', fontSize:"12px", border:"none", paddingTop:"2px", cursor:"pointer"}} data-dir_solar="+1"onClick={solar_increase}>+</button>
              </td>
              <td id="Solar_Fleet" style={{backgroundColor:"#E2F0D9", textAlign:"center", border:"none", width:"70px"}}>{(Number(gen_fleet.solar_pv) + Number(fleet_values[6].value)).toFixed(2)}</td>
            </tr>

            <tr><th></th>
              <td style={{backgroundColor:"#E2F0D9", width:'160px', border:"none"}}>Wind (Onshore):</td>
              <td style={{backgroundColor:"#E2F0D9", width:'130px', textAlign:"center", border:"none"}}>{gen_fleet.wind_onshore}</td>
              <td style={{border:"none"}}>
                <button style= {{width:'30px', height:'30px', backgroundColor:"#007bff", color:'white', fontSize:"12px", border:"none", paddingTop:"2px", cursor:"pointer"}} data-dir_onshore="-1" onClick={onshore_decrease}>-</button>
                <input id ="Onshore" type="number" data-step="1" data-min={-gen_fleet.wind_onshore} defaultValue={0} onChange={(e) => fleet_value_handler(e, 7)} style={{width:'60px', textAlign:"center", height:'30px', fontSize:"16px", border:"0", outline:"0"}}/>
                <button style= {{width:'30px', height:'30px', backgroundColor:"#007bff", color:'white', fontSize:"12px", border:"none", paddingTop:"2px", cursor:"pointer"}} data-dir_onshore="+1" onClick={onshore_increase}>+</button>
              </td>
              <td id="Onshore_Fleet" style={{backgroundColor:"#E2F0D9", textAlign:"center", border:"none", width:"70px"}}>{(Number(gen_fleet.wind_onshore) + Number(fleet_values[7].value)).toFixed(2)}</td>
            </tr>
            </table>
            {fleet.name === "Customized" && MatchedTemplate && <div>
            <br></br>
            <p style={{fontStyle:"italic", textAlign:"justify", textJustify:"inter-word"}}>You may want to analyse <b>{MatchedTemplate}</b> scenario. To see the generation fleet templates click the button below.</p>
            <div style={{textAlign:"center"}}>
              <Button label="Check the templates" style={{width: "180px"}} className="p-button-success" onClick={showTemplates}></Button>
              {visible2 && <Dialog header={templateHeader} visible={visible2} style={{width:"50%",height:"60%"}} modal onHide={HideDialog2}>
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
        let fleet_values = [Number(document.getElementById("Natural_Gas_Fleet").textContent),
        Number(document.getElementById("Hydro_Dam_Fleet").textContent),
        0,  // RoR
        Number(document.getElementById("Local_Fleet").textContent),
        Number(document.getElementById("Imported_Fleet").textContent),
        Number(document.getElementById("Lignite_Fleet").textContent),
        Number(document.getElementById("Solar_Fleet").textContent),
        Number(document.getElementById("Onshore_Fleet").textContent)]
        for (var i in fleet_values){
          if(fleet_values[i]<0){
            fleet_values[i] = 0
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