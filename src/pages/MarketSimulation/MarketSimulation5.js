import React, { useState, useEffect, useRef } from 'react';
import { Divider } from 'primereact/divider';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Chart } from "primereact/chart";
import { Toast } from 'primereact/toast';
import { BaseYearService} from '../../service/BaseYearService';
import { MarketSimulationService } from '../../service/MarketSimulation/MarketSimulationService';
import { useHistory } from 'react-router-dom';
import $ from 'jquery';
import './MarketSimulation.css'
const MarketSimulation = (props) => {
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
    const toastBR = useRef(null);
    const history = useHistory();
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
    const color_dic = ["#CC66FF","#6699FF","#A6A6A6","#000000","#009900","#33CCFF","#FFC000","#990099","#000099","#F4B183","#767171","#FF0000"]
      
    useEffect(() => {
        const loadData = async () => {
            const resBaseYearList = await baseYearService.getAll();
            if (resBaseYearList.success) {
                setBaseYearList(resBaseYearList.object);
            }    
        }
        
        
        baseYearService.getGenerationFleet(base_year_id).then(res=>{
          if (res.success) {
            
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
            ]});}
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

    const MarketSimulationcharts = () => {

        const basicOptions = {
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
        };
      
        const basicOptions2 = {
          pointRadius: 0,
          maintainAspectRatio: false,
          aspectRatio: 0.8,
          plugins: {
            title: {
              display: true,
              text: 'Annual Load',
              font:{size:18},
          },
            legend: {
              display: false,
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
                text: "Load [MW]",
              },
            },
          },
        };
          return (
            <div>
            <Chart
              data={generation_fleet_data}
              width="880px"
              height="300px"
              type="bar"
              options={basicOptions}
            />    
            <div></div>      
            <Divider></Divider>
            <div><br /><br /></div>
            <Chart
                data={dataForLine}
                width="880px"
                height="300px"
                type="line"
                options={basicOptions2}
            />
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
                                    
          )
      }
      
      const MarketSimulationFleet = () => {

        
        const [fleet_values, setfleet_values] = useState(initValues);
        const fleet_value_handler = (event, i) => {
          const vals = [...fleet_values];
          const val = vals[i];
          val.value = event.currentTarget.value;
          vals[i] = val;
          initValues[i].value = val.value
          setfleet_values(vals);
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
            const f_val = f_values[2];
            f_val.value = val;
            f_values[2] = f_val;
            initValues[2].value = f_val.value
            setfleet_values(f_values);
            }
          const dam_increase = async () => {           
            var inp = $("#Hydro_Dam"),        
            step = Number(inp.data("step")),
            val = Number(inp.val());
            val = val + step;
            inp.val(val);
            const f_values = [...fleet_values];
            const f_val = f_values[2];
            f_val.value = val;
            f_values[2] = f_val;
            initValues[2].value = f_val.value
            setfleet_values(f_values);
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
              }  
          return (
            <table style={{ border:"none", paddingTop:"10px"}}>

            <thead><tr>
              <td class="corner"></td>
              <th style={{fontSize:"18px"}}>Technology</th>
              <th style={{fontSize:"18px"}}>Fleet in<br></br>Base Year (GW)</th>
              <th style={{fontSize:"18px"}}>Fleet <br></br>Add On (GW)</th>
              <th style={{fontSize:"18px"}}>Fleet</th>
            </tr></thead>

            <tr><th></th>
              <td style={{backgroundColor:"#FBE5D6", width:'150px', border:"none"}}>Natural Gas:</td>
              <td style={{backgroundColor:"#FBE5D6", width:'130px', textAlign:"center", border:"none"}}>{generation_fleet_data.datasets[0].data[0]}</td>
              <td style={{border:"none"}}>
                <button style= {{width:'30px', height:'30px', backgroundColor:"#007bff", color:'white', fontSize:"12px", border:"none", paddingTop:"2px", cursor:"pointer"}} data-dir_gas="-1" onClick={natural_gas_decrease}>-</button>
                <input id ="Natural_Gas" type="number" data-step="1" data-min={-generation_fleet_data.datasets[0].data[0]} defaultValue={0} onChange={(e) => fleet_value_handler(e, 0)} style={{width:'60px', textAlign:"center", height:'30px', fontSize:"16px", border:"0", outline:"0"}}/>
                <button style= {{width:'30px', height:'30px', backgroundColor:"#007bff", color:'white', fontSize:"12px", border:"none", paddingTop:"2px", cursor:"pointer"}} data-dir_gas="+1" onClick={natural_gas_increase}>+</button>
              </td>
              <td id="Natural_Gas_Fleet" style={{backgroundColor:"#FBE5D6", textAlign:"center", border:"none", width:"70px"}}>{(Number(generation_fleet_data.datasets[0].data[0]) + Number(fleet_values[0].value)).toFixed(2)}</td>
            </tr>

            <tr><th></th>
              <td style={{backgroundColor:"#9CD7FF", width:'150px', border:"none"}}>Hydro (Dam):</td>
              <td style={{backgroundColor:"#9CD7FF", width:'130px', textAlign:"center", border:"none"}}>{generation_fleet_data.datasets[0].data[1]}</td>
              <td style={{border:"none"}}>
                <button style= {{width:'30px', height:'30px', backgroundColor:"#007bff", color:'white', fontSize:"12px", border:"none", paddingTop:"2px", cursor:"pointer"}} data-dir_dam="-1" onClick={dam_decrease}>-</button>
                <input id ="Hydro_Dam" type="number" data-step="1" data-min={-generation_fleet_data.datasets[0].data[1]} defaultValue={0} onChange={(e) => fleet_value_handler(e, 1)} style={{width:'60px', textAlign:"center", height:'30px', fontSize:"16px", border:"0", outline:"0"}}/>
                <button style= {{width:'30px', height:'30px', backgroundColor:"#007bff", color:'white', fontSize:"12px", border:"none", paddingTop:"2px", cursor:"pointer"}} data-dir_dam="+1"onClick={dam_increase}>+</button>
              </td>
              <td id="Hydro_Dam_Fleet" style={{backgroundColor:"#9CD7FF", textAlign:"center", border:"none", width:"70px"}}>{(Number(generation_fleet_data.datasets[0].data[1]) + Number(fleet_values[1].value)).toFixed(2)}</td>
            </tr>
            
            <tr><th></th>
              <td style={{backgroundColor:"#EDEDED", width:'150px', border:"none"}}>Coal Fired (Local):</td>
              <td style={{backgroundColor:"#EDEDED", width:'130px', textAlign:"center", border:"none"}}>{generation_fleet_data.datasets[0].data[10]}</td>
              <td style={{border:"none"}}>
                <button style= {{width:'30px', height:'30px', backgroundColor:"#007bff", color:'white', fontSize:"12px", border:"none", paddingTop:"2px", cursor:"pointer"}} data-dir_local="-1" onClick={local_decrease}>-</button>
                <input id ="Local" type="number" data-step="1" data-min={-generation_fleet_data.datasets[0].data[10]} defaultValue={0} onChange={(e) => fleet_value_handler(e, 3)} style={{width:'60px', textAlign:"center", height:'30px', fontSize:"16px", border:"0", outline:"0"}}/>
                <button style= {{width:'30px', height:'30px', backgroundColor:"#007bff", color:'white', fontSize:"12px", border:"none", paddingTop:"2px", cursor:"pointer"}} data-dir_local="+1" onClick={local_increase}>+</button>
              </td>
              <td id="Local_Fleet" style={{backgroundColor:"#EDEDED", textAlign:"center", border:"none", width:"70px"}}>{(Number(generation_fleet_data.datasets[0].data[10]) + Number(fleet_values[3].value)).toFixed(2)}</td>
            </tr>

            <tr><th></th>
              <td style={{backgroundColor:"#EDEDED", width:'150px', border:"none"}}>Coal Fired (Imported):</td>
              <td style={{backgroundColor:"#EDEDED", width:'130px', textAlign:"center", border:"none"}}>{generation_fleet_data.datasets[0].data[3]}</td>
              <td style={{border:"none"}}>
                <button style= {{width:'30px', height:'30px', backgroundColor:"#007bff", color:'white', fontSize:"12px", border:"none", paddingTop:"2px", cursor:"pointer"}} data-dir_imported="-1" onClick={imported_decrease}>-</button>
                <input id ="Imported" type="number" data-step="1" data-min={-generation_fleet_data.datasets[0].data[3]} defaultValue={0} onChange={(e) => fleet_value_handler(e, 4)} style={{width:'60px', textAlign:"center", height:'30px', fontSize:"16px", border:"0", outline:"0"}}/>
                <button style= {{width:'30px', height:'30px', backgroundColor:"#007bff", color:'white', fontSize:"12px", border:"none", paddingTop:"2px", cursor:"pointer"}} data-dir_imported="+1" onClick={imported_increase}>+</button>
              </td>
              <td id="Imported_Fleet" style={{backgroundColor:"#EDEDED", textAlign:"center", border:"none", width:"70px"}}>{(Number(generation_fleet_data.datasets[0].data[3]) + Number(fleet_values[4].value)).toFixed(2)}</td>
            </tr>

            <tr><th></th>
              <td style={{backgroundColor:"#EDEDED", width:'150px', border:"none"}}>Coal Fired (Lignite):</td>
              <td style={{backgroundColor:"#EDEDED", width:'130px', textAlign:"center", border:"none"}}>{generation_fleet_data.datasets[0].data[2]}</td>
              <td style={{border:"none"}}>
                <button style= {{width:'30px', height:'30px', backgroundColor:"#007bff", color:'white', fontSize:"12px", border:"none", paddingTop:"2px", cursor:"pointer"}} data-dir_lignite="-1" onClick={lignite_decrease}>-</button>
                <input id ="Lignite" type="number" data-step="1" data-min={-generation_fleet_data.datasets[0].data[2]} defaultValue={0} onChange={(e) => fleet_value_handler(e, 5)} style={{width:'60px', textAlign:"center", height:'30px', fontSize:"16px", border:"0", outline:"0"}}/>
                <button style= {{width:'30px', height:'30px', backgroundColor:"#007bff", color:'white', fontSize:"12px", border:"none", paddingTop:"2px", cursor:"pointer"}} data-dir_lignite="+1" onClick={lignite_increase}>+</button>
              </td>
              <td id="Lignite_Fleet" style={{backgroundColor:"#EDEDED", textAlign:"center", border:"none", width:"70px"}}>{(Number(generation_fleet_data.datasets[0].data[2]) + Number(fleet_values[5].value)).toFixed(2)}</td>
            </tr>

            <tr><th></th>
              <td style={{backgroundColor:"#E2F0D9", width:'150px', border:"none"}}>Solar:</td>
              <td style={{backgroundColor:"#E2F0D9", width:'130px', textAlign:"center", border:"none"}}>{generation_fleet_data.datasets[0].data[6]}</td>
              <td style={{border:"none"}}>
                <button style= {{width:'30px', height:'30px', backgroundColor:"#007bff", color:'white', fontSize:"12px", border:"none", paddingTop:"2px", cursor:"pointer"}} data-dir_solar="-1" onClick={solar_decrease}>-</button>
                <input id ="Solar" type="number" data-step="1" data-min={-generation_fleet_data.datasets[0].data[6]} defaultValue={0} onChange={(e) => fleet_value_handler(e, 6)} style={{width:'60px', textAlign:"center", height:'30px', fontSize:"16px", border:"0", outline:"0"}}/>
                <button style= {{width:'30px', height:'30px', backgroundColor:"#007bff", color:'white', fontSize:"12px", border:"none", paddingTop:"2px", cursor:"pointer"}} data-dir_solar="+1"onClick={solar_increase}>+</button>
              </td>
              <td id="Solar_Fleet" style={{backgroundColor:"#E2F0D9", textAlign:"center", border:"none", width:"70px"}}>{(Number(generation_fleet_data.datasets[0].data[6]) + Number(fleet_values[6].value)).toFixed(2)}</td>
            </tr>

            <tr><th></th>
              <td style={{backgroundColor:"#E2F0D9", width:'150px', border:"none"}}>Wind (Onshore):</td>
              <td style={{backgroundColor:"#E2F0D9", width:'130px', textAlign:"center", border:"none"}}>{generation_fleet_data.datasets[0].data[4]}</td>
              <td style={{border:"none"}}>
                <button style= {{width:'30px', height:'30px', backgroundColor:"#007bff", color:'white', fontSize:"12px", border:"none", paddingTop:"2px", cursor:"pointer"}} data-dir_onshore="-1" onClick={onshore_decrease}>-</button>
                <input id ="Onshore" type="number" data-step="1" data-min={-generation_fleet_data.datasets[0].data[4]} defaultValue={0} onChange={(e) => fleet_value_handler(e, 7)} style={{width:'60px', textAlign:"center", height:'30px', fontSize:"16px", border:"0", outline:"0"}}/>
                <button style= {{width:'30px', height:'30px', backgroundColor:"#007bff", color:'white', fontSize:"12px", border:"none", paddingTop:"2px", cursor:"pointer"}} data-dir_onshore="+1" onClick={onshore_increase}>+</button>
              </td>
              <td id="Onshore_Fleet" style={{backgroundColor:"#E2F0D9", textAlign:"center", border:"none", width:"70px"}}>{(Number(generation_fleet_data.datasets[0].data[4]) + Number(fleet_values[7].value)).toFixed(2)}</td>
            </tr>
            </table>
          
          )
      }
      const execute = async () => {
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
                            {<MarketSimulationFleet fleet_values={initValues}/>}
                        </div>              
                      </div>}    
                  </div>
                  <div className="col-0">
                      <Divider layout="vertical">
                      </Divider>
                  </div>
                    <div className="col-7">
                        {IsSelectBaseYear &&<MarketSimulationcharts/>}
                    </div>
                </div>
                {IsSelectBaseYear && IsSelectFleet && IsSelectAnalysis && IsSelectMCP && <Divider align="right">
                            <Button label="Execute" style={{color:"white"}}  icon="pi pi-search" className="p-button-outlined" onClick={execute} ></Button>
                        </Divider>}
            </div>
        </div>


    )
}

export default MarketSimulation;