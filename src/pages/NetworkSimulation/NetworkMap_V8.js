
import {Marker, MapContainer, TileLayer, Tooltip, Polygon, Circle, Polyline, useMapEvents} from "react-leaflet";
import 'leaflet/dist/leaflet.css'
import "react-leaflet-fullscreen/dist/styles.css";
import React, { useEffect, useState, useRef } from "react";
import { Dialog } from 'primereact/dialog';
import 'antd/dist/antd.css';
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

const NetworkMap = (props) => {
  const {base_year, BusData, setBusData, BusDataCopy, setBusDataCopy, LineData, SetLineData, mapHeight, DateRange, substationData, setSubstationData, substationDataCopy, setSubstationDataCopy} = props;
  const [Dialogheader, setDialogHeader] = useState('')
  const [DialogContent, setDialogContent] = useState('')
  const [visibleLineInfo, setVisibleLineInfo] = useState(false)
  const [visibleRESInfo, setVisibleRESInfo] = useState(false)
  const [visibleThermalInfo, setVisibleThermalInfo] = useState(false)
  const [visibleLoadInfo, setVisibleLoadInfo] = useState(false)
  const [visibleBusInfo, setVisibleBusInfo] = useState(false)
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
  function MapEvent() {

    
    const mapEvents = useMapEvents({
      zoomend: () => {
        /*
        let zoom = mapEvents.getZoom()
        $('.ThermalGeneratorIcon').css(
          {'width': String(zoom*7) + "px",
          'height': String(zoom*7) + "px",
          'background-size': String(zoom*7) + "px" + " " + String(zoom*7) + "px"
        })
        $('.RESGeneratorIcon').css(
          {'width': String(zoom*7) + "px",
          'height': String(zoom*7) + "px",
          'background-size': String(zoom*7) + "px" + " " + String(zoom*7) + "px"
        })
        $('.ResidualLoadIcon').css(
          {'width': String(zoom*7) + "px",
          'height': String(zoom*7) + "px",
          'background-size': String(zoom*7) + "px" + " " + String(zoom*7) + "px"
        })
        */
      },
    });


    return null
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


  const handleLineFormFinish = (values) => {
    let line_data = {...LineData}
    if(typeof values.activated != 'undefined'){
      line_data.lines[line_index][base_year.code].outofservice = !values.activated
    }
    if(typeof values.capacity != 'undefined') {
      line_data.lines[line_index][base_year.code].capacity = values.capacity
    }
    setVisibleLineInfo(false)
    SetLineData(line_data)
  };

  const handleRESGeneratorFormFinish = (values) => {
    setVisibleRESInfo(false)
    setBusData(structuredClone(BusDataCopy))
    setSubstationData(structuredClone(substationDataCopy))
  };

  const handleThermalGeneratorFormFinish = (values) => {
    setVisibleThermalInfo(false)
    setBusData(structuredClone(BusDataCopy))
    setSubstationData(structuredClone(substationDataCopy))
  };

  const handleLoadFormFinish = (values) => {
    setVisibleLoadInfo(false)
    setBusData(structuredClone(BusDataCopy))
  };
  const handleBusFormFinish = (values) => {
    setVisibleBusInfo(false)
    setBusData(structuredClone(BusDataCopy))
    setSubstationData(structuredClone(substationDataCopy))
  };

  function HideDialogLineInfo(){
    setVisibleLineInfo(false)
  }
  function HideDialogRESInfo(){
    setBusDataCopy(structuredClone(BusData))
    setSubstationDataCopy(structuredClone(substationData))
    setVisibleRESInfo(false)
  }
  function HideDialogThermalInfo(){
    setBusDataCopy(structuredClone(BusData))
    setSubstationDataCopy(structuredClone(substationData))
    setVisibleThermalInfo(false)
  }
  function HideDialogLoadInfo(){
    setBusDataCopy(structuredClone(BusData))
    setSubstationDataCopy(structuredClone(substationData))
    setVisibleLoadInfo(false)
  }
  function HideDialogBusInfo(){

    setBusDataCopy(structuredClone(BusData))
    setSubstationDataCopy(structuredClone(substationData))
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
        <Button className="p-button-info" label="Save" icon="pi pi-check" onClick={() => busForm.submit()} />
    </div>
  );
  function LineContext(){

    
    if(base_year.code && DateRange.length !== 0){
      line_index = LineData.lines.map((element, index) => {
        if(element.id === this.options.data.id){
          return index
        }
      }).filter(element => element >=0)[0]
      setDialogHeader(LineData.lines[line_index].name + " Line")
      setDialogContent(
        <LineForm form={lineForm} onFinish={handleLineFormFinish} LineData={LineData} line_index = {line_index} base_year= {base_year}/>
      )
      setVisibleLineInfo(true)
    }
    else if (typeof base_year.code === 'undefined' && DateRange.length === 0){
      toast.current.show({ severity: 'warn', summary: 'No Year and Time Interval Selected', detail: 'Please select the base year and time interval to edit network data', life: 10000 });
    }
    else if (DateRange.length !== 0) {
      toast.current.show({ severity: 'warn', summary: 'No Year Selected', detail: 'Please select the base year to edit network data', life: 10000 });
    }
    else if (DateRange.length === 0) {
      toast.current.show({ severity: 'warn', summary: 'No Time Interval Selected', detail: 'Please select the time interval to edit network data', life: 10000 });
    }
  }

  function RESGeneratorContext(){
    if(base_year.code && DateRange.length !== 0){
      bus_index = BusData.buses.map((element, index) => {
        if(element.id === this.options.data.id){
          return index
        }
      }).filter(element => element >=0)[0]
      setDialogHeader(BusData.buses[bus_index].name + " - RES Generation Capacity")
      setDialogContent(
        <RESGeneratorForm form={resGeneratorForm} onFinish={handleRESGeneratorFormFinish} BusDataCopy={BusDataCopy} setBusDataCopy={setBusDataCopy} bus_index = {bus_index} base_year= {base_year} substationDataCopy={substationDataCopy}/>
      )
      setVisibleRESInfo(true)
    }
    else if (typeof base_year.code === 'undefined' && DateRange.length === 0){
      toast.current.show({ severity: 'warn', summary: 'No Year and Time Interval Selected', detail: 'Please select the base year and time interval to edit network data', life: 10000 });
    }
    else if (DateRange.length !== 0) {
      toast.current.show({ severity: 'warn', summary: 'No Year Selected', detail: 'Please select the base year to edit network data', life: 10000 });
    }
    else if (DateRange.length === 0) {
      toast.current.show({ severity: 'warn', summary: 'No Time Interval Selected', detail: 'Please select the time interval to edit network data', life: 10000 });
    }
  }

  function ThermalGeneratorContext(){
    if(base_year.code && DateRange.length !== 0){
      bus_index = BusData.buses.map((element, index) => {
        if(element.id === this.options.data.id){
          return index
        }
      }).filter(element => element >=0)[0]
      setDialogHeader(BusData.buses[bus_index].name + " - Thermal Generation Capacity")
      setDialogContent(
        <ThermalGeneratorForm form={thermalGeneratorForm} onFinish={handleThermalGeneratorFormFinish} BusDataCopy={BusDataCopy} setBusDataCopy={setBusDataCopy} bus_index = {bus_index} base_year= {base_year} substationDataCopy={substationDataCopy}/>
      )
      setVisibleThermalInfo(true)
    }
    else if (typeof base_year.code === 'undefined' && DateRange.length === 0){
      toast.current.show({ severity: 'warn', summary: 'No Year and Time Interval Selected', detail: 'Please select the base year and time interval to edit network data', life: 10000 });
    }
    else if (DateRange.length !== 0) {
      toast.current.show({ severity: 'warn', summary: 'No Year Selected', detail: 'Please select the base year to edit network data', life: 10000 });
    }
    else if (DateRange.length === 0) {
      toast.current.show({ severity: 'warn', summary: 'No Time Interval Selected', detail: 'Please select the time interval to edit network data', life: 10000 });
    }
  }

  function LoadContext(){
    if(base_year.code && DateRange.length !== 0){
      bus_index = BusData.buses.map((element, index) => {
        if(element.id === this.options.data.id){
          return index
        }
      }).filter(element => element >=0)[0]
      setDialogHeader(BusData.buses[bus_index].name + " - Load")
      setDialogContent(
        <LoadForm form={loadForm} onFinish={handleLoadFormFinish} BusDataCopy={BusDataCopy} bus_index = {bus_index} base_year= {base_year}/>
      )
      setVisibleLoadInfo(true)
    }
    else if (typeof base_year.code === 'undefined' && DateRange.length === 0){
      toast.current.show({ severity: 'warn', summary: 'No Year and Time Interval Selected', detail: 'Please select the base year and time interval to edit network data', life: 10000 });
    }
    else if (DateRange.length !== 0) {
      toast.current.show({ severity: 'warn', summary: 'No Year Selected', detail: 'Please select the base year to edit network data', life: 10000 });
    }
    else if (DateRange.length === 0) {
      toast.current.show({ severity: 'warn', summary: 'No Time Interval Selected', detail: 'Please select the time interval to edit network data', life: 10000 });
    }
  }
  function BusContext(){
    if(base_year.code && DateRange.length !== 0){
      bus_index = BusData.buses.map((element, index) => {
        if(element.id === this.options.data.id){
          return index
        }
      }).filter(element => element >=0)[0]
      setDialogHeader(BusData.buses[bus_index].name)
      setDialogContent(
        <BusForm form={busForm} onFinish={handleBusFormFinish} BusDataCopy={BusDataCopy} setBusDataCopy={setBusDataCopy} bus_index = {bus_index} base_year= {base_year} substationDataCopy={substationDataCopy}/>
      )
      setVisibleBusInfo(true)
    }
    else if (typeof base_year.code === 'undefined' && DateRange.length === 0){
      toast.current.show({ severity: 'warn', summary: 'No Year and Time Interval Selected', detail: 'Please select base year and time interval to edit network data', life: 10000 });
    }
    else if (DateRange.length !== 0) {
      toast.current.show({ severity: 'warn', summary: 'No Year Selected', detail: 'Please select base year to edit network data', life: 10000 });
    }
    else if (DateRange.length === 0) {
      toast.current.show({ severity: 'warn', summary: 'No Time Interval Selected', detail: 'Please select time interval to edit network data', life: 10000 });
    }
  }

  
  return (
    <div>
    <Toast ref={toast} position="top-right" /> 
    <div style={{paddingTop:"5px"}}>
        <div style={{ height: mapHeight, width: "100%"}}>
            <MapContainer
              center={[39.15, 33.25]} 
              zoom={7} 
              doubleClickZoom={false}
              style={{ height: '100%', width: "100%"}}
              dragging={true}
              zoomControl = {true}
              //maxZoom={7}
              //minZoom={7}
              attributionControl={false}
            >
            <MapEvent/>
            <TileLayer
              url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
              //url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"
              //url='https://api.tiles.mapbox.com/v4/mapbox.light/{z}/{x}/{y}.png'  // autherization required
              noWrap = {true}
            />

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
                      className="regionalMap"
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
                      className="regionalMap"
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
                      className="regionalMap"
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
        <Dialog className="NetworkDataDialog" header={Dialogheader} visible={visibleLineInfo} style={{width:"25%",height:"25%"}} modal onHide={HideDialogLineInfo} footer={footerLineInfo}>{DialogContent}</Dialog>
        <Dialog className="NetworkDataDialog" header={Dialogheader} visible={visibleRESInfo} style={{width:"40%",height:"40%"}} modal onHide={HideDialogRESInfo} footer={footerRESInfo}>{DialogContent}</Dialog>
        <Dialog className="NetworkDataDialog" header={Dialogheader} visible={visibleThermalInfo} style={{width:"40%",height:"40%"}} modal onHide={HideDialogThermalInfo} footer={footerThermalInfo}>{DialogContent}</Dialog>
        <Dialog className="NetworkDataDialog" header={Dialogheader} visible={visibleLoadInfo} style={{width:"40%",height:"25%"}} modal onHide={HideDialogLoadInfo} footer={footerLoadInfo}>{DialogContent}</Dialog>
        <Dialog className="NetworkDataDialog" header={Dialogheader} visible={visibleBusInfo} style={{width:"40%",height:"100%"}} modal onHide={HideDialogBusInfo} footer={footerBusInfo}>{DialogContent}</Dialog>
    </div>        
  </div>  
  );
}
export default NetworkMap