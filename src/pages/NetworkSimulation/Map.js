
import { MapContainer, Circle, TileLayer, Tooltip, Popup, Polyline, Marker, CircleMarker} from "react-leaflet";
import { icon } from "leaflet"
import {useMapEvents} from "react-leaflet";
import 'leaflet/dist/leaflet.css'
import L from "leaflet";
import { Toast } from 'primereact/toast';
import "react-leaflet-fullscreen/dist/styles.css";
import { Checkbox } from "primereact/checkbox";
import Legend from "./MapLegend";
import React, { useEffect, useState, useRef } from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
import { Grid } from "semantic-ui-react";
import { InputNumber, InputGroup } from 'rsuite';
const Lmap = (props) => {
  const line_colors = ['red', 'blue', 'gray']
  const bus_colors = ['green', 'blue', 'red']
  const { busData } = props;
  const { lineData } = props;
  const [UpdatedBusData, SetBusData] = useState(busData)
  const [UpdatedLineData, SetLineData] = useState(lineData)
  const[ x, setX] = useState()
  const [footerGroup, setfooterGroup] = useState()
  const [generation_fleet, SetGenerationFleet] = useState()
  const [OutServNo, SetOutServNo] = useState(0)
  const toast = useRef(null);
  /*
  let DefaultIcon = icon({
    iconUrl: require("./legend.png"),
  });
  */
  const [value, setValue] = React.useState(0);
  const handleMinus = () => {
    setValue(parseInt(value, 10) - 1);
  };
  const handlePlus = () => {
    setValue(parseInt(value, 10) + 1);
  };
  function getStatus(data){
    if(Object.keys(data.generation).length === 0){
      return 0  // No generation
    }else{
      const length = Object.keys(data.generation).length
      var checked_length = 0
      for (var k=0; k<length; k++){
        if(data.generation[Object.keys(data.generation)[k]].checked === false){
          checked_length += 1
        }
      }
      if(checked_length === 0){
        return 1  // All in service
      }
      else if(length === checked_length){
        return 0  //All out of service
      }
      else{
        return 3  // A part is out of service
      }
    }
    
  }

  function onCheckboxChange(){
    
    const id = Number(this.id.split('-')[0])
    const unit = this.id.split('-')[1]
    
    const row = UpdatedBusData.data.find(data => data.id === id)
    const bus_data_key = Object.keys(UpdatedBusData.data).find(key => UpdatedBusData.data[key] === row)
    if(row.generation[unit].checked){
      UpdatedBusData.data[bus_data_key].generation[unit].checked = false
    }else{
      UpdatedBusData.data[bus_data_key].generation[unit].checked = true
    }
    SetBusData(UpdatedBusData)
    setX(Math.random())
    
  }
  function onlineChange(){
    const id = Number(this.id)
    const row = UpdatedLineData.data.find(data => data.id === id)
    const line_data_key = Object.keys(UpdatedLineData.data).find(key => UpdatedLineData.data[key] === row)
    if(row.outofservice){
      UpdatedLineData.data[line_data_key].outofservice = false
    }else{
      UpdatedLineData.data[line_data_key].outofservice = true
    }
    SetLineData(UpdatedLineData)
    setX(Math.random())
  }

  function ClickBus() {
    if(this.options.color === "purple"){
      toast.current.show({severity: 'warn', summary: 'No Generation Unit', detail: 'There is no generation unit in this substation. Please select other substations.', life: 5000});
    }
  }
  useEffect(()=>{
    SetBusData(UpdatedBusData)
    SetLineData(UpdatedLineData)
    var base = {
      "Natural Gas": 0,
      "Hydro (Dam)": 0,
      "Hydro (RoR)": 0,
      "Hard Coal": 0,
      "Import Coal": 0,
      "Lignite": 0,
      "Geothermal": 0,
      "Biomass": 0,
      "Solar": 0,
      "Wind": 0,
      "ENTSOE": 0,
      "Georgia": 0,
      "Other": 0
    }

    for (var i=0; i<Object.keys(UpdatedBusData.data).length; i++){
      for (var j=0; j< Object.keys(UpdatedBusData.data[Object.keys(UpdatedBusData.data)[i]].generation).length; j++){
        if(UpdatedBusData.data[Object.keys(UpdatedBusData.data)[i]].generation[Object.keys(UpdatedBusData.data[Object.keys(UpdatedBusData.data)[i]].generation)[j]].checked){
          base[Object.keys(UpdatedBusData.data[Object.keys(UpdatedBusData.data)[i]].generation)[j]] += UpdatedBusData.data[Object.keys(UpdatedBusData.data)[i]].generation[Object.keys(UpdatedBusData.data[Object.keys(UpdatedBusData.data)[i]].generation)[j]].capacity
        }
        
      }
    }
    const total_generation = Object.values(base).reduce((partialSum, a) => partialSum + a, 0).toFixed(2)
    const a = [
      {"type": "Natural Gas", "fleet": base["Natural Gas"].toFixed(2)},
      {"type": "Hydro (Dam)", "fleet": base["Hydro (Dam)"].toFixed(2)},
      {"type": "Hydro (RoR)", "fleet": base["Hydro (RoR)"].toFixed(2)},
      {"type": "Hard Coal", "fleet": base["Hard Coal"].toFixed(2)},
      {"type": "Import Coal", "fleet": base["Import Coal"].toFixed(2)},
      {"type": "Lignite", "fleet": base["Lignite"].toFixed(2)},
      {"type": "Geothermal", "fleet": base["Geothermal"].toFixed(2)},
      {"type": "Biomass", "fleet": base["Biomass"].toFixed(2)},
      {"type": "Solar", "fleet": base["Solar"].toFixed(2)},
      {"type": "Wind", "fleet": base["Wind"].toFixed(2)}, 
      {"type": "ENTSOE", "fleet": base["ENTSOE"].toFixed(2)},
      {"type": "Georgia", "fleet": base["Georgia"].toFixed(2)},
      {"type": "Other", "fleet": base["Other"].toFixed(2)}
    ]
    SetGenerationFleet(a)
    setfooterGroup (
      <ColumnGroup>
        <Row>
          <Column footer="Total" colSpan={1}/>
          <Column footer={total_generation} />
        </Row>
      </ColumnGroup>
    )
    var count = 0
    for (i=0; i<Object.keys(UpdatedLineData.data).length; i++){
      if(UpdatedLineData.data[i].outofservice){
        count += 1
      }
    }
    SetOutServNo(count)
  },[x])

  return (
    
    <div>
    <div style={{fontSize:"18px", color:"red"}}>By clicking on checkboxes showing up as popup after clicking on substations and transmission lines, status of generation units and lines can be changed.</div>
    <div style={{paddingTop:"5px"}}>
    <Grid columns={2}>
      <Grid.Column>
        <div>
          <div style={{ height: '75vh', width: '70vw'}}>
          <MapContainer
            center={[39, 35.5]} 
            zoom={6} 
            doubleClickZoom={false}
            style={{ height: '100%', width: '100%'}}
            dragging={true}
            >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution= '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              noWrap = {true}
            />
            {UpdatedBusData.data.map((data) =>{
              const color1 = getStatus(data) === 0? bus_colors[2] : data.baseKV === 400? bus_colors[0] : bus_colors[1]
              //const color2 = data.baseKV === 154? bus_colors[1] : getStatus(data)=== 1 ? bus_colors[0]: getStatus(data) === 0 ? bus_colors[2] : getStatus(data) === 2 ? bus_colors[1]: bus_colors[0]
              return(
                <CircleMarker
                  center = {data['coordinates']}
                  radius = {data.baseKV === 400? 5 : 5}
                  opacity= {0.5}
                  fillOpacity= {0.5}
                  id = {data.id}
                  pathOptions={{
                    color: color1,
                    fillColor: color1
                  }}  
                  eventHandlers={{click: ClickBus}}
                >
                  {Object.keys(data.generation).length > 0 && <Popup>
                    <div>
                      <span style={{fontSize:"14px"}}>{data['name']}</span><br></br>
                      {Object.keys(data.generation)[0] && <div className="field-checkbox">
                        <Checkbox id={data.id + "-" + Object.keys(data.generation)[0]} checked={data.generation[Object.keys(data.generation)[0]].checked} onChange={onCheckboxChange}/>
                        <label>{Object.keys(data.generation)[0]} : {data.generation[Object.keys(data.generation)[0]].capacity.toFixed(2)} MW</label>
                      </div>}
                      {Object.keys(data.generation)[1] && <div className="field-checkbox">
                        <Checkbox id={data.id + "-" + Object.keys(data.generation)[1]} checked={data.generation[Object.keys(data.generation)[1]].checked} onChange={onCheckboxChange}/>
                        <label>{Object.keys(data.generation)[1]} : {data.generation[Object.keys(data.generation)[1]].capacity.toFixed(2)} MW</label>
                      </div>}
                      {Object.keys(data.generation)[2] && <div className="field-checkbox">
                        <Checkbox id={data.id + "-" + Object.keys(data.generation)[2]} checked={data.generation[Object.keys(data.generation)[2]].checked} onChange={onCheckboxChange}/>
                        <label>{Object.keys(data.generation)[2]} : {data.generation[Object.keys(data.generation)[2]].capacity.toFixed(2)} MW</label>
                      </div>}
                      {Object.keys(data.generation)[3] && <div className="field-checkbox">
                        <Checkbox id={data.id + "-" + Object.keys(data.generation)[3]} checked={data.generation[Object.keys(data.generation)[3]].checked} onChange={onCheckboxChange}/>
                        <label>{Object.keys(data.generation)[3]} : {data.generation[Object.keys(data.generation)[3]].capacity.toFixed(2)} MW</label>
                      </div>}
                      {Object.keys(data.generation)[4] && <div className="field-checkbox">
                        <Checkbox id={data.id + "-" + Object.keys(data.generation)[4]} checked={data.generation[Object.keys(data.generation)[4]].checked} onChange={onCheckboxChange}/>
                        <label>{Object.keys(data.generation)[4]} : {data.generation[Object.keys(data.generation)[4]].capacity.toFixed(2)} MW</label>
                      </div>}
                    </div>
                  </Popup>}
                  <Tooltip>
                    <label style={{fontSize:"14px"}}>{data['name']}</label>
                  </Tooltip>
                </CircleMarker>
              )
            })}
            {lineData.data.map((data) =>{
              return(
                <Polyline
                  positions = {data['coordinates']}
                  pathOptions = {{
                    weight: data.voltage === 400? 5 : 2,
                    color : data.outofservice? line_colors[2]: data.voltage === 400? line_colors[0] : line_colors[1]
                  }}
                  >

                  <Popup>
                    <label style={{fontSize:"14px"}}>{data['name']}</label><br></br>
                    <Checkbox id={data.id} checked={data.outofservice} onChange={onlineChange} ></Checkbox>
                    <label>Out of Service</label>
                  </Popup>
                  <Tooltip>
                    <label style={{fontSize:"14px"}}>{data['name']}</label>
                  </Tooltip>
                </Polyline>

              )
            })}

            <Legend></Legend>
            {/*<Marker position={[35.4,19.8]} draggable={true} icon={DefaultIcon}></Marker>*/}
          </MapContainer>
          </div>
          <div style={{paddingTop:"10px"}}>
          {OutServNo === 0 && <div><label style={{fontSize: "16px", fontWeight:"800"}}> None </label> <label style={{fontSize: "16px"}}> of the transmission lines is out of service</label></div>}
          {OutServNo === 1 && <div><label style={{fontSize: "16px", fontWeight:"800"}}> {OutServNo} of {Object.keys(UpdatedLineData.data).length}</label> <label style={{fontSize: "16px"}}> transmission line is out of service</label></div>}
          {OutServNo > 1 && <div><label style={{fontSize: "16px", fontWeight:"800"}}> {OutServNo} of {Object.keys(UpdatedLineData.data).length}</label> <label style={{fontSize: "16px"}}> transmission lines are out of service</label></div>}
        </div>    
        </div>  
      </Grid.Column>
      <Grid.Column>
        <div style={{ width: '25vw', paddingLeft:"20px"}}>
          <DataTable header="Generation Fleet" value={generation_fleet} footerColumnGroup={footerGroup} responsiveLayout="scroll" style={{alignItems:"center", textAlign:"center"}}>
              <Column field="type" header="Type" headerStyle={{width:'10rem'}} style={{alignItems:"center"}}></Column>
              <Column field="fleet" header="Fleet (MW)" headerStyle={{width:'10rem'}} style={{alignItems:"center"}}></Column>
          </DataTable>
        </div>  
         
      </Grid.Column>
    </Grid>
    </div>
    
    <Toast ref={toast} position="top-right" />     
  </div>  
    




  );
}
export default Lmap