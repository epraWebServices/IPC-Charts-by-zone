
import {Marker, MapContainer, TileLayer, Tooltip, Polygon, Circle, CircleMarker, useMapEvents, Polyline, useMap} from "react-leaflet";
import {L, Icon, divIcon } from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import 'leaflet/dist/leaflet.css'
import "react-leaflet-fullscreen/dist/styles.css";
import React, { useEffect, useState, useRef } from "react";
import { Dialog } from 'primereact/dialog';
import 'antd/dist/antd.css';
import {GiWindTurbine, GiCoalWagon, GiCoalPile, GiPowerGenerator, GiNuclearPlant, GiMeshNetwork} from 'react-icons/gi';
import { DivIcon } from "leaflet";
import './iconStyle.css'
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Form, Switch, InputNumber } from 'antd';
import { LineForm } from "./LineForm";
import { RESGeneratorForm } from "./RESGeneratorForm_V1";
import { ThermalGeneratorForm } from "./ThermalGeneratorForm_V1";
import { LoadForm } from "./LoadForm_V1";
import { BusForm } from "./BusForm_V1";
const Lmap = (props) => {
  const { regions, base_year, bus_data, line_data, mapHeight} = props;
  const [BusData, SetBusData] = useState(bus_data)
  const [LineData, SetLineData] = useState(line_data)
  const [Updatedregions, Setregions] = useState(regions)
  const [year, Setyear] = useState(base_year)
  const [Dialogheader, setDialogHeader] = useState('')
  const [DialogContent, setDialogContent] = useState('')
  const [visibleLineInfo, setVisibleLineInfo] = useState(false)
  const [visibleRESInfo, setVisibleRESInfo] = useState(false)
  const [visibleThermalInfo, setVisibleThermalInfo] = useState(false)
  const [visibleLoadInfo, setVisibleLoadInfo] = useState(false)
  const [visibleBusInfo, setVisibleBusInfo] = useState(false)
  const [X, setX] = useState(0)
  const toast = useRef(null)
  let [lineForm] = Form.useForm();
  let [resGeneratorForm] = Form.useForm();
  let [thermalGeneratorForm] = Form.useForm();
  let [loadForm] = Form.useForm();
  let [busForm] = Form.useForm();
  let line_index = null
  let bus_index = null
  const zones = {
    1: {
      'name': 'Trakya Yük Tevzi İşletme Müdürlüğü - İstanbul',
      'color': '#7986CB'
    },
    2: {
      'name': 'Batı Anadolu Yük Tevzi İşletme Müdürlüğü - İzmir',
      'color': '#1a237e'
    },
    3: {
      'name': 'Kuzeybatı Anadolu Yük Tevzi İşletme Müdürlüğü - Sakarya',
      'color': '#06a9f4'
    },
    4: {
      'name': 'Orta Karadeniz Yük Tevzi İşletme Müdürlüğü - Samsun',
      'color': '#4cb6ac'
    },
    5: {
      'name': 'Doğu Anadolu Yük Tevzi İşletme Müdürlüğü - Erzurum',
      'color': '#33691d'
    },
    6: {
      'name': 'Orta Anadolu Yük Tevzi İşletme Müdürlüğü - Ankara',
      'color': '#26c6da'
    },
    7: {
      'name': 'Batı Akdeniz Yük Tevzi İşletme Müdürlüğü - Antalya',
      'color': '#00579b'
    },
    8: {
      'name': 'Doğu Akdeniz Yük Tevzi İşletme Müdürlüğü - Adana',
      'color': '#009588'
    },
    9: {
      'name': 'Güneydoğu Anadolu Yük Tevzi İşletme Müdürlüğü - Elazığ',
      'color': '#006064'
      
    }
  }

  var ThermalGeneratorIcon = new DivIcon({
    className: 'ThermalGeneratorIcon',
    iconSize: [49,49] 
  })
  var RESGeneratorIcon = new DivIcon({
    className: 'RESGeneratorIcon',
    iconSize: [49,49] 
  })
  var ResidualLoadIcon = new DivIcon({
    className: 'ResidualLoadIcon',
    iconSize: [49,49] 
  })
  var ThermalGeneratorOutIcon = new DivIcon({
    className: 'ThermalGeneratorOutIcon',
    iconSize: [49,49] 
  })
  var RESGeneratorOutIcon = new DivIcon({
    className: 'RESGeneratorOutIcon',
    iconSize: [49,49] 
  })
  var ResidualLoadOutIcon = new DivIcon({
    className: 'ResidualLoadOutIcon',
    iconSize: [49,49] 
  })

  const handleLineFormFinish = (values) => {
    if(typeof values.activated != 'undefined'){
      line_data.lines[line_index][base_year.code].outofservice = !values.activated
    }
    if(typeof values.capacity != 'undefined') {
      line_data.lines[line_index][base_year.code].capacity = values.capacity
    }
    setVisibleLineInfo(false)
    setX(Math.random())
  };

  const handleRESGeneratorFormFinish = (values) => {
    if(typeof values.windCapacity != 'undefined'){
      bus_data.buses[bus_index][base_year.code].wind.capacity = values.windCapacity
    }
    if(typeof values.solarCapacity != 'undefined') {
      bus_data.buses[bus_index][base_year.code].solar.capacity = values.solarCapacity
    }
    if(typeof values.hydroCapacity != 'undefined') {
      bus_data.buses[bus_index][base_year.code].hydro_dam.capacity = values.hydroCapacity
    }
    if(typeof values.rorCapacity != 'undefined') {
      bus_data.buses[bus_index][base_year.code].hydro_ror.capacity = values.rorCapacity
    }
    if(typeof values.act_wind != 'undefined'){
      bus_data.buses[bus_index][base_year.code].wind.active = values.act_wind
    }
    if(typeof values.act_solar != 'undefined') {
      bus_data.buses[bus_index][base_year.code].solar.active = values.act_solar
    }
    if(typeof values.act_hydro != 'undefined') {
      bus_data.buses[bus_index][base_year.code].hydro_dam.active = values.act_hydro
    }
    if(typeof values.act_ror != 'undefined') {
      bus_data.buses[bus_index][base_year.code].hydro_ror.active = values.act_ror
    }
    setVisibleRESInfo(false)
    setX(Math.random())
  };

  const handleThermalGeneratorFormFinish = (values) => {
    if(typeof values.gasCapacity != 'undefined'){
      bus_data.buses[bus_index][base_year.code].natural_gas.capacity = values.gasCapacity
    }
    if(typeof values.ligniteCapacity != 'undefined') {
      bus_data.buses[bus_index][base_year.code].lignite.capacity = values.ligniteCapacity
    }
    if(typeof values.importCoalCapacity != 'undefined') {
      bus_data.buses[bus_index][base_year.code].import_coal.capacity = values.importCoalCapacity
    }
    if(typeof values.localCoalCapacity != 'undefined') {
      bus_data.buses[bus_index][base_year.code].hard_coal.capacity = values.localCoalCapacity
    }
    if(typeof values.act_gas != 'undefined'){
      bus_data.buses[bus_index][base_year.code].natural_gas.active = values.act_gas
    }
    if(typeof values.act_lignite != 'undefined') {
      bus_data.buses[bus_index][base_year.code].lignite.active = values.act_lignite
    }
    if(typeof values.act_importCoal != 'undefined') {
      bus_data.buses[bus_index][base_year.code].import_coal.active = values.act_importCoal
    }
    if(typeof values.act_localCoal != 'undefined') {
      bus_data.buses[bus_index][base_year.code].hard_coal.active = values.act_localCoal
    }
    setVisibleThermalInfo(false)
    setX(Math.random())
  };

  const handleLoadFormFinish = (values) => {
    if(typeof values.consumption != 'undefined'){
      bus_data.buses[bus_index][base_year.code].load.capacity = values.consumption
    }
    if(typeof values.act_consumption != 'undefined'){
      bus_data.buses[bus_index][base_year.code].load.active = values.act_consumption
    }
    setVisibleLoadInfo(false)
    setX(Math.random())
  };
  const handleBusFormFinish = (values) => {
    if(typeof values.gasCapacity != 'undefined'){
      bus_data.buses[bus_index][base_year.code].natural_gas.capacity = values.gasCapacity
    }
    if(typeof values.ligniteCapacity != 'undefined') {
      bus_data.buses[bus_index][base_year.code].lignite.capacity = values.ligniteCapacity
    }
    if(typeof values.importCoalCapacity != 'undefined') {
      bus_data.buses[bus_index][base_year.code].import_coal.capacity = values.importCoalCapacity
    }
    if(typeof values.localCoalCapacity != 'undefined') {
      bus_data.buses[bus_index][base_year.code].hard_coal.capacity = values.localCoalCapacity
    }
    if(typeof values.windCapacity != 'undefined'){
      bus_data.buses[bus_index][base_year.code].wind.capacity = values.windCapacity
    }
    if(typeof values.solarCapacity != 'undefined') {
      bus_data.buses[bus_index][base_year.code].solar.capacity = values.solarCapacity
    }
    if(typeof values.hydroCapacity != 'undefined') {
      bus_data.buses[bus_index][base_year.code].hydro_dam.capacity = values.hydroCapacity
    }
    if(typeof values.rorCapacity != 'undefined') {
      bus_data.buses[bus_index][base_year.code].hydro_ror.capacity = values.rorCapacity
    }
    if(typeof values.consumption != 'undefined'){
      bus_data.buses[bus_index][base_year.code].load.capacity = values.consumption
    }
    if(typeof values.nuclearCapacity != 'undefined'){
      bus_data.buses[bus_index][base_year.code].nuclear.capacity = values.nuclearCapacity
    }
    if(typeof values.geothermalCapacity != 'undefined'){
      bus_data.buses[bus_index][base_year.code].geothermal.capacity = values.geothermalCapacity
    }
    if(typeof values.biomassCapacity != 'undefined'){
      bus_data.buses[bus_index][base_year.code].biomass.capacity = values.biomassCapacity
    }
    if(typeof values.entsoeCapacity != 'undefined'){
      bus_data.buses[bus_index][base_year.code].entsoe.capacity = values.entsoeCapacity
    }
    if(typeof values.georgiaCapacity != 'undefined'){
      bus_data.buses[bus_index][base_year.code].georgia.capacity = values.georgiaCapacity
    }
    if(typeof values.otherCapacity != 'undefined'){
      bus_data.buses[bus_index][base_year.code].other.capacity = values.otherCapacity
    }

    if(typeof values.act_gas != 'undefined'){
      bus_data.buses[bus_index][base_year.code].natural_gas.active = values.act_gas
    }
    if(typeof values.act_lignite != 'undefined') {
      bus_data.buses[bus_index][base_year.code].lignite.active = values.act_lignite
    }
    if(typeof values.act_importCoal != 'undefined') {
      bus_data.buses[bus_index][base_year.code].import_coal.active = values.act_importCoal
    }
    if(typeof values.act_localCoal != 'undefined') {
      bus_data.buses[bus_index][base_year.code].hard_coal.active = values.act_localCoal
    }
    if(typeof values.act_wind != 'undefined'){
      bus_data.buses[bus_index][base_year.code].wind.active = values.act_wind
    }
    if(typeof values.act_solar != 'undefined') {
      bus_data.buses[bus_index][base_year.code].solar.active = values.act_solar
    }
    if(typeof values.act_hydro != 'undefined') {
      bus_data.buses[bus_index][base_year.code].hydro_dam.active = values.act_hydro
    }
    if(typeof values.act_ror != 'undefined') {
      bus_data.buses[bus_index][base_year.code].hydro_ror.active = values.act_ror
    }
    if(typeof values.act_consumption != 'undefined'){
      bus_data.buses[bus_index][base_year.code].load.active = values.act_consumption
    }
    if(typeof values.act_nuclear != 'undefined'){
      bus_data.buses[bus_index][base_year.code].nuclear.active = values.act_nuclear
    }
    if(typeof values.act_geothermal != 'undefined'){
      bus_data.buses[bus_index][base_year.code].geothermal.active = values.act_geothermal
    }
    if(typeof values.act_biomass != 'undefined'){
      bus_data.buses[bus_index][base_year.code].biomass.active = values.act_biomass
    }
    if(typeof values.act_entsoe != 'undefined'){
      bus_data.buses[bus_index][base_year.code].entsoe.active = values.act_entsoe
    }
    if(typeof values.act_georgia != 'undefined'){
      bus_data.buses[bus_index][base_year.code].georgia.active = values.act_georgia
    }
    if(typeof values.act_other != 'undefined'){
      bus_data.buses[bus_index][base_year.code].other.active = values.act_other
    }    
    setVisibleBusInfo(false)
    setX(Math.random())
  };

  function HideDialogLineInfo(){
    setVisibleLineInfo(false)
  }
  function HideDialogRESInfo(){
    setVisibleRESInfo(false)
  }
  function HideDialogThermalInfo(){
    setVisibleThermalInfo(false)
  }
  function HideDialogLoadInfo(){
    setVisibleLoadInfo(false)
  }
  function HideDialogBusInfo(){
    setVisibleBusInfo(false)
  }
  const footerLineInfo = (
    <div>
        <Button className="p-button-warning" label="Cancel" icon="pi pi-times" onClick={HideDialogLineInfo} />
        <Button className="p-button-info" label="Save" icon="pi pi-check" onClick={() => lineForm.submit()} />
    </div>
  );
  const footerRESInfo = (
    <div>
        <Button className="p-button-warning" label="Cancel" icon="pi pi-times" onClick={HideDialogRESInfo} />
        <Button className="p-button-info" label="Save" icon="pi pi-check" onClick={() => resGeneratorForm.submit()} />
    </div>
  );
  const footerThermalInfo = (
    <div>
        <Button className="p-button-warning" label="Cancel" icon="pi pi-times" onClick={HideDialogThermalInfo} />
        <Button className="p-button-info" label="Save" icon="pi pi-check" onClick={() => thermalGeneratorForm.submit()} />
    </div>
  );
  const footerLoadInfo = (
    <div>
        <Button className="p-button-warning" label="Cancel" icon="pi pi-times" onClick={HideDialogLoadInfo} />
        <Button className="p-button-info" label="Save" icon="pi pi-check" onClick={() => loadForm.submit()} />
    </div>
  );
  const footerBusInfo = (
    <div>
        <Button className="p-button-warning" label="Cancel" icon="pi pi-times" onClick={HideDialogBusInfo} />
        <Button className="p-button-info" label="Save" icon="pi pi-check" onClick={() => loadForm.submit()} />
    </div>
  );
  function LineContext(){
    if(base_year.code){
      line_index = line_data.lines.map((element, index) => {
        if(element.id === this.options.data.id){
          return index
        }
      }).filter(element => element >=0)[0]
      setDialogHeader(line_data.lines[line_index].name + " Line")
      setDialogContent(
        <LineForm form={lineForm} onFinish={handleLineFormFinish} line_data={line_data} line_index = {line_index} base_year= {base_year}/>
      )
      setX(Math.random())
      setVisibleLineInfo(true)
    }
    else{
      toast.current.show({ severity: 'warn', summary: 'No Year Selected', detail: 'Please select the base year', life: 5000 });
    }
  }

  function RESGeneratorContext(){
    if(base_year.code){
      bus_index = bus_data.buses.map((element, index) => {
        if(element.id === this.options.data.id){
          return index
        }
      }).filter(element => element >=0)[0]
      setDialogHeader(bus_data.buses[bus_index].name + " - RES Generation")
      setDialogContent(
        <RESGeneratorForm form={resGeneratorForm} onFinish={handleRESGeneratorFormFinish} bus_data={bus_data} bus_index = {bus_index} base_year= {base_year}/>
      )
      setX(Math.random())
      setVisibleRESInfo(true)
    }
    else{
      toast.current.show({ severity: 'warn', summary: 'No Year Selected', detail: 'Please select the base year', life: 5000 });
    }
  }

  function ThermalGeneratorContext(){
    if(base_year.code){
      bus_index = bus_data.buses.map((element, index) => {
        if(element.id === this.options.data.id){
          return index
        }
      }).filter(element => element >=0)[0]
      setDialogHeader(bus_data.buses[bus_index].name + " - Thermal Generation")
      setDialogContent(
        <ThermalGeneratorForm form={thermalGeneratorForm} onFinish={handleThermalGeneratorFormFinish} bus_data={bus_data} bus_index = {bus_index} base_year= {base_year}/>
      )
      setX(Math.random())
      setVisibleThermalInfo(true)
    }
    else{
      toast.current.show({ severity: 'warn', summary: 'No Year Selected', detail: 'Please select the base year', life: 5000 });
    }
  }

  function LoadContext(){
    if(base_year.code){
      bus_index = bus_data.buses.map((element, index) => {
        if(element.id === this.options.data.id){
          return index
        }
      }).filter(element => element >=0)[0]
      setDialogHeader(bus_data.buses[bus_index].name + " - Load")
      setDialogContent(
        <LoadForm form={loadForm} onFinish={handleLoadFormFinish} bus_data={bus_data} bus_index = {bus_index} base_year= {base_year}/>
      )
      setX(Math.random())
      setVisibleLoadInfo(true)
    }
    else{
      toast.current.show({ severity: 'warn', summary: 'No Year Selected', detail: 'Please select the base year', life: 5000 });
    }
  }
  function BusContext(){
    if(base_year.code){
      bus_index = bus_data.buses.map((element, index) => {
        if(element.id === this.options.data.id){
          return index
        }
      }).filter(element => element >=0)[0]
      setDialogHeader(bus_data.buses[bus_index].name)
      setDialogContent(
        <BusForm form={loadForm} onFinish={handleBusFormFinish} bus_data={bus_data} bus_index = {bus_index} base_year= {base_year}/>
      )
      setX(Math.random())
      setVisibleBusInfo(true)
    }
    else{
      toast.current.show({ severity: 'warn', summary: 'Year is not selected', detail: 'Please select the base year to edit network data', life: 5000 });
    }


  }
  useEffect(() => {
    SetLineData(line_data)
  },[X])
  
  return (
    <div>
    <Toast ref={toast} position="top-right" /> 
    <div style={{paddingTop:"5px"}}>
        <div style={{ height: mapHeight, width: "100%"}}>
            <MapContainer
              center={[39.15, 34.25]} 
              zoom={7} 
              doubleClickZoom={false}
              style={{ height: '100%', width: "100%"}}
              dragging={true}
              zoomControl = {true}
              //maxZoom={7}
              //minZoom={7}
            >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              //url='https://api.tiles.mapbox.com/v4/mapbox.light/{z}/{x}/{y}.png'
              attribution= '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              noWrap = {true}
            />
            {Updatedregions.features.map((data) =>{
              return(
                <Polygon 
                  className="regionalMap"
                  positions={data.geometry.coordinates} 
                  pathOptions={{color:'', weight: 1 ,fillColor: zones[data.properties.region].color, fillOpacity:0.3}}
                  region = {data.properties.region}
                >
                </Polygon>     
              )
            })}
            {BusData.buses.map((data) => {
              return(
                <div>
                  <Circle center={data.center} radius={20000} 
                    className="Clickable"
                    data= {data}
                    pathOptions={{
                    color: "rgb(150, 0, 0)",
                    weight: 3,
                    fillColor: "red",
                    fillOpacity: 1,
                    }}
                    eventHandlers={{
                      click: BusContext
                    }}
                    zIndex={9999}
                    pane={"markerPane"}
                  >
                    <Tooltip>{data.name}</Tooltip>
                  </Circle>

                  {data.ThermalGenerator && 
                  <div>
                    <Marker
                      className="Clickable"
                      icon={ThermalGeneratorIcon}
                      position={data.ThermalGenerator.coordinate}
                      data = {data}
                      eventHandlers={{
                        click: ThermalGeneratorContext,
                      }}
                    >
                      <Tooltip>Thermal Generator</Tooltip>
                    </Marker>
                    <Polyline
                      className="Clickable"
                      positions = {[data.ThermalGenerator.coordinate, data.center]}
                      pathOptions = {{
                        weight: 3,
                        color : "black",
                        opacity: 1
                      }}
                    >
                    </Polyline>
                  </div>}
                  
                  {data.RESGenerator && 
                  <div>
                    <Marker
                      className="Clickable"
                      icon={RESGeneratorIcon}
                      position={data.RESGenerator.coordinate}
                      data = {data}
                      eventHandlers={{
                        click: RESGeneratorContext,
                      }}
                    >
                      <Tooltip>RES Generator</Tooltip>
                    </Marker>
                    <Polyline
                      className="Clickable"
                      positions = {[data.RESGenerator.coordinate, data.center]}
                      pathOptions = {{
                        weight: 3,
                        color : "black",
                        opacity: 1
                      }}
                    >
                    </Polyline>
                  </div>}
                  {data.Load && 
                  <div>
                    <Marker
                      className="Clickable"
                      icon={ResidualLoadIcon}
                      position={data.Load.coordinate}
                      data = {data}
                      eventHandlers={{
                        click: LoadContext,
                      }}
                    >
                      <Tooltip>Load</Tooltip>
                    </Marker>
                    <Polyline
                      className="Clickable"
                      positions = {[data.Load.coordinate, data.center]}
                      pathOptions = {{
                        weight: 3,
                        color : "black",
                        opacity: 1
                      }}
                    >
                    </Polyline>
                  </div>}
                </div> 
              )
            })}
            
            
            {LineData.lines.map((data) => {
              return(
                <Polyline
                  className="Clickable"
                  positions = {data.coordinates}
                  data = {data}
                  pathOptions = {{
                    weight: 4,
                    color : base_year.code? data[base_year.code].outofservice? "gray": "black" : "black"
                  }}
                  eventHandlers={{
                    click: LineContext,
                  }}
                ></Polyline>
              )
              
            })}
          </MapContainer>
        </div>  
        <Dialog header={Dialogheader} visible={visibleLineInfo} style={{width:"25%",height:"25%"}} modal onHide={HideDialogLineInfo} footer={footerLineInfo}>{DialogContent}</Dialog>
        <Dialog header={Dialogheader} visible={visibleRESInfo} style={{width:"40%",height:"40%"}} modal onHide={HideDialogRESInfo} footer={footerRESInfo}>{DialogContent}</Dialog>
        <Dialog header={Dialogheader} visible={visibleThermalInfo} style={{width:"40%",height:"40%"}} modal onHide={HideDialogThermalInfo} footer={footerThermalInfo}>{DialogContent}</Dialog>
        <Dialog header={Dialogheader} visible={visibleLoadInfo} style={{width:"40%",height:"25%"}} modal onHide={HideDialogLoadInfo} footer={footerLoadInfo}>{DialogContent}</Dialog>
        <Dialog header={Dialogheader} visible={visibleBusInfo} style={{width:"40%",height:"100%"}} modal onHide={HideDialogBusInfo} footer={footerBusInfo}>{DialogContent}</Dialog>
    </div>        
  </div>  
  );
}
export default Lmap