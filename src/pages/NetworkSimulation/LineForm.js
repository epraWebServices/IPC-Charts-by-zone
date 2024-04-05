import React, {useEffect} from "react";
import { Form, Switch, InputNumber } from "antd";

export const LineForm = ({ form, onFinish, LineData, line_index, base_year}) => {
    form.resetFields()

    useEffect (() => {
        
        const element = document.getElementsByClassName("ant-input-number ant-input-number-in-form-item " +  "capacity" + " ant-input-number")[0]
        if (LineData.lines[line_index][base_year.code].outofservice && element){
            element.className = "ant-input-number ant-input-number-in-form-item " + "capacity" + " ant-input-number-disabled"
            element.style["pointer-events"] = "none"
        }
   
    },[])

    const onValuesChange = (changedValues, values) => {
        if (Object.keys(changedValues)[0] === "activated"){
            
            if(Object.values(changedValues)[0] === false){
                const element = document.getElementsByClassName("ant-input-number ant-input-number-in-form-item " +  "capacity" + " ant-input-number")[0]
                element.className = "ant-input-number ant-input-number-in-form-item " + "capacity" + " ant-input-number-disabled"
                element.style["pointer-events"] = "none"
            }
            else if(Object.values(changedValues)[0] === true){
                const element = document.getElementsByClassName("ant-input-number ant-input-number-in-form-item " +  "capacity" + " ant-input-number-disabled")[0]
                element.className = "ant-input-number ant-input-number-in-form-item " + "capacity" + " ant-input-number"
                element.style["pointer-events"] = "auto"
            }
        }
      };

    return (
        <Form
        form={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 12 }}
        autoComplete="off"
        onFinish={onFinish}
        onValuesChange={onValuesChange}
        >
        <Form.Item
            label="Capacity"
            name="capacity"
        >
            <InputNumber className="capacity" defaultValue={LineData.lines[line_index][base_year.code].capacity} addonAfter="MVA"/>
        </Form.Item>
        <Form.Item
            label="Activated"
            name="activated"
        >
            <Switch defaultChecked={!LineData.lines[line_index][base_year.code].outofservice}></Switch>
        </Form.Item>
        </Form>
    );
};