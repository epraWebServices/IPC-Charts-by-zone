import React, {useEffect, useState} from "react";
import { Form, Switch, InputNumber, Row, Col } from "antd";

export const LoadForm = ({ form, onFinish, BusDataCopy, bus_index, base_year}) => {
    form.resetFields()
    const [x, setX] = useState()
    const onValuesChange = (changedValues, values) => {
        if(typeof values.consumption != 'undefined'){
            BusDataCopy.buses[bus_index][base_year.code].load.capacity = values.consumption
          }
          if(typeof values.act_consumption != 'undefined'){
            BusDataCopy.buses[bus_index][base_year.code].load.active = values.act_consumption
            setX(Math.random())
          }
      };
    return (
        <Form
        form={form}
        autoComplete="off"
        onFinish={onFinish}
        onValuesChange={onValuesChange}
        >
            <Row>
                <Col span={12}>
                    <Form.Item
                    label="Consumption"
                    name="consumption"
                    labelCol={{ span: 12 }}
                    wrapperCol={{ span: 12 }}
                    >
                    <InputNumber className="consumption" min={0} disabled={!BusDataCopy.buses[bus_index][base_year.code].load.active} defaultValue={BusDataCopy.buses[bus_index][base_year.code].load.capacity} addonAfter="TWh"/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                    label="Activated"
                    name="act_consumption"
                    labelCol={{ span: 12 }}
                    wrapperCol={{ span: 12 }}
                    >
                    <Switch defaultChecked={BusDataCopy.buses[bus_index][base_year.code].load.active}/>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
};