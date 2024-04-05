import React, { useEffect, useState, useRef } from "react";
import 'antd/dist/antd.css';
import { Button, Form, Input, InputNumber} from 'antd';
import { setYear } from "rsuite/esm/utils/dateUtils";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
import * as ReactDOMServer from 'react-dom/server';
import './DialogCss.css'
const RegionData = (props) => {
    const [form] = Form.useForm();
    const zone_generation = require('./zoneGeneration.json')
    const {zones, year, zone_name } = props;
    const [X, setX] = useState()
    const [Y, setY] = useState()
    const [footerGroup, setfooterGroup] = useState()
    const generation_info = zone_generation.data[year][zone_name]
    const a = {
    "Natural Gas": generation_info["Natural Gas"] ? Number(generation_info["Natural Gas"].toFixed(2)) : 0,
    "Hydro (Dam)": generation_info["Hydro (Dam)"] ? Number(generation_info["Hydro (Dam)"].toFixed(2)) : 0,
    "Hydro (RoR)": generation_info["Hydro (RoR)"] ? Number(generation_info["Hydro (RoR)"].toFixed(2)) : 0,
    "Hard Coal": generation_info["Hard Coal"] ? Number(generation_info["Hard Coal"].toFixed(2)) : 0,
    "Import Coal": generation_info["Import Coal"] ? Number(generation_info["Import Coal"].toFixed(2)) : 0,
    "Lignite": generation_info["Lignite"] ? Number(generation_info["Lignite"].toFixed(2)) : 0,
    "Geothermal": generation_info["Geothermal"] ? Number(generation_info["Geothermal"].toFixed(2)) : 0,
    "Biomass": generation_info["Biomass"] ? Number(generation_info["Biomass"].toFixed(2)) : 0,
    "Solar": generation_info["Solar"] ? Number(generation_info["Solar"].toFixed(2)) : 0,
    "Wind": generation_info["Wind"] ? Number(generation_info["Wind"].toFixed(2)) : 0, 
    "Nuclear": generation_info["Nuclear"] ? Number(generation_info["Nuclear"].toFixed(2)) : 0, 
    "ENTSOE": generation_info["ENTSOE"] ? Number(generation_info["ENTSOE"].toFixed(2)) : 0,
    "Georgia": generation_info["Georgia"] ? Number(generation_info["Georgia"].toFixed(2)) : 0,
    "Other": generation_info["Other"] ? Number(generation_info["Other"].toFixed(2)) : 0
    }
    var generation_fleet = a
    const total_generation = Number(Object.values(a).reduce((partialSum, b) => partialSum + b, 0).toFixed(2))
    generation_fleet["Total"] = total_generation
    const [fleet, setFleet] = useState(generation_fleet)
    function withoutProperty(obj, property) {  
        const { [property]: unused, ...rest } = obj
        return rest
    }
    function changeFleet(changedValues, allValues){
        zone_generation.data[Number(year)][zone_name] = allValues
        const values_without_total = withoutProperty(allValues, 'Total')
        const total= Number(Object.values(values_without_total ).reduce((partialSum, b) => partialSum + b, 0).toFixed(2))
        zone_generation.data[Number(year)][zone_name]["Total"] = total
        generation_fleet = zone_generation.data[Number(year)][zone_name]
        setFleet(generation_fleet)
        form.setFieldValue("Total",total)
    }

    useEffect(()=>{
        setX(<div>
                <Form
                    name="fleet"
                    labelCol={{ span: 10 }}
                    wrapperCol={{ span: 16 }}
                    initialValues= {fleet}
                    autoComplete="off"
                    onValuesChange = {changeFleet}
                    form={form}
                >
                    <Form.Item label="Natural Gas" name="Natural Gas">
                        <InputNumber style={{width:"150px"}} addonAfter="MW" step={50} min={0}/>
                    </Form.Item>

                    <Form.Item label="Hydro (Dam)" name="Hydro (Dam)">
                        <InputNumber style={{width:"150px"}} addonAfter="MW" step={50} min={0}/>
                    </Form.Item>

                    <Form.Item label="Hydro (RoR)" name="Hydro (RoR)">
                        <InputNumber style={{width:"150px"}} addonAfter="MW" step={50} min={0}/>
                    </Form.Item>

                    <Form.Item label="Hard Coal" name="Hard Coal">
                        <InputNumber style={{width:"150px"}} addonAfter="MW" step={50} min={0}/>
                    </Form.Item>

                    <Form.Item label="Import Coal" name="Import Coal">
                        <InputNumber style={{width:"150px"}} addonAfter="MW" step={50} min={0}/>
                    </Form.Item>

                    <Form.Item label="Lignite" name="Lignite">
                        <InputNumber style={{width:"150px"}} addonAfter="MW" step={50} min={0}/>
                    </Form.Item>

                    <Form.Item label="Geothermal" name="Geothermal">
                        <InputNumber style={{width:"150px"}} addonAfter="MW" step={50} min={0}/>
                    </Form.Item>

                    <Form.Item label="Biomass" name="Biomass">
                        <InputNumber style={{width:"150px"}} addonAfter="MW" step={50} min={0}/>
                    </Form.Item>

                    <Form.Item label="Solar" name="Solar">
                        <InputNumber style={{width:"150px"}} addonAfter="MW" step={50} min={0}/>
                    </Form.Item>

                    <Form.Item label="Wind" name="Wind">
                        <InputNumber style={{width:"150px"}} addonAfter="MW" step={50} min={0}/>
                    </Form.Item>

                    <Form.Item label="Nuclear" name="Nuclear">
                        <InputNumber style={{width:"150px"}} addonAfter="MW" step={50} min={0}/>
                    </Form.Item>

                    <Form.Item label="ENTSOE" name="ENTSOE">
                        <InputNumber style={{width:"150px"}} addonAfter="MW" step={50} min={0}/>
                    </Form.Item>

                    <Form.Item label="Georgia" name="Georgia">
                        <InputNumber style={{width:"150px"}} addonAfter="MW" step={50} min={0}/>
                    </Form.Item>

                    <Form.Item label="Other" name="Other">
                        <InputNumber style={{width:"150px"}} addonAfter="MW" step={50} min={0}/>
                    </Form.Item>

                    <Form.Item label="Total" name="Total">
                        <InputNumber style={{width:"150px"}} addonAfter="MW" disabled></InputNumber>
                    </Form.Item>
                </Form>
            </div>)
        var tot = 0
        let j = 0
        var z = {"Natural Gas": 0,
        "Hydro (Dam)": 0,
        "Hydro (RoR)": 0,
        "Hard Coal": 0,
        "Import Coal": 0,
        "Lignite": 0,
        "Geothermal": 0,
        "Biomass": 0,
        "Solar": 0,
        "Wind": 0,
        "Nuclear": 0,
        "ENTSOE": 0,
        "Georgia": 0,
        "Other": 0}
        for (var i=0; i<Object.keys(zone_generation.data[year]).length; i++){
            if(zone_generation.data[year][Object.keys(zone_generation.data[year])[i]]){
                j = withoutProperty(zone_generation.data[year][Object.keys(zone_generation.data[year])[i]], 'Total')
            }
            else{
                j = zone_generation.data[year][Object.keys(zone_generation.data[year])[i]]
            }
            tot += Number(Object.values(j).reduce((partialSum, b) => partialSum + b, 0))    
        }
        for(var k=0; k<Object.keys(zones).length; k++){
            const name = zones[k+1].name
            for(var l=0; l<Object.keys(z).length; l++){
                z[Object.keys(z)[l]] += zone_generation.data[year][name][Object.keys(z)[l]]
            }   
        }
        tot = tot.toFixed(2)
        var total_fleet = [
            {"type": "Natural Gas", "fleet": Number(z["Natural Gas"].toFixed(2))},
            {"type": "Hydro (Dam)", "fleet": Number(z["Hydro (Dam)"].toFixed(2))},
            {"type": "Hydro (RoR)", "fleet": Number(z["Hydro (RoR)"].toFixed(2))},
            {"type": "Hard Coal", "fleet": Number(z["Hard Coal"].toFixed(2))},
            {"type": "Import Coal", "fleet": Number(z["Import Coal"].toFixed(2))},
            {"type": "Lignite", "fleet": Number(z["Lignite"].toFixed(2))},
            {"type": "Geothermal", "fleet": Number(z["Geothermal"].toFixed(2))},
            {"type": "Biomass", "fleet": Number(z["Biomass"].toFixed(2))},
            {"type": "Solar", "fleet": Number(z["Solar"].toFixed(2))},
            {"type": "Wind", "fleet": Number(z["Wind"].toFixed(2))}, 
            {"type": "Nuclear", "fleet": Number(z["Nuclear"].toFixed(2))}, 
            {"type": "ENTSOE", "fleet": Number(z["ENTSOE"].toFixed(2))},
            {"type": "Georgia", "fleet": Number(z["Georgia"].toFixed(2))},
            {"type": "Other", "fleet": Number(z["Other"].toFixed(2))}
          ]
        
        setfooterGroup (
            <ColumnGroup>
              <Row>
                <Column footer="Total" colSpan={1}/>
                <Column footer={tot} />
              </Row>
            </ColumnGroup>
          )
        setY(
            <div className="card">
                <DataTable header="Generation Fleet" value={total_fleet} footerColumnGroup={footerGroup} responsiveLayout="scroll" style={{textAlign:"center"}}>
                    <Column field="type" header="Type" headerStyle={{width:'10rem'}} style={{alignItems:"center"}}></Column>
                    <Column field="fleet" header="Fleet (MW)" headerStyle={{width:'10rem'}} style={{alignItems:"center"}}></Column>
                </DataTable>
            </div>      
        )
        
        const datatable = document.getElementById("Generation Fleet")
        datatable.innerHTML = ReactDOMServer.renderToString(Y)
    },[fleet, Y])
    
    return (
        X
    )
    
    
}
export default RegionData