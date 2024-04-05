import React, { useEffect, useState, useRef } from "react";
import { Panel } from "primereact/panel";
import {Marker, MapContainer, TileLayer, Tooltip, Polygon, Circle, Polyline, useMapEvents, Popup, useMap, CircleMarker} from "react-leaflet";
import 'leaflet/dist/leaflet.css'

import "leaflet/dist/leaflet.css";
import { Dialog } from "primereact/dialog";
import moment from "moment";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import "./ZoneMapStyle.css"
import { Accordion, AccordionTab } from 'primereact/accordion';

import { Row, Col, Select, Button, DatePicker, Tag} from 'antd';
import { Dropdown } from "primereact/dropdown";
import { background } from "ui-box";

const NetworkSimulationContingencyResult = (props) => {
  const {contingencyDefinition, contingencyResult} = props
  const [scenario, setScenario] = useState()
  const [contingency, setContingency] = useState()
  const [contingencyOptions, setContingencyOptions] = useState()
  const [congestedLines, setCongestedLines] = useState([])
  const scenarioOptions = []
  contingencyDefinition.map((definition)=>{
    if(!scenarioOptions.some(e => e.name === definition.scenario))
    scenarioOptions.push({name:definition.scenario, code:definition.scenario})
  })

  const changeScenario = (val) => {
    setScenario(val)
    setContingency()
    setCongestedLines([])
    let contingencies = []
    contingencyDefinition.map((definition)=>{
      if(definition.scenario === val.code){
        contingencies.push({
          name:definition.contingencyName, 
          code: definition.id, 
          from:[definition.from_x, definition.from_y], 
          to:[definition.to_x, definition.to_y],
          fromBus: definition.from_bus,
          toBus: definition.to_bus
        })
      }
    })
    setContingencyOptions(contingencies)
  }
  const changeContingency = (val) =>{ 
    setContingency(val)
    let congestedLines = []
    contingencyResult.map((result)=>{
      if(result.contingencyId === val.code){
        congestedLines.push({
          fromBus: result.from_bus,
          toBus: result.to_bus,
          from: [result.from_x, result.from_y],
          to: [result.to_x, result.to_y]
        })
      }
    })
    setCongestedLines(congestedLines)
  }
  return (
    <div>
      <Panel header="Select Contingency" style={{fontSize:"16px"}}>
        <Row>
          <Col span={6}>
          </Col>
          <Col span={8}>
            <label>Scenario: </label>
            <Dropdown value={scenario} options={scenarioOptions} optionLabel="name" placeholder="Select Scenario" onChange={(e)=>{changeScenario(e.value)}} style={{width:"200px"}}></Dropdown>
          </Col>
          <Col span={10}>
            <label>Contingency: </label>
            <Dropdown disabled={!scenario} value={contingency} options={contingencyOptions} optionLabel="name" placeholder="Select Contingency" onChange={(e)=>{changeContingency(e.value)}} style={{width:"200px"}}></Dropdown>
          </Col>
        </Row>
      </Panel>
      <div style={{height: '62vh', width: "100%", paddingTop:"10px"}}>
        <MapContainer
          center={[39.15, 34.25]} 
          zoom={6} 
          doubleClickZoom={false}
          style={{ height: '100%', width: "100%"}}
          dragging={true}
          zoomControl = {true}
          attributionControl={false}
          //maxZoom={7}
          //minZoom={7}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            //url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            //url='https://api.tiles.mapbox.com/v4/mapbox.light/{z}/{x}/{y}.png'
            //attribution= '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            noWrap = {true}
          />
            <Col span={5} offset={19} style={{marginRight:"10px", marginTop:"10px"}}>
              <div id="legend">
              <Accordion activeIndex={1}>
                  <AccordionTab header="Legend">
                      <Table>
                          <TableBody>
                          <TableRow>
                              <TableCell id="legend" style={{width:"90px"}}>
                                <div>
                                  <div style={{width:"16px", height:"16px", background:"rgb(100, 73, 155)", borderRadius:"50%", display:"inline-block"}}></div>
                                  <div style={{height:"4px", width:"40px", background: "rgb(100, 73, 155)", display:"inline-block", marginBottom:"6px"}}></div>
                                  <div style={{width:"16px", height:"16px", background:"rgb(100, 73, 155)", borderRadius:"50%", display:"inline-block"}}></div>
                                </div>
                              </TableCell>
                              <TableCell id="legend" style={{fontWeight:"700"}}>Contingency Definition</TableCell>
                          </TableRow>
                          <TableRow>
                              <TableCell id="legend">
                                <div>
                                  <div style={{width:"16px", height:"16px", background:"rgb(155, 125, 73)", borderRadius:"50%", display:"inline-block"}}></div>
                                  <div style={{height:"4px", width:"40px", background: "rgb(155, 125, 73)", display:"inline-block", marginBottom:"6px"}}></div>
                                  <div style={{width:"16px", height:"16px", background:"rgb(155, 125, 73)", borderRadius:"50%", display:"inline-block"}}></div>
                                </div>
                              </TableCell>
                              <TableCell id="legend" style={{fontWeight:"700"}}>Congested Lines</TableCell>
                          </TableRow>
                          </TableBody>
                      </Table>
                  </AccordionTab>
              </Accordion>
              </div>
          </Col>
          {congestedLines.map((line)=>{
            return(
              <div>
                <CircleMarker center={line.from} radius={5} pathOptions={{fillColor:"rgb(155, 125, 73)", color:"rgb(155, 125, 73)", fillOpacity:1}}><Tooltip>{line.fromBus}</Tooltip></CircleMarker>
                <CircleMarker center={line.to} radius={5} pathOptions={{fillColor:"rgb(155, 125, 73)", color:"rgb(155, 125, 73)", fillOpacity:1}}><Tooltip>{line.toBus}</Tooltip></CircleMarker>
                <Polyline positions={[line.from, line.to]} pathOptions={{color:"rgb(155, 125, 73)"}}></Polyline>
              </div>
              
            )
          })}
          {contingency && <div>
            <CircleMarker center={contingency.from} radius={5} pathOptions={{fillColor:"rgb(100, 73, 155)", color:"rgb(100, 73, 155)", fillOpacity:1}}>
              <Tooltip>{contingency.fromBus}</Tooltip>
            </CircleMarker>
            <CircleMarker center={contingency.to} radius={5} pathOptions={{fillColor:"rgb(100, 73, 155)", color:"rgb(100, 73, 155)", fillOpacity:1}}>
              <Tooltip>{contingency.toBus}</Tooltip>
            </CircleMarker>
            <Polyline positions={[contingency.from, contingency.to]} pathOptions={{fillColor:"rgb(100, 73, 155)", color:"rgb(100, 73, 155)"}}><Tooltip>Contingecy Definiton</Tooltip></Polyline>
          </div>}

        </MapContainer>
        
        {/*<Row style={{paddingTop:"1rem"}}>
          <Col span={6}></Col>
          <Col span={6} style={{textAlign:"center"}}>
          <div style={{width:"20px", height:"20px", background:"rgb(51, 136, 255)", borderRadius:"50%", display:"inline-block"}}></div>
          <div style={{height:"4px", width:"60px", background: "rgb(51, 136, 255)", display:"inline-block", marginBottom:"8px"}}></div>
          <div style={{width:"20px", height:"20px", background:"rgb(51, 136, 255)", borderRadius:"50%", display:"inline-block"}}></div>
          </Col>
          <Col span={6} style={{textAlign:"center"}}>
          <div style={{width:"20px", height:"20px", background:"red", borderRadius:"50%", display:"inline-block"}}></div>
          <div style={{height:"4px", width:"60px", background: "red", display:"inline-block", marginBottom:"8px"}}></div>
          <div style={{width:"20px", height:"20px", background:"red", borderRadius:"50%", display:"inline-block"}}></div>
          </Col>
        </Row>
        <Row>
          <Col span={6}></Col>
          <Col span={6} style={{textAlign:"center"}}>
          <b style={{display:"inline-block"}}>Contingency Definition</b>
          </Col>
          <Col span={6} style={{textAlign:"center"}}>
          <b style={{display:"inline-block"}}>Congested Lines</b>
          </Col>
        </Row>
          */}

      </div>
      
    </div>
  )
    
};

export default NetworkSimulationContingencyResult;
