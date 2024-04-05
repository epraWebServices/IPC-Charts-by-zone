import { Col, Row, Switch } from "antd";
import { Dropdown } from "primereact/dropdown";
import { Panel } from "primereact/panel";
import React, { useEffect, useState, useRef } from "react";
import { InputNumber } from "antd";
import { Button } from "primereact/button";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Divider } from "primereact/divider";
import { CircleMarker, MapContainer, Popup, TileLayer, Tooltip } from "react-leaflet";
import { Toast } from "primereact/toast";
import { Button as ButtonMui} from '@mui/material'
import { Dialog } from "primereact/dialog";
import styled from 'styled-components';
import { Accordion, AccordionTab } from 'primereact/accordion';
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import "./ZoneMapStyle.css"
export const Legend = styled.div`
      border-top-left-radius: 10px;
      border-top-left-radius: 10px;
      position: absolute;
      width: 180px;
      height: 120px;
      background-color: rgba(214, 203, 208, 0.8);
      bottom: 0;
      right: 0;
      z-index: 1000;
      display: grid;
      grid-template-columns: 1fr;
      padding: 1%;
    `;
const ZoneMap =(props) => {
    const {base_year, bus_index, genType, substationDataCopy, BusDataCopy, setBusDataCopy, select, setSelect} = props
    let bus_data = {...BusDataCopy}
    const [mapwidth, setMapWidth] = useState("0px")
    const [visible, setVisible] = useState(false)
    const [addedCapacity, setAddedCapacity] = useState()
    const toastBR = useRef()
    const [recalculate, setRecalculate] = useState(false)
    const [map, setMap] = useState(null);
    const zoneCenters ={
        0: [41.2, 27.6],
        1: [38.5, 27],
        2: [40.5, 29],
        3: [40.8, 36],
        4: [40, 41],
        5: [38.5, 33.5],
        6: [37.5, 31],
        7: [37, 35],
        8: [37.8, 39]
    }
    const zoneZooms ={
        0: 8,
        1: 7,
        2: 7,
        3: 7,
        4: 7,
        5: 7,
        6: 7,
        7: 8,
        8: 7
    }
    const unitTypes = {
        naturalGas: "Natural Gas",
        lignite: "Lignite",
        localCoal: "Local Coal",
        importCoal: "Import Coal",
        wind: "Wind",
        solar: "Solar",
        hydro: "Hydro",
        ror: "RoR",
        geothermal: "Geothermal",
        biomass: "Biomass",
        nuclear: "Nuclear",
        other: "Other"
    }
    const unitTypes2 = {
        naturalGas: "natural_gas",
        lignite: "lignite",
        localCoal: "hard_coal",
        importCoal: "import_coal",
        wind: "wind",
        solar: "solar",
        hydro: "hydro_dam",
        ror: "hydro_ror",
        geothermal: "geothermal",
        biomass: "biomass",
        nuclear: "nuclear",
        other: "other"
    }
    const [totalCapacity, setTotalCapacity] = useState(BusDataCopy.buses[bus_index][base_year.code][unitTypes2[genType]].capacity)
    useEffect(()=>{
        
        setTotalCapacity(BusDataCopy.buses[bus_index][base_year.code][unitTypes2[genType]].capacity)
    },[recalculate])
    document.onkeydown = function(evt) {
        evt = evt || window.event;
        var isEscape = false;
        if(select){
            if ("key" in evt) {
                isEscape = (evt.key === "Escape" || evt.key === "Esc");
            } else {
                isEscape = (evt.keyCode === 27);
            }
            if (isEscape) {
                setAddedCapacity()
                setSelect(false)
                toast.dismiss()
            }
        } 
    };
    function pressEnter () {
        if(!isNaN(addedCapacity) || addedCapacity > 0){
            toastId.current =  notify("Select the location on the map.")
            setSelect(true)
            setVisible(false)
        }
    }
            
        

    const notify = (message) =>{
        return(
            toast(message, {
                closeButton: false,
                position: "top-center",
                autoClose: false,
                hideProgressBar: true,
                newestOnTop: false,
                closeOnClick: false,
                rtl: false,
                pauseOnFocusLoss: true,
                draggable: false,
                pauseOnHover: true,
                type: "success"
              })
        )
        
    }

    


    const toastId = useRef(null);

    const ClickBus = (e) => {
        
        let data = e.target.options.data.data
        if(data.generation[genType]){
            data.generation[genType].capacity += addedCapacity
        }
        else{
            data.generation[genType] = {capacity: addedCapacity, checked: true}
        }
        
        
        bus_data.buses[bus_index][base_year.code][unitTypes2[genType]].capacity += addedCapacity
        toastBR.current.show({ severity: 'success', summary: 'Unit added', detail: "A " + addedCapacity + " Unit is connected to " + data.name + " substation.", life: 7500 })
        setAddedCapacity()
        setSelect(false)
        toast.dismiss()
        setRecalculate(prev => !prev)
        setBusDataCopy(bus_data)
    }
    useEffect(()=>{
        if (document.getElementById("ZoneMap")){
            
            setMapWidth(document.getElementById("ZoneMap").offsetWidth/2 - 50 + "px")
        }
    },[document.getElementById("ZoneMap")])
    const footerContent = (
        <div>
            <Button id="AddUnit" label="Ok" icon="pi pi-check" disabled={isNaN(addedCapacity) || addedCapacity <= 0} onClick={() => {toastId.current =  notify("Select the location on the map."); setSelect(true); setVisible(false)}} autoFocus style={{height:"35px"}}/>
        </div>
    );

    const changeStatus = (e,data) => {
        
        data.generation[genType].checked = e
        if(e){
            bus_data.buses[bus_index][base_year.code][unitTypes2[genType]].capacity += data.generation[genType].capacity
            toastBR.current.show({ severity: 'success', summary: 'Unit Activated', detail: "Unit at " + data.name + " substation is activated.", life: 7500 })
        }else{
            bus_data.buses[bus_index][base_year.code][unitTypes2[genType]].capacity -= data.generation[genType].capacity
            toastBR.current.show({ severity: 'warn', summary: 'Unit Deactivated', detail: "Unit at " + data.name + " substation is deactivated.", life: 7500 })
        }
        setBusDataCopy(bus_data)
        setRecalculate(prev => !prev)
    } 
    const changeCapacity = (e,data) => {
        bus_data.buses[bus_index][base_year.code][unitTypes2[genType]].capacity += e - data.generation[genType].capacity
        data.generation[genType].capacity = e

        setBusDataCopy(bus_data)
        setRecalculate(prev => !prev)
    } 
    return(
        <div>
            <ToastContainer />
            <Toast ref={toastBR}></Toast>
            <Row>
                <Col span={10} offset={5}>
                    <h4 style={{textAlign:"center"}}>
                        Capacity: {totalCapacity.toFixed(2)} MW
                    </h4>
                </Col>
                <Col span={4} offset={0}>
                    <div style={{textAlign:"center"}}>
                        <ButtonMui color='inherit' variant="contained" disabled={select} style={{backgroundColor:"#E0C0EE", color:"black"}} onClick={(e)=>setVisible(true)}> 
                            Add Unit
                        </ButtonMui>
                    </div>
                </Col>
            </Row>

            <div id="ZoneMap">
                <MapContainer
                whenCreated={setMap}
                center={zoneCenters[bus_index]} 
                zoom={zoneZooms[bus_index]} 
                doubleClickZoom={false}
                style={{ height: '60vh', width: "100%"}}
                dragging={true}
                zoomControl = {true}
                attributionControl={false}>
                
                    <TileLayer 
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    
                    noWrap = {true}/>
                    {substationDataCopy.data.map((data)=>{
                        if(data.zoneId == bus_index + 1){
                            let gen = Object.keys(data.generation).includes(genType) && data.generation[genType].checked
                            let psudoGen = Object.keys(data.generation).includes(genType)
                            if(select){
                                
                                return(
                                    <CircleMarker center={data.coordinates} radius={gen? 6: 5} pathOptions={{fillColor: data.baseKV===400?"red":"blue", color:gen? "#FFCC00" : data.baseKV===400?"red":"blue", fillOpacity:1, weight: gen? 3 : 1, data:{data}}} eventHandlers={{click:ClickBus}}>
                                        <Tooltip> 
                                            <div>{data.name}</div> 
                                            {gen && <i>{unitTypes[genType]}: {data.generation[genType].capacity} MW</i>}
                                        </Tooltip>
                                    </CircleMarker>
                                )
                            }
                            else{
                                return(
                                    <CircleMarker center={data.coordinates} radius={gen? 6: 5} pathOptions={{fillColor: data.baseKV===400?"red":"blue", color:gen? "#FFCC00" : data.baseKV===400?"red":"blue", fillOpacity:1, weight: gen? 3 : 1, data:{data}}}>
                                        <Tooltip> 
                                            <div>{data.name}</div> 
                                            {gen && <i>{unitTypes[genType]}: {data.generation[genType].capacity} MW</i>}
                                        </Tooltip>
                                        {psudoGen && <Popup>
                                            <div style={{width:"300px"}}>
                                                <div style={{fontSize:"16px", paddingBottom:"10px"}}>{data.name}</div> 
                                                <Row>
                                                    <Col span={4} >
                                                        <Switch size="medium" defaultChecked={data.generation[genType].checked} onChange={(e)=>{changeStatus(e,data)}}></Switch>
                                                    </Col>
                                                    <Col span={8}>
                                                        <div style={{fontSize:"15px"}}>{unitTypes[genType]}:</div>
                                                    </Col>
                                                    <Col span={12}>
                                                        <InputNumber size="small" disabled={!data.generation[genType].checked} defaultValue={data.generation[genType].capacity} addonAfter="MW" min={0} onChange={(e) => changeCapacity(e,data)}></InputNumber>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </Popup>}
                                    </CircleMarker>
                                )
                            }
                            
                        }    
                    })}
                    {/*<Legend>
                        <Row>
                            <Col span={4}>
                                <div style={{width:"20px", height:"20px", background:"red", borderRadius:"50%"}}></div>
                            </Col>
                            <Col span={20}>
                                <div style={{fontSize:"14px"}}>400 kV Substations</div>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={4}>
                                <div style={{width:"20px", height:"20px", background:"blue", borderRadius:"50%"}}></div>
                            </Col>
                            <Col span={20}>
                                <div style={{fontSize:"14px"}}>154 kV Substations</div>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={4}>
                                <div style={{width:"20px", height:"20px", background:"red", borderRadius:"50%", border:"2px solid #FFCC00", marginBottom:"2px"}}></div>
                                <div style={{width:"20px", height:"20px", background:"blue", borderRadius:"50%", border:"2px solid #FFCC00"}}></div>
                            </Col>
                            <Col span={20} style={{}}>
                                <div style={{fontSize:"14px"}}>Substations with Generation Units</div>
                            </Col>
                        </Row>
                        
                   
                </Legend>*/}
                <Col span={16} offset={18} style={{marginRight:"10px", marginTop:"10px"}}>
                    <div id="legend">
                    <Accordion activeIndex={1}>
                        <AccordionTab header="Legend">
                            <Table>
                                <TableBody>
                                <TableRow >
                                    <TableCell id="legend"><div style={{width:"20px", height:"20px", background:"red", borderRadius:"50%"}}></div></TableCell>
                                    <TableCell id="legend">400 kV Substations</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell id="legend"><div style={{width:"20px", height:"20px", background:"blue", borderRadius:"50%"}}></div></TableCell>
                                    <TableCell id="legend">154 kV Substations</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell id="legend" span={2}>
                                    <div style={{width:"22px", height:"22px", background:"red", borderRadius:"50%", border:"3px solid #FFCC00"}}></div>
                                    <div style={{width:"22px", height:"22px", background:"blue", borderRadius:"50%", border:"3px solid #FFCC00"}}></div></TableCell>
                                    <TableCell id="legend">Substations with Generation Units</TableCell>
                                </TableRow>
                                </TableBody>
                            </Table>
                        </AccordionTab>
                    </Accordion>
                    </div>
                </Col>
                </MapContainer>
            </div>
            {/*
                <Row>
                    <Col span={1}><div style={{width:"20px", height:"20px", background:"red", borderRadius:"50%"}}></div></Col>
                    <Col span={7}><div style={{fontSize:"14px"}}>400 kV Substations</div></Col>
                    <Col span={1}><div style={{width:"20px", height:"20px", background:"blue", borderRadius:"50%"}}></div></Col>
                    <Col span={7}><div style={{fontSize:"14px"}}>154 kV Substations</div></Col>
                    <Col span={1}><div style={{width:"22px", height:"22px", background:"red", borderRadius:"50%", border:"3px solid #FFCC00"}}></div></Col>
                    <Col span={1}><div style={{width:"22px", height:"22px", background:"blue", borderRadius:"50%", border:"3px solid #FFCC00"}}></div></Col>
                    <Col span={6}><div style={{fontSize:"14px"}}>Substations with Generation Units</div></Col>
                </Row>
            */}
            
            <Dialog visible={visible} onHide={(e)=>{setVisible(false); setAddedCapacity()}} footer={footerContent} style={{width: "20%"}} header={unitTypes[genType] + " Unit"}>
                <div style={{textAlign:"center"}}>
                    <label style={{fontSize:"18px"}}>Capacity: </label><InputNumber autoFocus={true} value={addedCapacity} min={0} addonAfter="MW" style={{width:"150px"}} onChange={(e)=>setAddedCapacity(e)} onPressEnter={(e)=>pressEnter(e)}></InputNumber>
                </div>
               
            </Dialog>
        </div>
    )

}
export default ZoneMap