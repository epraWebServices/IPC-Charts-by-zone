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
import MarketSimulationCharts from './MarketSimulationCharts_V1';
import ChartDataLabels from "chartjs-plugin-datalabels";
import MarketSimulationFleet from './MarketSimulationFleet_V2';
import Calendar from './Calendar';
import { SelectButton } from 'primereact/selectbutton';
Chart.register(...registerables)
Chart.register(ChartDataLabels)
const MarketSimulation = () => {
    const [BaseYearList, setBaseYearList] = useState([]);
    const [dropdownItem2, setDropdownItem2] = useState(null);
    const [dropdownItem3, setDropdownItem3] = useState(null);
    const [dropdownItem4, setDropdownItem4] = useState("false");
    const [AnnualLoad, setAnnualLoad] = useState([]);
    const [base_year, setbase_year] = useState([]);
    const [fleet, setfleet] = useState('');
    const [analysis_type, setAnalysisType] = useState('');
    const [mcp_estimation, setMCPEstimation] = useState('false');
    const [visibleDrop, setVisibleDrop] = useState(false);
    const [visibleDrop2, setVisibleDrop2] = useState(false);
    const [IsSelectBaseYear, setIsSelectBaseYear] = useState(false);
    const [IsSelectFleet, setIsSelectFleet] = useState(false);
    const [IsSelectAnalysis, setIsSelectAnalysis] = useState(false);
    const [IsSelectMCP, setIsSelectMCP] = useState(true);
    const baseYearService = new BaseYearService();
    const marketSimulationService = new MarketSimulationService();
    const [annual_demand, SetAnnual_demand] = useState();
    const [peak_load, SetPeak_load] = useState();
    const [base_year_id, Setbase_year_id] = useState();
    const [generation_fleet_data, SetGenerationFleetData] = useState();
    const [generation_fleet_data2, SetGenerationFleetData2] = useState();
    const [dataForLine, setdataForLine] = useState({label:[], data:[{name:"", data:[]}]});
    const [gen_fleet, SetGenFleet] = useState();
    const [label,setlabel]=useState();
    const [color,setcolor]=useState();
    const toastBR = useRef(null);
    const history = useHistory();
    const [visible, setVisible] = useState(false)
    const [processname, setProcessName] = useState('')
    const [resolution, setResolution] = useState('Yearly')
    const resolution_options = ['Yearly', 'Weekly']
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
        entsoe: "#7FCBC4",
        georgia:"#7FCBC4"
        }
    
    

    useEffect(() => {
        const loadData = async () => {
            const resBaseYearList = await baseYearService.getAll();
            if (resBaseYearList.success) {
                setBaseYearList(resBaseYearList.object);
            }    
        }
        
        if (base_year_id){
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
                }
              )
            }
            */
            {labels: labels, data: [{name:"Load", data: res.object.load}]})
            }
            

            
        })
        }
          


        
        loadData()
        
    }, [base_year]);
    
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
            obj["name"] = BaseYearList[indexes[i]].base_year
            obj["code"] = BaseYearList[indexes[i]].base_year
            dropdownItems.push(obj)
          }              
      }
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

    const changeResolution = (data) => {
      setResolution(data)
      if (data === "Weekly"){
        setMCPEstimation('false')
        setIsSelectMCP(true)
      }
    }

      

      function HideDialog(){
        setVisible(false)
      }
      
      const execute1 = async() =>{
        setVisible(true)
        
      }
      const execute2 = async () => {
        setVisible(false)
        let startweek = null
        let endweek = null
        if(document.getElementsByClassName("col cell selected")[0]){
          const weeks = document.getElementsByClassName("col cell selected")
          let week_numbers = []
          for(var i=0; i<weeks.length; i++){
            week_numbers.push(Number(weeks[i].innerText))
          }
          
          startweek = Math.min(...week_numbers)
          endweek = Math.max(...week_numbers)
        }
        var fleet_values= [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        if(fleet.name ==="Customized"){
          fleet_values = [
            Number(document.getElementById("gas").value),
            Number(document.getElementById("dam").value),
            Number(document.getElementById("local").value),
            Number(document.getElementById("import").value),
            Number(document.getElementById("lignite").value),
            Number(document.getElementById("solar").value),
            Number(document.getElementById("wind").value),
            Number(document.getElementById("nuclear").value),
            Number(document.getElementById("entsoe").value),
            Number(document.getElementById("georgia").value),
            Number(document.getElementById("demand").childNodes[0].value.split("%")[1])
          ]
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
            mcp_estimation: dropdownItem4 === 'true',
            processname: processname,
            startweek: startweek,
            endweek: endweek
            }
        const response = await marketSimulationService.executee(data);

        if (response.success) {
            toastBR.current.show({ severity: 'success', summary: 'Success', detail: 'Your request has been received! You will be informed via e-mail after the process completed.', life: 10000 });
            history.push("/MarketSimulation")
            setTimeout(() => {
              history.push('/MarketSimulationResults')
            }, 10000);
        }
        else {
            toastBR.current.show({ severity: 'error', summary: 'Error', detail: response.message, life: 10000 });
        }
        
    }

    return (
        <div className="col-12">
          <Toast ref={toastBR} position="top-right" />
            <div className="card" style={{paddingRight:"0"}}>
              <h4 style={{fontFamily:"Arial" , fontSize:"20px", fontWeight:"bold"}}>Market Simulation & MCP Estimation</h4>
                <div className='grid'>
                  <div className="col-5">
                      <div className="p-fluid">
                          <div className="field" style={{paddingBottom:"5px"}}>
                              <label style={{fontSize:"18px",fontFamily:"Arial" }}>Base Year Selection <img src="./info_V1.png" title="Info if necessary"/></label>
                              <Dropdown id="state" value={base_year} onChange={(e) => changebase_year(e.value)} options={dropdownItems} optionLabel="name" placeholder="Select Base Year" style={{width:'250px'}}></Dropdown> 
                          </div>
                          {IsSelectBaseYear && <div className="field" style={{paddingBottom:"5px"}}>
                            <label style={{fontSize:"18px" , fontFamily:"Arial"}}>Analysis Type <img src="./info_V1.png" title="Info if necessary"/></label>
                            <Dropdown id="state" disabled={!visibleDrop} value={analysis_type} onChange={(e) => changeanalysistype(e.value)} options={dropdownItems3} optionLabel="name" placeholder="Select Analysis Type" style={{width:'250px'}} ></Dropdown>
                          </div>
                          }  
                          {IsSelectBaseYear && analysis_type.name==='Market Simulation (Optimization)' && <div className="field" style={{paddingBottom:"5px"}}>
                            <label style={{fontSize:"18px" , fontFamily:"Arial"}}>Analysis Period <img src="./info_V1.png" title="Info if necessary"/></label>
                            <SelectButton value={resolution} options={resolution_options} onChange={(e) => changeResolution(e.value)} style={{width:'250px'}}></SelectButton>
                            
                          </div>
                          }  
                          {IsSelectBaseYear && analysis_type.name && (analysis_type.name === 'Market Simulation (Machine Learning Based Estimation)' || resolution === "Yearly") && <div className="field" style={{paddingBottom:"5px"}}>
                              <label style={{fontSize:"18px" , fontFamily:"Arial"}}>MCP Estimation <img src="./info_V1.png" title="Info if necessary"/></label>
                              <Dropdown id="state" disabled={!visibleDrop} value={mcp_estimation} onChange={(e) => changemcpestimation(e.value)} options={dropdownItems4} optionValue="code" optionLabel="name" placeholder="Select MCP Estimation" style={{width:'250px'}} ></Dropdown>
                          </div>
                          }   
                          {IsSelectBaseYear && analysis_type.name && analysis_type.name === 'Market Simulation (Optimization)' && resolution === "Weekly" && <div className="field" style={{paddingBottom:"5px"}}>
                              <label style={{fontSize:"18px" , fontFamily:"Arial"}}>Analysis Week<img src="./info_V1.png" title="Info if necessary"/></label>
                              <Calendar></Calendar>
                          </div>
                          }         
                          {IsSelectBaseYear && analysis_type.name && <div className="field" style={{paddingBottom:"10px"}}>
                              <label style={{fontSize:"18px" , fontFamily:"Arial"}}>Fleet Selection <img src="./info_V1.png" title="Info if necessary"/></label>
                              <Dropdown id="state" disabled={!visibleDrop} value={fleet} onChange={(e) => changefleet(e.value)} options={dropdownItems2} optionLabel="name" placeholder="Select Fleet" style={{width:'250px'}} ></Dropdown>
                          </div>
                          }                           
                        </div>
                        {generation_fleet_data &&<div className="p-fluid" >
                          <div className="field"style={{ display: visibleDrop2 ? '' : 'none'}}>
                              {<MarketSimulationFleet base_year={base_year} base_year_id={base_year_id} fleet = {fleet} annual_demand = {annual_demand}/>}
                          </div>
                          
                      </div>}    
                  </div>
                  <div className="col-0">
                      <Divider layout="vertical">
                      </Divider>
                  </div>
                    <div className="col-6">
                        {IsSelectBaseYear &&<MarketSimulationCharts label={label} color={color} generation_fleet_data2 = {generation_fleet_data2} dataForLine={dataForLine} annual_demand={annual_demand} peak_load={peak_load}/>}
                    </div>
                </div>
                {IsSelectBaseYear && IsSelectFleet && IsSelectAnalysis && IsSelectMCP && resolution && (resolution === "Yearly" || (resolution === "Weekly" && document.getElementsByClassName("col cell selected").length>=1)) &&<Divider align="right">
                            <Button label="Execute" style={{color:"white"}}  icon="pi pi-search" className="p-button-outlined" onClick={execute1} ></Button>
                        </Divider>}
                <Dialog header="Process Info" visible={visible} style={{width:"30%",height:"25%"}} modal onHide={HideDialog}>
                  <div>
                    <label style={{width:"20%"}}>Process Name: </label>
                    <InputText id="processname" autoComplete='off' value = {processname} style={{width:"100%"}} maxLength={255} onChange={(e) => setProcessName(e.target.value)}></InputText>
                  </div>
                  <div style={{float:"right", marginTop:"5px"}}>
                    <Button disabled={processname == ''} label="Execute" style={{color:"white", backgroundColor:"#3B82F6"}}  icon="pi pi-search" className="p-button-outlined" onClick={execute2} ></Button>
                  </div>
                </Dialog>
                
            </div>
            <div>
            </div>
        </div>


    )
}

export default MarketSimulation;