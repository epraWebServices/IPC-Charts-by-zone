import React, { useState, useEffect, useRef } from 'react';
import { Divider } from 'primereact/divider';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Chart } from "primereact/chart";
import { Toast } from 'primereact/toast';
import { BaseYearService} from '../../service/BaseYearService';
import { MarketSimulationService } from '../../service/MarketSimulation/MarketSimulationService';
import { useHistory } from 'react-router-dom';

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
        },
        {
            value: 0.0,
        }
        
    ];
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
              'Wind Offshore',
              'Nuclear'],
            datasets: [
                {
                    label: "Generation Fleet",
                    backgroundColor: '#42A5F5',
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
                      res.object.wind_offshore,
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
            <div><br /><br /></div>      
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
            <p style={{textAlign:"center"}}>
             Annual demand is{" "}
              <span>
                <b>{annual_demand}</b>
              </span>{" "}
              TWh.
            </p>
            <p style={{textAlign:"center"}}>
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
          return (
            <table style={{borderCollapse: "collapse"}}>
            <thead><tr><td class="corner"></td><th style={{fontSize:"20px"}}>Technology</th><th style={{fontSize:"20px"}}>Type</th><th style={{fontSize:"20px"}}>Fleet</th></tr></thead>
            <tr><th></th><td style={{backgroundColor:"#FBE5D6", width:'150px', textAlign:"center", border:"1px solid black"}}>Natural Gas</td><td style={{backgroundColor:"#FBE5D6", width:'150px', textAlign:"center", border:"1px solid black"}}></td><td style={{border:"1px solid black"}}>{<input type="number" step ="0.1" min = {0} value={fleet_values[0].value} onChange={(e) => fleet_value_handler(e, 0)} style={{backgroundColor:"#FBE5D6", width:'150px', textAlign:"center", height:'40px', fontSize:"16px", border:"None"}} id="Gas" useGrouping={false}/>}</td><td>&nbsp;GW</td></tr>
            <tr><th></th><td rowspan="2" style={{backgroundColor:"#9CD7FF", width:'150px', textAlign:"center", border:"1px solid black"}}>Hydro</td><td style={{backgroundColor:"#9CD7FF", width:'150px', textAlign:"center", border:"1px solid black"}}> Dam</td><td style={{border:"1px solid black"}}>{<input type="number" step ="0.1" min = {0} value={fleet_values[1].value} onChange={(e) => fleet_value_handler(e, 1)} style={{backgroundColor:"#9CD7FF", width:'150px', textAlign:"center", height:'40px', fontSize:"16px", border:"None"}} id="Dam" useGrouping={false}/>}</td><td>&nbsp;GW</td></tr>
            <tr><th></th><td style={{backgroundColor:"#9CD7FF", width:'150px', textAlign:"center", border:"1px solid black"}}>RoR</td><td style={{border:"1px solid black"}}>{<input type="number" step ="0.1" min = {0} value={fleet_values[2].value} onChange={(e) => fleet_value_handler(e, 2)} style={{backgroundColor:"#9CD7FF", width:'150px', textAlign:"center", height:'40px', fontSize:"16px", border:"None"}} id="RoR" useGrouping={false}/>}</td><td>&nbsp;GW</td></tr>
            <tr><th></th><td rowspan="3" style={{backgroundColor:"#EDEDED", width:'150px', textAlign:"center", border:"1px solid black"}}>Coal Fired</td><td style={{backgroundColor:"#EDEDED", width:'150px', textAlign:"center", border:"1px solid black"}}>Local</td><td style={{border:"1px solid black"}}>{<input type="number" step ="0.1" min = {0} value={fleet_values[3].value} onChange={(e) => fleet_value_handler(e, 3)} style={{backgroundColor:"#EDEDED", width:'150px', textAlign:"center", height:'40px', fontSize:"16px", border:"None"}} id="Local" useGrouping={false}/>}</td><td>&nbsp;GW</td></tr>
            <tr><th></th><td style={{backgroundColor:"#EDEDED", width:'150px', textAlign:"center", border:"1px solid black"}}>Imported</td><td style={{border:"1px solid black"}}>{<input type="number" step ="0.1" min = {0} value={fleet_values[4].value} onChange={(e) => fleet_value_handler(e, 4)} style={{backgroundColor:"#EDEDED", width:'150px', textAlign:"center", height:'40px', fontSize:"16px", border:"None"}} id="Imported" useGrouping={false}/>}</td><td>&nbsp;GW</td></tr>
            <tr><th></th><td style={{backgroundColor:"#EDEDED", width:'150px', textAlign:"center", border:"1px solid black"}}>Lignite</td><td style={{border:"1px solid black"}}>{<input type="number" step ="0.1" min = {0} value={fleet_values[5].value} onChange={(e) => fleet_value_handler(e, 5)} style={{backgroundColor:"#EDEDED", width:'150px', textAlign:"center", height:'40px', fontSize:"16px", border:"None"}} id="Lignite" useGrouping={false}/>}</td><td>&nbsp;GW</td></tr>
            <tr><th></th><td rowspan="3" style={{backgroundColor:"#E2F0D9", width:'150px', textAlign:"center", border:"1px solid black"}}>Renewables</td><td style={{backgroundColor:"#E2F0D9", width:'150px', textAlign:"center", border:"1px solid black"}}>Solar</td><td style={{border:"1px solid black"}}>{<input type="number" step ="0.1" min = {0} value={fleet_values[6].value} onChange={(e) => fleet_value_handler(e, 6)} style={{backgroundColor:"#E2F0D9", width:'150px', textAlign:"center", height:'40px', fontSize:"16px", border:"None"}} id="Solar" useGrouping={false}/>}</td><td>&nbsp;GW</td></tr>
            <tr><th></th><td style={{backgroundColor:"#E2F0D9", width:'150px', textAlign:"center", border:"1px solid black"}}>Wind Onshore</td><td style={{border:"1px solid black"}}>{<input type="number" step ="0.1" min = {0} value={fleet_values[7].value} onChange={(e) => fleet_value_handler(e, 7)} style={{backgroundColor:"#E2F0D9", width:'150px', textAlign:"center", height:'40px', fontSize:"16px", border:"None"}} id="Onshore" useGrouping={false}/>}</td><td>&nbsp;GW</td></tr>
            <tr><th></th><td style={{backgroundColor:"#E2F0D9", width:'150px', textAlign:"center", border:"1px solid black"}}>Wind Offshore</td><td style={{border:"1px solid black"}}>{<input type="number" step ="0.1" min = {0} value={fleet_values[8].value} onChange={(e) => fleet_value_handler(e, 8)} style={{backgroundColor:"#E2F0D9", width:'150px', textAlign:"center", height:'40px', fontSize:"16px", border:"None"}} id="Offshore" useGrouping={false}/>}</td><td>&nbsp;GW</td></tr>
          </table>
          
          )
      }
      const execute = async () => {
        const fleet_values = initValues.map((item) => {
          return parseFloat(item.value);
      })
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
                          <div className="field">
                              <label htmlFor="name1">Base Year Selection <img src="./info_V1.png" title="Info if necessary"/></label>
                              <Dropdown id="state" value={base_year} onChange={(e) => changebase_year(e.value)} options={dropdownItems} optionLabel="name" placeholder="Select Base Year" style={{width:'250px'}}></Dropdown> 
                          </div>
                          {IsSelectBaseYear && <div className="field">
                            <label htmlFor="name1">Analysis Type <img src="./info_V1.png" title="Info if necessary"/></label>
                            <Dropdown id="state" disabled={!visibleDrop} value={analysis_type} onChange={(e) => changeanalysistype(e.value)} options={dropdownItems3} optionLabel="name" placeholder="Select Analysis Type" style={{width:'250px'}} ></Dropdown>
                          </div>
                          }   
                          {IsSelectBaseYear && <div className="field">
                              <label htmlFor="name1">MCP Estimation <img src="./info_V1.png" title="Info if necessary"/></label>
                              <Dropdown id="state" disabled={!visibleDrop} value={mcp_estimation} onChange={(e) => changemcpestimation(e.value)} options={dropdownItems4} optionLabel="name" placeholder="Select MCP Estimation" style={{width:'250px'}} ></Dropdown>
                          </div>
                          }          
                          {IsSelectBaseYear && <div className="field">
                              <label htmlFor="name1">Fleet Selection <img src="./info_V1.png" title="Info if necessary"/></label>
                              <Dropdown id="state" disabled={!visibleDrop} value={fleet} onChange={(e) => changefleet(e.value)} options={dropdownItems2} optionLabel="name" placeholder="Select Fleet" style={{width:'250px'}} ></Dropdown>
                          </div>
                          }                           
                        </div>
                      <div className="p-fluid">
                        <div className="field"style={{ display: visibleDrop2 ? '' : 'none' }}>
                            {<MarketSimulationFleet fleet_values={initValues}/>}
                        </div>              
                      </div>    
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