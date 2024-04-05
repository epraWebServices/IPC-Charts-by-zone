import React, {useEffect, useState} from "react";
import { Form, Switch, InputNumber, Row, Col, Button } from "antd";
import { Dialog } from 'primereact/dialog';
import ZoneMap from "./ZoneMap";
import "./zoneGeneration.css"
export const ThermalGeneratorForm = ({ form, onFinish, BusDataCopy, setBusDataCopy, bus_index, base_year, substationDataCopy}) => {
    const [select, setSelect] = useState(false)
    const [visible, setVisible] = useState(false)
    const [dialogHeader, setDialogHeader] = useState("")
    const [genType, setGenType] = useState()
    const [x, setX] = useState()
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
    const unitTypes = {naturalGas: "Natural Gas", lignite: "Lignite", importCoal: "Import Coal", localCoal: "Local Coal"}
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
        onFinish={onFinish}
        onValuesChange={onValuesChange}
        >
                       <Row>
                    <Col span={12}>
                        <Form.Item
                            label="Gas"
                            name="gasCapacity"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 10 }}
                        >
                            <InputNumber disabled className="gas" min={0} defaultValue={BusDataCopy.buses[bus_index][base_year.code].natural_gas.capacity} addonAfter="MW"/>
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Button id="gasChange" disabled={!BusDataCopy.buses[bus_index][base_year.code].natural_gas.active} onClick={(e)=>Change("naturalGas")}>Edit</Button>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                        label="Activated"
                        name="act_gas"
                        labelCol={{ span: 12 }}
                        wrapperCol={{ span: 12 }}
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
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 10 }}
                        >
                            <InputNumber className="lignite" disabled min={0} defaultValue={BusDataCopy.buses[bus_index][base_year.code].lignite.capacity} addonAfter="MW"/>
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Button id="ligniteChange" disabled={!BusDataCopy.buses[bus_index][base_year.code].lignite.active} onClick={(e)=>Change("lignite")}>Edit</Button>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                        label="Activated"
                        name="act_lignite"
                        labelCol={{ span: 12 }}
                        wrapperCol={{ span: 12 }}
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
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 10 }}
                        >
                        <InputNumber disabled className="importCoal" min={0} defaultValue={BusDataCopy.buses[bus_index][base_year.code].import_coal.capacity} addonAfter="MW"/>
                    </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Button id="importCoalChange" disabled={!BusDataCopy.buses[bus_index][base_year.code].import_coal.active} onClick={(e)=>Change("importCoal")}>Edit</Button>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                        label="Activated"
                        name="act_importCoal"
                        labelCol={{ span: 12 }}
                        wrapperCol={{ span: 12 }}
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
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 10 }}
                        >
                        <InputNumber disabled className="localCoal" min={0} defaultValue={BusDataCopy.buses[bus_index][base_year.code].hard_coal.capacity} addonAfter="MW"/>
                    </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Button id="localCoalChange" disabled={!BusDataCopy.buses[bus_index][base_year.code].hard_coal.active} onClick={(e)=>Change("localCoal")}>Edit</Button>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                        label="Activated"
                        name="act_localCoal"
                        labelCol={{ span: 12 }}
                        wrapperCol={{ span: 12 }}
                        >
                        <Switch defaultChecked={BusDataCopy.buses[bus_index][base_year.code].hard_coal.active}/>
                        </Form.Item>
                    </Col>
                </Row>
        </Form>
        <Dialog visible={visible} onHide={(e)=>{setVisible(false)}} style={{width:"50%",height:"80%"}} header={dialogHeader} closeOnEscape={!select}>
            <ZoneMap base_year={base_year} bus_index={bus_index} genType={genType} substationDataCopy={substationDataCopy} BusDataCopy={BusDataCopy} setBusDataCopy={setBusDataCopy} select={select} setSelect={setSelect}></ZoneMap>
        </Dialog>
        </div>

    );
};