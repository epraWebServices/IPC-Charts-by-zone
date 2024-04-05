import React, {useEffect, useState} from "react";
import { Form, Switch, InputNumber, Divider, Row, Col, Button } from "antd";
import { Dialog } from 'primereact/dialog';
import ZoneMap from "./ZoneMap";
import "./zoneGeneration.css"
export const BusForm = ({ form, onFinish, BusDataCopy, setBusDataCopy, bus_index, base_year, substationDataCopy}) => {
    const [select, setSelect] = useState(false)
    const [visible, setVisible] = useState(false)
    const [x, setX] = useState()
    const [dialogHeader, setDialogHeader] = useState("")
    const [genType, setGenType] = useState()
    const zoneNames = {
        0: "Thrace (TRAKYA)",
        1: "West Anatolia",
        2: "North West Anatolia",
        3: "Middle Black Sea",
        4: "Eastern Anatolia",
        5: "Middle Anatolia",
        6: "West Mediterranean",
        7: "East Mediterranean",
        8: "Southeastern Anatolia",
    }
    const unitTypes = {naturalGas: "Natural Gas", lignite: "Lignite", importCoal: "Import Coal", localCoal: "Local Coal", wind: "Wind", solar: "Solar", hydro: "Hydro", ror: "RoR", geothermal: "Geothermal", biomass:"Biomass", other:"Other", nuclear: "Nuclear"}
    form.resetFields()

    const onValuesChange = (changedValues, values) => {

        if(typeof values.gasCapacity != 'undefined'){
          BusDataCopy.buses[bus_index][base_year.code].natural_gas.capacity = values.gasCapacity
        }
        if(typeof values.ligniteCapacity != 'undefined') {
          BusDataCopy.buses[bus_index][base_year.code].lignite.capacity = values.ligniteCapacity
        }
        if(typeof values.importCoalCapacity != 'undefined') {
          BusDataCopy.buses[bus_index][base_year.code].import_coal.capacity = values.importCoalCapacity
        }
        if(typeof values.localCoalCapacity != 'undefined') {
          BusDataCopy.buses[bus_index][base_year.code].hard_coal.capacity = values.localCoalCapacity
        }
        if(typeof values.windCapacity != 'undefined'){
          BusDataCopy.buses[bus_index][base_year.code].wind.capacity = values.windCapacity
        }
        if(typeof values.solarCapacity != 'undefined') {
          BusDataCopy.buses[bus_index][base_year.code].solar.capacity = values.solarCapacity
        }
        if(typeof values.hydroCapacity != 'undefined') {
          BusDataCopy.buses[bus_index][base_year.code].hydro_dam.capacity = values.hydroCapacity
        }
        if(typeof values.rorCapacity != 'undefined') {
          BusDataCopy.buses[bus_index][base_year.code].hydro_ror.capacity = values.rorCapacity
        }
        if(typeof values.consumption != 'undefined'){
          BusDataCopy.buses[bus_index][base_year.code].load.capacity = values.consumption
        }
        if(typeof values.nuclearCapacity != 'undefined'){
          BusDataCopy.buses[bus_index][base_year.code].nuclear.capacity = values.nuclearCapacity
        }
        if(typeof values.geothermalCapacity != 'undefined'){
          BusDataCopy.buses[bus_index][base_year.code].geothermal.capacity = values.geothermalCapacity
        }
        if(typeof values.biomassCapacity != 'undefined'){
          BusDataCopy.buses[bus_index][base_year.code].biomass.capacity = values.biomassCapacity
        }
        if(typeof values.entsoeCapacity != 'undefined'){
          BusDataCopy.buses[bus_index][base_year.code].entsoe.capacity = values.entsoeCapacity
        }
        if(typeof values.georgiaCapacity != 'undefined'){
          BusDataCopy.buses[bus_index][base_year.code].georgia.capacity = values.georgiaCapacity
        }
        if(typeof values.otherCapacity != 'undefined'){
          BusDataCopy.buses[bus_index][base_year.code].other.capacity = values.otherCapacity
        }
    
        if(typeof values.act_gas != 'undefined'){
          BusDataCopy.buses[bus_index][base_year.code].natural_gas.active = values.act_gas
          setX(Math.random())
        }
        if(typeof values.act_lignite != 'undefined') {
          BusDataCopy.buses[bus_index][base_year.code].lignite.active = values.act_lignite
          setX(Math.random())
        }
        if(typeof values.act_importCoal != 'undefined') {
          BusDataCopy.buses[bus_index][base_year.code].import_coal.active = values.act_importCoal
          setX(Math.random())
        }
        if(typeof values.act_localCoal != 'undefined') {
          BusDataCopy.buses[bus_index][base_year.code].hard_coal.active = values.act_localCoal
          setX(Math.random())
        }
        if(typeof values.act_wind != 'undefined'){
          BusDataCopy.buses[bus_index][base_year.code].wind.active = values.act_wind
          setX(Math.random())
        }
        if(typeof values.act_solar != 'undefined') {
          BusDataCopy.buses[bus_index][base_year.code].solar.active = values.act_solar
          setX(Math.random())
        }
        if(typeof values.act_hydro != 'undefined') {
          BusDataCopy.buses[bus_index][base_year.code].hydro_dam.active = values.act_hydro
          setX(Math.random())
        }
        if(typeof values.act_ror != 'undefined') {
          BusDataCopy.buses[bus_index][base_year.code].hydro_ror.active = values.act_ror
          setX(Math.random())
        }
        if(typeof values.act_consumption != 'undefined'){
          BusDataCopy.buses[bus_index][base_year.code].load.active = values.act_consumption
          setX(Math.random())
        }
        if(typeof values.act_nuclear != 'undefined'){
          BusDataCopy.buses[bus_index][base_year.code].nuclear.active = values.act_nuclear
          setX(Math.random())
        }
        if(typeof values.act_geothermal != 'undefined'){
          BusDataCopy.buses[bus_index][base_year.code].geothermal.active = values.act_geothermal
          setX(Math.random())
        }
        if(typeof values.act_biomass != 'undefined'){
          BusDataCopy.buses[bus_index][base_year.code].biomass.active = values.act_biomass
          setX(Math.random())
        }
        if(typeof values.act_entsoe != 'undefined'){
          BusDataCopy.buses[bus_index][base_year.code].entsoe.active = values.act_entsoe
          setX(Math.random())
        }
        if(typeof values.act_georgia != 'undefined'){
          BusDataCopy.buses[bus_index][base_year.code].georgia.active = values.act_georgia
          setX(Math.random())
        }
        if(typeof values.act_other != 'undefined'){
          BusDataCopy.buses[bus_index][base_year.code].other.active = values.act_other
          setX(Math.random())
        }  
        
      };
    
    const Change = (type) =>{
        setGenType(type)
        setVisible(true)
        setDialogHeader(zoneNames[bus_index] + " - " + unitTypes[type])
    }
    return (
        <div>
            <Form
            form={form}
            autoComplete="off"
            onValuesChange={onValuesChange}
            onFinish={onFinish}
            >
                
                <Divider className="FormDivider1" orientation="center">Consumption</Divider>
                <Row>
                    <Col span={12}>
                        <Form.Item
                        label="Load in the time range"
                        name="consumption"
                        labelCol={{ span: 12 }}
                        wrapperCol={{ span: 10 }}
                        >
                        <InputNumber disabled={!BusDataCopy.buses[bus_index][base_year.code].load.active} className="consumption" min={0} defaultValue={BusDataCopy.buses[bus_index][base_year.code].load.capacity} addonAfter="TWh"/>
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                        label="Activated"
                        name="act_consumption"
                        labelCol={{ span: 14 }}
                        wrapperCol={{ span: 10 }}
                        >
                        <Switch defaultChecked={BusDataCopy.buses[bus_index][base_year.code].load.active}/>
                        </Form.Item>
                    </Col>
                </Row>
                
                <Divider className="FormDivider2" orientation="center">Thermal Generation Capacity</Divider>

                <Row>
                    <Col span={12}>
                        <Form.Item
                            label="Gas"
                            name="gasCapacity"
                            labelCol={{ span: 12 }}
                            wrapperCol={{ span: 10 }}
                        >
                            <InputNumber disabled className="gas" min={0} defaultValue={BusDataCopy.buses[bus_index][base_year.code].natural_gas.capacity} addonAfter="MW"/>
                        </Form.Item>
                    </Col>
                    <Col span={6} style={{textAlign:"center"}}>
                        <Button disabled={!BusDataCopy.buses[bus_index][base_year.code].natural_gas.active} id="gasChange" onClick={(e)=>Change("naturalGas")}>Edit</Button>
                    </Col>
                    <Col span={6} >
                        <Form.Item
                        label="Activated"
                        name="act_gas"
                        labelCol={{ span: 14 }}
                        wrapperCol={{ span: 10 }}
                        >
                        <Switch defaultChecked={BusDataCopy.buses[bus_index][base_year.code].natural_gas.active}/>
                        </Form.Item>
                    </Col>
                    
                </Row>
                
                <Row>
                    <Col span={12}>
                        <Form.Item
                            label="Lignite"
                            name="ligniteCapacity"
                            labelCol={{ span: 12 }}
                            wrapperCol={{ span: 10 }}
                        >
                            <InputNumber className="lignite" disabled min={0} defaultValue={BusDataCopy.buses[bus_index][base_year.code].lignite.capacity} addonAfter="MW"/>
                        </Form.Item>
                    </Col>
                    <Col span={6} style={{textAlign:"center"}}>
                        <Button id="ligniteChange" disabled={!BusDataCopy.buses[bus_index][base_year.code].lignite.active} onClick={(e)=>Change("lignite")}>Edit</Button>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                        label="Activated"
                        name="act_lignite"
                        labelCol={{ span: 14 }}
                        wrapperCol={{ span: 10 }}
                        >
                        <Switch defaultChecked={BusDataCopy.buses[bus_index][base_year.code].lignite.active}/>
                        </Form.Item>
                    </Col>
                    
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item
                            label="Import Coal"
                            name="importCoalCapacity"
                            labelCol={{ span: 12 }}
                            wrapperCol={{ span: 10 }}
                        >
                        <InputNumber disabled className="importCoal" min={0} defaultValue={BusDataCopy.buses[bus_index][base_year.code].import_coal.capacity} addonAfter="MW"/>
                    </Form.Item>
                    </Col>
                    <Col span={6} style={{textAlign:"center"}}>
                        <Button id="importCoalChange" disabled={!BusDataCopy.buses[bus_index][base_year.code].import_coal.active} onClick={(e)=>Change("importCoal")}>Edit</Button>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                        label="Activated"
                        name="act_importCoal"
                        labelCol={{ span: 14 }}
                        wrapperCol={{ span: 10 }}
                        >
                        <Switch defaultChecked={BusDataCopy.buses[bus_index][base_year.code].import_coal.active}/>
                        </Form.Item>
                    </Col>
                    
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item
                            label="Local Coal"
                            name="localCoalCapacity"
                            labelCol={{ span: 12 }}
                            wrapperCol={{ span: 10 }}
                        >
                        <InputNumber disabled className="localCoal" min={0} defaultValue={BusDataCopy.buses[bus_index][base_year.code].hard_coal.capacity} addonAfter="MW"/>
                    </Form.Item>
                    </Col>
                    <Col span={6} style={{textAlign:"center"}}>
                        <Button id="localCoalChange" disabled={!BusDataCopy.buses[bus_index][base_year.code].hard_coal.active} onClick={(e)=>Change("localCoal")}>Edit</Button>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                        label="Activated"
                        name="act_localCoal"
                        labelCol={{ span: 14 }}
                        wrapperCol={{ span: 10 }}
                        >
                        <Switch defaultChecked={BusDataCopy.buses[bus_index][base_year.code].hard_coal.active}/>
                        </Form.Item>
                    </Col>
                    
                </Row>

                <Divider className="FormDivider3" orientation="center">Renewable Generation Capacity</Divider>

                <Row>
                    <Col span={12}>
                        <Form.Item
                            label="Wind"
                            name="windCapacity"
                            labelCol={{ span: 12 }}
                            wrapperCol={{ span: 10 }}
                        >
                        <InputNumber disabled className="wind" min={0} defaultValue={BusDataCopy.buses[bus_index][base_year.code].wind.capacity} addonAfter="MW"/>
                    </Form.Item>
                    </Col>
                    <Col span={6} style={{textAlign:"center"}}>
                        <Button id="WindChange" disabled={!BusDataCopy.buses[bus_index][base_year.code].wind.active} onClick={(e)=>Change("wind")}>Edit</Button>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                        label="Activated"
                        name="act_wind"
                        labelCol={{ span: 14 }}
                        wrapperCol={{ span: 10 }}
                        >
                        <Switch defaultChecked={BusDataCopy.buses[bus_index][base_year.code].wind.active}/>
                        </Form.Item>
                    </Col>
                </Row>

                <Row>
                    <Col span={12}>
                        <Form.Item
                            label="Solar"
                            name="solarCapacity"
                            labelCol={{ span: 12 }}
                            wrapperCol={{ span: 10 }}
                        >
                        <InputNumber disabled className="solar" min={0} defaultValue={BusDataCopy.buses[bus_index][base_year.code].solar.capacity} addonAfter="MW"/>
                    </Form.Item>
                    </Col>
                    <Col span={6} style={{textAlign:"center"}}>
                        <Button id="solarChange" disabled={!BusDataCopy.buses[bus_index][base_year.code].solar.active} onClick={(e)=>Change("solar")}>Edit</Button>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                        label="Activated"
                        name="act_solar"
                        labelCol={{ span: 14 }}
                        wrapperCol={{ span: 10 }}
                        >
                        <Switch defaultChecked={BusDataCopy.buses[bus_index][base_year.code].solar.active}/>
                        </Form.Item>
                    </Col>
                </Row>

                <Row>
                    <Col span={12}>
                        <Form.Item
                            label="Hydro"
                            name="hydroCapacity"
                            labelCol={{ span: 12 }}
                            wrapperCol={{ span: 10 }}
                        >
                        <InputNumber disabled className="hydro" min={0} defaultValue={BusDataCopy.buses[bus_index][base_year.code].hydro_dam.capacity} addonAfter="MW"/>
                    </Form.Item>
                    </Col>
                    <Col span={6} style={{textAlign:"center"}}>
                        <Button id="hydroChange" disabled={!BusDataCopy.buses[bus_index][base_year.code].hydro_dam.active} onClick={(e)=>Change("hydro")}>Edit</Button>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                        label="Activated"
                        name="act_hydro"
                        labelCol={{ span: 14 }}
                        wrapperCol={{ span: 10 }}
                        >
                        <Switch defaultChecked={BusDataCopy.buses[bus_index][base_year.code].hydro_dam.active}/>
                        </Form.Item>
                    </Col>
                </Row>

                <Row>
                    <Col span={12}>
                        <Form.Item
                            label="RoR"
                            name="rorCapacity"
                            labelCol={{ span: 12 }}
                            wrapperCol={{ span: 10 }}
                        >
                        <InputNumber className="ror" disabled={!BusDataCopy.buses[bus_index][base_year.code].hydro_ror.active} min={0} defaultValue={BusDataCopy.buses[bus_index][base_year.code].hydro_ror.capacity} addonAfter="MW"/>
                    </Form.Item>
                    </Col>
                    <Col span={6} style={{textAlign:"center"}}>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                        label="Activated"
                        name="act_ror"
                        labelCol={{ span: 14 }}
                        wrapperCol={{ span: 10 }}
                        >
                        <Switch defaultChecked={BusDataCopy.buses[bus_index][base_year.code].hydro_ror.active}/>
                        </Form.Item>
                    </Col>
                </Row>

                <Divider className="FormDivider4" orientation="center">Other Generation Capacity</Divider>

                <Row>
                    <Col span={12}>
                        <Form.Item
                            label="Geothermal"
                            name="geothermalCapacity"
                            labelCol={{ span: 12 }}
                            wrapperCol={{ span: 10 }}
                        >
                        <InputNumber disabled className="geothermal" min={0} defaultValue={BusDataCopy.buses[bus_index][base_year.code].geothermal.capacity} addonAfter="MW"/>
                    </Form.Item>
                    </Col>
                    <Col span={6} style={{textAlign:"center"}}>
                        <Button id="geothermalChange" disabled={!BusDataCopy.buses[bus_index][base_year.code].geothermal.active} onClick={(e)=>Change("geothermal")}>Edit</Button>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                        label="Activated"
                        name="act_geothermal"
                        labelCol={{ span: 14 }}
                        wrapperCol={{ span: 10 }}
                        >
                        <Switch defaultChecked={BusDataCopy.buses[bus_index][base_year.code].geothermal.active}/>
                        </Form.Item>
                    </Col>
                </Row>

                <Row>
                    <Col span={12}>
                        <Form.Item
                            label="Biomass"
                            name="biomassCapacity"
                            labelCol={{ span: 12 }}
                            wrapperCol={{ span: 10 }}
                        >
                        <InputNumber disabled className="biomass" min={0} defaultValue={BusDataCopy.buses[bus_index][base_year.code].biomass.capacity} addonAfter="MW"/>
                    </Form.Item>
                    </Col>
                    <Col span={6} style={{textAlign:"center"}}>
                        <Button id="biomassChange" disabled={!BusDataCopy.buses[bus_index][base_year.code].biomass.active} onClick={(e)=>Change("biomass")}>Edit</Button>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                        label="Activated"
                        name="act_biomass"
                        labelCol={{ span: 14 }}
                        wrapperCol={{ span: 10 }}
                        >
                        <Switch defaultChecked={BusDataCopy.buses[bus_index][base_year.code].biomass.active}/>
                        </Form.Item>
                    </Col>
                </Row>

                <Row>
                    <Col span={12}>
                        <Form.Item
                            label="Other"
                            name="otherCapacity"
                            labelCol={{ span: 12 }}
                            wrapperCol={{ span: 10 }}
                        >
                        <InputNumber disabled className="other" min={0} defaultValue={BusDataCopy.buses[bus_index][base_year.code].other.capacity} addonAfter="MW"/>
                    </Form.Item>
                    </Col>
                    <Col span={6} style={{textAlign:"center"}}>
                        <Button id="otherChange" disabled={!BusDataCopy.buses[bus_index][base_year.code].other.active} onClick={(e)=>Change("other")}>Edit</Button>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                        label="Activated"
                        name="act_other"
                        labelCol={{ span: 14 }}
                        wrapperCol={{ span: 10 }}
                        >
                        <Switch defaultChecked={BusDataCopy.buses[bus_index][base_year.code].other.active}/>
                        </Form.Item>
                    </Col>
                </Row>
                {BusDataCopy.buses[bus_index][base_year.code].nuclear.active !== null && <Row>
                    <Col span={12}>
                        <Form.Item
                            label="Nuclear"
                            name="nuclearCapacity"
                            labelCol={{ span: 12 }}
                            wrapperCol={{ span: 10 }}
                        >
                        <InputNumber disabled className="nuclear" min={0} defaultValue={BusDataCopy.buses[bus_index][base_year.code].nuclear.capacity} addonAfter="MW"/>
                    </Form.Item>
                    </Col>
                    <Col span={6} style={{textAlign:"center"}}>
                        <Button id="nuclearChange" disabled={!BusDataCopy.buses[bus_index][base_year.code].nuclear.active} onClick={(e)=>Change("nuclear")}>Edit</Button>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                        label="Activated"
                        name="act_nuclear"
                        labelCol={{ span: 14 }}
                        wrapperCol={{ span: 10 }}
                        >
                        <Switch defaultChecked={BusDataCopy.buses[bus_index][base_year.code].nuclear.active}/>
                        </Form.Item>
                    </Col>
                </Row>}
                {BusDataCopy.buses[bus_index][base_year.code].entsoe.active !== null && <Row>
                    <Col span={12}>
                        <Form.Item
                            label="ENTSO-E"
                            name="entsoeCapacity"
                            labelCol={{ span: 12 }}
                            wrapperCol={{ span: 10 }}
                        >
                        <InputNumber className="entsoe" min={0} disabled={!BusDataCopy.buses[bus_index][base_year.code].entsoe.active} defaultValue={BusDataCopy.buses[bus_index][base_year.code].entsoe.capacity} addonAfter="MW"/>
                    </Form.Item>
                    </Col>
                    <Col span={6} style={{textAlign:"center"}}>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                        label="Activated"
                        name="act_entsoe"
                        labelCol={{ span: 14 }}
                        wrapperCol={{ span: 10 }}
                        >
                        <Switch defaultChecked={BusDataCopy.buses[bus_index][base_year.code].entsoe.active}/>
                        </Form.Item>
                    </Col>
                </Row>}
                {BusDataCopy.buses[bus_index][base_year.code].georgia.active !== null && <Row>
                    <Col span={12}>
                        <Form.Item
                            label="Georgia"
                            name="georgiaCapacity"
                            labelCol={{ span: 12 }}
                            wrapperCol={{ span: 10 }}
                        >
                        <InputNumber className="georgia" min={0} defaultValue={BusDataCopy.buses[bus_index][base_year.code].georgia.capacity} addonAfter="MW"/>
                    </Form.Item>
                    </Col>
                    <Col span={6} style={{textAlign:"center"}}>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                        label="Activated"
                        name="act_georgia"
                        labelCol={{ span: 14 }}
                        wrapperCol={{ span: 10 }}
                        >
                        <Switch defaultChecked={BusDataCopy.buses[bus_index][base_year.code].georgia.active}/>
                        </Form.Item>
                    </Col>
                </Row>}
            </Form>
            <Dialog visible={visible} onHide={(e)=>{setVisible(false)}} style={{width:"50%",height:"80%"}} header={dialogHeader} closeOnEscape={!select}>
                <ZoneMap base_year={base_year} bus_index={bus_index} genType={genType} substationDataCopy={substationDataCopy} BusDataCopy={BusDataCopy} setBusDataCopy={setBusDataCopy} select={select} setSelect={setSelect}></ZoneMap>
            </Dialog>
        </div>
        
    );
};