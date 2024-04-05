import React, {useEffect, useState} from "react";
import { Form, Switch, InputNumber, Row, Col, Button } from "antd";
import { Dialog } from 'primereact/dialog';
import ZoneMap from "./ZoneMap";
export const RESGeneratorForm = ({ form, onFinish, BusDataCopy, setBusDataCopy, bus_index, base_year, substationDataCopy}) => {
    const [select, setSelect] = useState(false)
    const [visible, setVisible] = useState(false)
    const [dialogHeader, setDialogHeader] = useState("")
    const [genType, setGenType] = useState()
    const [x, setX] = useState()
    const unitTypes = {naturalGas: "Natural Gas", lignite: "Lignite", importCoal: "Import Coal", localCoal: "Local Coal", wind: "Wind", solar: "Solar", hydro: "Hydro", ror: "RoR", geothermal: "Geothermal", biomass:"Biomass", other:"Other", nuclear: "Nuclear"}
    form.resetFields()
    
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


    const onValuesChange = (changedValues, values) => {
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
                        label="Wind"
                        name="windCapacity"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 10 }}
                    >
                    <InputNumber disabled className="wind" min={0} defaultValue={BusDataCopy.buses[bus_index][base_year.code].wind.capacity} addonAfter="MW"/>
                </Form.Item>
                </Col>
                <Col span={4}>
                        <Button id="windChange" disabled={!BusDataCopy.buses[bus_index][base_year.code].wind.active} onClick={(e)=>Change("wind")}>Edit</Button>
                    </Col>
                <Col span={8}>
                    <Form.Item
                    label="Activated"
                    name="act_wind"
                    labelCol={{ span: 12 }}
                    wrapperCol={{ span: 12 }}
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
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 10 }}
                    >
                    <InputNumber disabled className="solar" min={0} defaultValue={BusDataCopy.buses[bus_index][base_year.code].solar.capacity} addonAfter="MW"/>
                </Form.Item>
                </Col>
                <Col span={4}>
                        <Button id="solarChange" disabled={!BusDataCopy.buses[bus_index][base_year.code].solar.active} onClick={(e)=>Change("solar")}>Edit</Button>
                    </Col>
                <Col span={8}>
                    <Form.Item
                    label="Activated"
                    name="act_solar"
                    labelCol={{ span: 12 }}
                    wrapperCol={{ span: 12 }}
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
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 10 }}
                    >
                    <InputNumber disabled className="hydro" min={0} defaultValue={BusDataCopy.buses[bus_index][base_year.code].hydro_dam.capacity} addonAfter="MW"/>
                </Form.Item>
                </Col>
                <Col span={4}>
                        <Button id="hydroChange" disabled={!BusDataCopy.buses[bus_index][base_year.code].hydro_dam.active} onClick={(e)=>Change("hydro")}>Edit</Button>
                    </Col>
                <Col span={8}>
                    <Form.Item
                    label="Activated"
                    name="act_hydro"
                    labelCol={{ span: 12 }}
                    wrapperCol={{ span: 12 }}
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
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 10 }}
                    >
                    <InputNumber disabled={!BusDataCopy.buses[bus_index][base_year.code].hydro_ror.active} className="ror" min={0} defaultValue={BusDataCopy.buses[bus_index][base_year.code].hydro_ror.capacity} addonAfter="MW"/>
                </Form.Item>
                </Col>
                <Col span={4}>
                    </Col>
                <Col span={8}>
                    <Form.Item
                    label="Activated"
                    name="act_ror"
                    labelCol={{ span: 12 }}
                    wrapperCol={{ span: 12 }}
                    >
                    <Switch defaultChecked={BusDataCopy.buses[bus_index][base_year.code].hydro_ror.active}/>
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