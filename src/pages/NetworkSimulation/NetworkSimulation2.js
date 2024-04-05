import React, { useState, useEffect, useRef } from 'react';
import { Divider } from 'primereact/divider';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Chart } from "primereact/chart";
import { Toast } from 'primereact/toast';
import { BaseYearService} from '../../service/BaseYearService';
import { MarketSimulationService } from '../../service/MarketSimulation/MarketSimulationService';
import { useHistory } from 'react-router-dom';
import NetworkMap from './NetworkMap_V6';
import { Dialog } from 'primereact/dialog';
import "./DialogCss.css"
const NetworkSimulation = (props) => {
    const [BaseYearList, setBaseYearList] = useState([]);
    const [AnnualLoad, setAnnualLoad] = useState([]);
    const [base_year, setbase_year] = useState([]);
    const [fleet, setfleet] = useState('');
    const [mcp_estimation, setMCPEstimation] = useState('');
    const [visibleDrop, setVisibleDrop] = useState(false);
    const [IsSelectBaseYear, setIsSelectBaseYear] = useState(false);
    const [IsSelectFleet, setIsSelectFleet] = useState(false);
    const [IsSelectMCP, setIsSelectMCP] = useState(false);
    const baseYearService = new BaseYearService();
    const marketSimulationService = new MarketSimulationService();
    const [annual_demand, SetAnnual_demand] = useState();
    const [peak_load, SetPeak_load] = useState();
    const [base_year_id, Setbase_year_id] = useState();
    const [generation_fleet_data, SetGenerationFleetData] = useState();
    const [generation_fleet_data2, SetGenerationFleetData2] = useState();
    const [label,setlabel]=useState();
    const [color,setcolor]=useState();
    const toastBR = useRef(null);
    const history = useHistory();
    const[visible, SetVisible] = useState(false)
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
    function HideDialog(){
      SetVisible(false)
    }
    function ShowMap(){
      SetVisible(true)
    }
    useEffect(() => {
        
        const loadData = async () => {
            const resBaseYearList = await baseYearService.getAll();
            if (resBaseYearList.success) {
                setBaseYearList(resBaseYearList.object);
            }    
        }
        if(base_year_id){
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
              
        }

        
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
          },
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
        
        if (data.code === 'false') {
            setIsSelectFleet(true)
            SetVisible(true)
        }else if (data.code === 'true'){
            setIsSelectFleet(true)
        }
    }


    const changemcpestimation = (data) => {
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
        const chart = {labels: label,
          datasets: [
              {
                  label: "Generation Fleet",
                  backgroundColor: color,
                  data: generation_fleet_data2,
                  datalabels:{
                    display: false
                  },
              }
          ]}
          return (
            <div>
            <Chart id="Chart1"
              data={chart}
              width="880px"
              height="300px"
              type="bar"
              options={basicOptions}
            />    
            <div></div>      
            <Divider></Divider>
            <div></div>
            <Chart id="Chart2"
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
      const execute = async () => {
        /*
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
        const fleet_values = initValues.map((item) => {
          return parseFloat(item.value);
        })
        
        const data = {
            base_year_id: base_year_id,
            fleet:dropdownItem2.code === 'true',
            fleet_values: fleet_values,
            mcp_estimation: dropdownItem4.code === 'true',
            }
        
        

        const response = await marketSimulationService.executee(data);

        if (response.success) {
            toastBR.current.show({ severity: 'success', summary: 'Success', detail: 'Your request has been received! You will be informed via e-mail after the process completed.', life: 10000 });
            history.push("/MarketSimulation")
        }
        else {
            toastBR.current.show({ severity: 'error', summary: 'Error', detail: response.message, life: 10000 });
        }
        setTimeout(() => {
          history.push('/MarketSimulationResults')
        }, 10000);
        */
    }

      
    return (
        <div className="col-12">
          <Toast ref={toastBR} position="top-right" />
            <div className="card">
              <h4>Network Simulation</h4>
                <div className='grid'>
                  <div className="col-4">
                      <div className="p-fluid">
                          <div className="field" style={{paddingBottom:"5px"}}>
                              <label style={{fontSize:"18px"}}>Base Year Selection <img src="./info_V1.png" title="Info if necessary"/></label>
                              <Dropdown id="state" value={base_year} onChange={(e) => changebase_year(e.value)} options={dropdownItems} optionLabel="name" placeholder="Select Base Year" style={{width:'250px'}}></Dropdown> 
                          </div>

                          {IsSelectBaseYear && <div className="field" style={{paddingBottom:"5px"}}>
                              <label style={{fontSize:"18px"}}>LMP Estimation <img src="./info_V1.png" title="Info if necessary"/></label>
                              <Dropdown id="state" disabled={!visibleDrop} value={mcp_estimation} onChange={(e) => changemcpestimation(e.value)} options={dropdownItems4} optionLabel="name" placeholder="Select LMP Estimation" style={{width:'250px'}} ></Dropdown>
                          </div>
                          }          
                          {IsSelectBaseYear && <div className="field" style={{paddingBottom:"10px"}}>
                              <label style={{fontSize:"18px"}}>Fleet Selection <img src="./info_V1.png" title="Info if necessary"/></label>
                              <Dropdown id="state" disabled={!visibleDrop} value={fleet} onChange={(e) => changefleet(e.value)} options={dropdownItems2} optionLabel="name" placeholder="Select Fleet" style={{width:'250px'}} ></Dropdown>
                          </div>
                          }    
                          {(fleet.code === 'false') && <div> 
                            <Dialog header="Network Map" visible={visible} style={{width:"100%",height:"100%"}} modal onHide={HideDialog}><NetworkMap base_year={base_year}></NetworkMap></Dialog>
                            </div>}      
                            {(fleet.code === 'false') && <div> 
                            <Button label="Show Map" style={{width:"110px"}} onClick={ShowMap}></Button>
                            </div>}             
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
                {IsSelectBaseYear && IsSelectFleet && IsSelectMCP && <Divider align="right">
                            <Button label="Execute" style={{color:"white"}}  icon="pi pi-search" className="p-button-outlined" onClick={execute} ></Button>
                        </Divider>}
            </div>
        </div>


    )
}

export default NetworkSimulation;