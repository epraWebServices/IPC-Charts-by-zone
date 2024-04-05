import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { BaseYearService} from '../../service/BaseYearService';
import { Dialog } from 'primereact/dialog';

import './MarketSimulation.css'
import { Table } from 'evergreen-ui'
import {GiWindTurbine, GiCoalWagon, GiCoalPile, GiPowerGenerator, GiNuclearPlant, GiMeshNetwork} from 'react-icons/gi';
import {FaSolarPanel} from 'react-icons/fa';
import {BiCategoryAlt} from 'react-icons/bi';
import {MdOutlineDownload} from 'react-icons/md';
import {InputNumber} from 'primereact/inputnumber'
import { InputNumber as Inp } from 'antd';
import { Slider } from 'antd';

const MarketSimulationFleet = (props) => {
    const baseYearService = new BaseYearService();
    const {base_year, base_year_id, fleet, annual_demand} = props
    const [gen_fleet, SetGenFleet] = useState()
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
      if (gen_fleet){

        if(demandFactor<=85 && demandFactor>=70 && sliders[0]=== 0 && sliders[1]=== 0 && sliders[2]=== 0 && sliders[3]=== 0 && 
        sliders[4]=== 0 && sliders[5]=== 0 && sliders[6]=== 0 && sliders[7]=== 0 && sliders[8]=== 0 && sliders[9]=== 0){
          setMatchedTemplate("Business As Usual (BAU)")
          setTemplateHeader('Business As Usual (BAU) Scenarios')
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
              <Table.VirtualBody height={100} style={{textAlign:"center"}}>
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

        else if (demandFactor === 100 && sliders[0] === 0 && sliders[1] === 0 && sliders[2]=== 0 && sliders[3]=== 0 && sliders[4]=== 0 && 
        sliders[7]=== 0 && sliders[8]=== 0 && sliders[9]=== 0 && 
        (gen_fleet.solar_pv + sliders[5] >= gen_fleet.solar_pv * 1.2 || gen_fleet.wind_onshore + sliders[6] >= gen_fleet.wind_onshore * 1.2 )){
          setMatchedTemplate("Accelerated RES (ARES)")
          setTemplateHeader('Accelerated RES (ARES) Scenarios')
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
        }
        else if((base_year.code === "2030" || base_year.code === "2032") && demandFactor === 100 && gen_fleet.natural_gas + sliders[0] <= gen_fleet.natural_gas * 0.9 && 
        sliders[1] === 0 && 
        (gen_fleet.local_coal + sliders[2] <= gen_fleet.local_coal * 0.5 ||
        gen_fleet.imported_coal + sliders[3] <= gen_fleet.imported_coal * 0.5 || 
        gen_fleet.lignite + sliders[4] <= gen_fleet.lignite * 0.5) && 
        sliders[5]=== 0 && sliders[6]=== 0 && sliders[7]=== 0 && sliders[8]=== 0 && sliders[9]=== 0){
          setMatchedTemplate("Coal Phase Down (CPD)")
          setTemplateHeader('Coal Phase Down (CPD) Scenarios')
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
        }

        else if((base_year.code=="2030" || base_year.code == "2032") && demandFactor === 100 && gen_fleet.natural_gas + sliders[0] <= gen_fleet.natural_gas * 0.9 && 
        sliders[1] === 0 && sliders[2] === 0 && sliders[3] === 0 && sliders[4] === 0 && 
        sliders[5]=== 0 && sliders[6]=== 0 && sliders[7]=== 0 && sliders[8]=== 0 && sliders[9]=== 0){
          setMatchedTemplate("Coal Phase Down (CPD) or Business As Usual (BAU)")
          setTemplateHeader('Coal Phase Down (CPD) and Business As Usual (BAU) Scenarios')
          let combined_profiles = []

          profiles["CPD"][base_year.code].map((profile)=>{
            profile["name"] = "CPD"
            combined_profiles.push(profile)
          })
          
          profiles["BAU"][base_year.code].map((profile)=>{
            profile["name"] = "BAU"
            combined_profiles.push(profile)
          })
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
              <Table.VirtualBody height={240} style={{textAlign:"center"}}>
                {combined_profiles.map((profile) => (
                  <Table.Row>
                    <Table.TextCell><Button id= {base_year.code + "_" + profile["Scenario"]} name={profile.name} label="Apply" style={{width:"80px"}} className="p-button-warning" onClick={(e) => FleetFromTemplate(e)}></Button></Table.TextCell>
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

        else if(demandFactor === 100 && gen_fleet.natural_gas + sliders[0] <= gen_fleet.natural_gas * 0.9 && 
        sliders[1] === 0 && sliders[2] === 0 && sliders[3] === 0 && sliders[4] === 0 && 
        sliders[5]=== 0 && sliders[6]=== 0 && sliders[7]=== 0 && sliders[8]=== 0 && sliders[9]=== 0){
          setMatchedTemplate("Business As Usual (BAU)")
          setTemplateHeader('Business As Usual (BAU) Scenarios')
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
              <Table.VirtualBody height={100} style={{textAlign:"center"}}>
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
          setTemplateHeader()
          setTemplates()
        }
      }
    }

      useEffect(() => {

        checkMatchedTemplate(sliders)
        
      }, [sliders, demandFactor])

      useEffect(() => {
        baseYearService.getGenerationFleet(base_year_id).then(res=>{
            if (res.success) {
              const gen_fleet1 = {"natural_gas": res.object['natural_gas'],
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
              SetGenFleet(gen_fleet1)
          }
      })
      setSliders([0,0,0,0,0,0,0,0,0,0])
      setDemandFactor(100)
      },[base_year_id, fleet])

      return (
        <div>
        <Toast ref={toast2}></Toast>
        {gen_fleet &&
        <table style={{ border:"none", paddingTop:"10px"}}>

        <thead><tr>
          <td class="corner"></td>
          <th style={{fontSize:"18px", width:'30%'}}>Technology</th>
          <th style={{fontSize:"18px", width:'30%'}}>Fleet in<br></br>Base Year (GW)</th>
          <th style={{fontSize:"18px", width:'25%'}}>Fleet <br></br>Add On (GW)</th>
          <th style={{fontSize:"18px", width:'25%'}}>Fleet <br></br> (GW)</th>
        </tr></thead>

        <tr><th></th>
          <td style={{backgroundColor:"#FBE5D6", border:"none"}}>Natural Gas:</td>
          <td style={{backgroundColor:"#FBE5D6", textAlign:"center", border:"none"}}>{gen_fleet.natural_gas}</td>
          <td style={{border:"none"}}>
            <Slider style={{width:"80%"}} tooltip={{open:false}} value={sliders[0]} onChange={(e) => updateSliders(e, 0)} min={-Number(gen_fleet.natural_gas)} max={30} trackStyle={{backgroundColor: sliders[0] === 0? "#91d5ff" : sliders[0] > 0 ? "#34D434": "#E02828"}} handleStyle={{borderColor:sliders[0] === 0? "#91d5ff" : sliders[0] > 0 ? "#34D434": "#E02828"}}/>
          </td>
          <td>
          <Inp id="gas" style={{backgroundColor:"#FBE5D6", width:"100%"}} min={0} max={30+gen_fleet.natural_gas} value={Math.round((gen_fleet.natural_gas + sliders[0])*1000)/1000} onChange={(e) => setSliders(sliders =>({...sliders,[0]:e-gen_fleet.natural_gas}))} />
          </td>
          
        </tr>

        <tr><th></th>
          <td style={{backgroundColor:"#9CD7FF", border:"none"}}>Hydro (Dam):</td>
          <td style={{backgroundColor:"#9CD7FF", textAlign:"center", border:"none"}}>{gen_fleet.hydro_dam}</td>
          <td style={{border:"none"}}>
            <Slider style={{width:"80%"}} tooltip={{open:false}} value={sliders[1]} onChange={(e) => updateSliders(e, 1)} min={-Number(gen_fleet.hydro_dam)} max={30} trackStyle={{backgroundColor: sliders[1] === 0? "#91d5ff" : sliders[1] > 0 ? "#34D434": "#E02828"}} handleStyle={{borderColor:sliders[1] === 0? "#91d5ff" : sliders[1] > 0 ? "#34D434": "#E02828"}}/>
          </td>
          <td>
          <Inp id="dam" style={{backgroundColor:"#9CD7FF", width:"100%"}} min={0} max={30+gen_fleet.hydro_dam} value={Math.round((gen_fleet.hydro_dam + sliders[1])*1000)/1000} onChange={(e) => setSliders(sliders =>({...sliders,[1]:e-gen_fleet.hydro_dam}))} />
          </td>
          
        </tr>
        
        <tr><th></th>
          <td style={{backgroundColor:"#EDEDED", border:"none"}}>Local Coal:</td>
          <td style={{backgroundColor:"#EDEDED", textAlign:"center", border:"none"}}>{gen_fleet.local_coal}</td>
          <td style={{border:"none"}}>
            <Slider style={{width:"80%"}} tooltip={{open:false}} value={sliders[2]} onChange={(e) => updateSliders(e, 2)} min={-Number(gen_fleet.local_coal)} max={30} trackStyle={{backgroundColor: sliders[2] === 0? "#91d5ff" : sliders[2] > 0 ? "#34D434": "#E02828"}} handleStyle={{borderColor:sliders[2] === 0? "#91d5ff" : sliders[2] > 0 ? "#34D434": "#E02828"}}/>
          </td>
          <td>
          <Inp id="local" style={{backgroundColor:"#EDEDED", width:"100%"}} min={0} max={30+gen_fleet.local_coal} value={Math.round((gen_fleet.local_coal + sliders[2])*1000)/1000} onChange={(e) => setSliders(sliders =>({...sliders,[2]:e-gen_fleet.local_coal}))} />
          </td>
        </tr>

        <tr><th></th>
          <td style={{backgroundColor:"#EDEDED", border:"none"}}>Imported Coal:</td>
          <td style={{backgroundColor:"#EDEDED", textAlign:"center", border:"none"}}>{gen_fleet.imported_coal}</td>
          <td style={{border:"none"}}>
            <Slider style={{width:"80%"}} tooltip={{open:false}} value={sliders[3]} onChange={(e) => updateSliders(e, 3)} min={-Number(gen_fleet.imported_coal)} max={30} trackStyle={{backgroundColor: sliders[3] === 0? "#91d5ff" : sliders[3] > 0 ? "#34D434": "#E02828"}} handleStyle={{borderColor:sliders[3] === 0? "#91d5ff" : sliders[3] > 0 ? "#34D434": "#E02828"}}/>
          </td>
          <td>
          <Inp id="import" style={{backgroundColor:"#EDEDED", width:"100%"}} min={0} max={30+gen_fleet.imported_coal} value={Math.round((gen_fleet.imported_coal + sliders[3])*1000)/1000} onChange={(e) => setSliders(sliders =>({...sliders,[3]:e-gen_fleet.imported_coal}))} />
          </td>
          
        </tr>

        <tr><th></th>
          <td style={{backgroundColor:"#EDEDED", border:"none"}}>Lignite:</td>
          <td style={{backgroundColor:"#EDEDED", textAlign:"center", border:"none"}}>{gen_fleet.lignite}</td>
          <td style={{border:"none"}}>
            <Slider style={{width:"80%"}} tooltip={{open:false}} value={sliders[4]} onChange={(e) => updateSliders(e, 4)} min={-Number(gen_fleet.lignite)} max={30} trackStyle={{backgroundColor: sliders[4] === 0? "#91d5ff" : sliders[4] > 0 ? "#34D434": "#E02828"}} handleStyle={{borderColor:sliders[4] === 0? "#91d5ff" : sliders[4] > 0 ? "#34D434": "#E02828"}}/>
          </td>
          <td>
          <Inp id="lignite" style={{backgroundColor:"#EDEDED", width:"100%"}} min={0} max={30+gen_fleet.lignite} value={Math.round((gen_fleet.lignite + sliders[4])*1000)/1000} onChange={(e) => setSliders(sliders =>({...sliders,[4]:e-gen_fleet.lignite}))} />
          </td>
          
        </tr>

        <tr><th></th>
          <td style={{backgroundColor:"#E2F0D9", border:"none"}}>Solar:</td>
          <td style={{backgroundColor:"#E2F0D9", textAlign:"center", border:"none"}}>{gen_fleet.solar_pv}</td>
          <td style={{border:"none"}}>
            <Slider style={{width:"80%"}} tooltip={{open:false}} value={sliders[5]} onChange={(e) => updateSliders(e, 5)} min={-Number(gen_fleet.solar_pv)} max={50-gen_fleet.solar_pv} trackStyle={{backgroundColor: sliders[5] === 0? "#91d5ff" : sliders[5] > 0 ? "#34D434": "#E02828"}} handleStyle={{borderColor:sliders[5] === 0? "#91d5ff" : sliders[5] > 0 ? "#34D434": "#E02828"}}/>
          </td>
          <td>
          <Inp id= "solar" style={{backgroundColor:"#E2F0D9", width:"100%"}} min={0} max={50} value={Math.round((gen_fleet.solar_pv + sliders[5])*1000)/1000} onChange={(e) => setSliders(sliders =>({...sliders,[5]:e-gen_fleet.solar_pv}))} />
          </td>
          
        </tr>

        <tr><th></th>
          <td style={{backgroundColor:"#E2F0D9", border:"none"}}>Wind:</td>
          <td style={{backgroundColor:"#E2F0D9", textAlign:"center", border:"none"}}>{gen_fleet.wind_onshore}</td>
          <td style={{border:"none"}}>
            <Slider style={{width:"80%"}} tooltip={{open:false}} value={sliders[6]} onChange={(e) => updateSliders(e, 6)} min={-Number(gen_fleet.wind_onshore)} max={50-gen_fleet.wind_onshore} trackStyle={{backgroundColor: sliders[6] === 0? "#91d5ff" : sliders[6] > 0 ? "#34D434": "#E02828"}} handleStyle={{borderColor:sliders[6] === 0? "#91d5ff" : sliders[6] > 0 ? "#34D434": "#E02828"}}/>
          </td>
          <td>
          <Inp id="wind" style={{backgroundColor:"#E2F0D9", width:"100%"}} min={0} max={50} value={Math.round((gen_fleet.wind_onshore + sliders[6])*1000)/1000} onChange={(e) => setSliders(sliders =>({...sliders,[6]:e-gen_fleet.wind_onshore}))} />
          </td>
        </tr>
        <tr><th></th>
          <td style={{backgroundColor:"#EFBBBB", border:"none"}}>Nuclear:</td>
          <td style={{backgroundColor:"#EFBBBB", textAlign:"center", border:"none"}}>{gen_fleet.nuclear}</td>
          <td style={{border:"none"}}>
            <Slider style={{width:"80%"}} tooltip={{open:false}} value={sliders[7]} onChange={(e) => updateSliders(e, 7)} step={1.2} min={-Number(gen_fleet.nuclear)} max={7.2-gen_fleet.nuclear} trackStyle={{backgroundColor: sliders[7] === 0? "#91d5ff" : sliders[7] > 0 ? "#34D434": "#E02828"}} handleStyle={{borderColor:sliders[7] === 0? "#91d5ff" : sliders[7] > 0 ? "#34D434": "#E02828"}}/>
          </td>
          <td>
          <Inp id="nuclear" disabled style={{backgroundColor:"#EFBBBB", width:"100%", color:"black"}} min={0} max={7.2} step={1.2} value={Math.round((gen_fleet.nuclear + sliders[7])*1000)/1000} onChange={(e) => setSliders(sliders =>({...sliders,[7]:e-gen_fleet.nuclear}))} />
          </td>
          
        </tr>
        <tr><th></th>
          <td style={{backgroundColor:"#7FCBC4", border:"none"}}>ENTSO-E:</td>
          <td style={{backgroundColor:"#7FCBC4", textAlign:"center", border:"none"}}>{gen_fleet.entsoe}</td>
          <td style={{border:"none"}}>
            <Slider style={{width:"80%"}} tooltip={{open:false}} value={sliders[8]} onChange={(e) => updateSliders(e, 8)} step={0.1} min={-Number(gen_fleet.entsoe)} max={2.2-gen_fleet.entsoe} trackStyle={{backgroundColor: sliders[8] === 0? "#91d5ff" : sliders[8] > 0 ? "#34D434": "#E02828"}} handleStyle={{borderColor:sliders[8] === 0? "#91d5ff" : sliders[8] > 0 ? "#34D434": "#E02828"}}/>
          </td>
          <td>
          <Inp id="entsoe" style={{backgroundColor:"#7FCBC4", width:"100%"}} min={0} max={2.2} step={0.1} value={Math.round((gen_fleet.entsoe + sliders[8])*1000)/1000} onChange={(e) => setSliders(sliders =>({...sliders,[8]:e-gen_fleet.entsoe}))} />
          </td>
          
        </tr>
        <tr><th></th>
          <td style={{backgroundColor:"#7FCBC4", border:"none"}}>Georgia:</td>
          <td style={{backgroundColor:"#7FCBC4", textAlign:"center", border:"none"}}>{gen_fleet.georgia}</td>
          <td style={{border:"none"}}>
            <Slider style={{width:"80%"}} tooltip={{open:false}} value={sliders[9]} onChange={(e) => updateSliders(e, 9)} step={0.1} min={-Number(gen_fleet.georgia)} max={2-gen_fleet.georgia} trackStyle={{backgroundColor: sliders[9] === 0? "#91d5ff" : sliders[9] > 0 ? "#34D434": "#E02828"}} handleStyle={{borderColor:sliders[9] === 0? "#91d5ff" : sliders[9] > 0 ? "#34D434": "#E02828"}}/>
          </td>
          <td>
          <Inp id="georgia" style={{backgroundColor:"#7FCBC4", width:"100%"}} min={0} max={2} step={0.1} value={Math.round((gen_fleet.georgia + sliders[9])*1000)/1000} onChange={(e) => setSliders(sliders =>({...sliders,[9]:e-gen_fleet.georgia}))} />
          </td>
          
        </tr>
        </table>}
        <br></br>
        
        Demand Factor: <InputNumber id = "demand" inputId="horizontal" value={demandFactor} min={50} max={150} onValueChange={(e) => setDemandFactor(e.value)} showButtons buttonLayout="horizontal" decrementButtonClassName="p-button-danger" incrementButtonClassName="p-button-success" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" prefix="%" style={{width:"35%", height:"40px"}}/>
        &emsp; {(annual_demand * demandFactor / 100).toFixed(2)} TWh

        {fleet.name === "Customized" && MatchedTemplate && <div>
        <br></br>
        <p style={{fontStyle:"italic", textAlign:"justify", textJustify:"inter-word"}}>You may want to analyse <b>{MatchedTemplate}</b> scenario. To see the generation fleet in the scenarios click the button below.</p>
        <div style={{textAlign:"center"}}>
          <Button label="Check the scenarios" style={{width: "180px"}} className="p-button-success" onClick={showTemplates}></Button>
          {visible2 && <Dialog header={templateHeader} visible={visible2} style={{width:"90%",height:"60%"}} modal onHide={HideDialog2}>
            {templates}
          </Dialog>}
        </div>
      </div>}
      </div>
      )
  }
export default MarketSimulationFleet