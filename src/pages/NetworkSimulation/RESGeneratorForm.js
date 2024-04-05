import React from "react";
import { Form, Switch, InputNumber } from "antd";

export const RESGeneratorForm = ({ form, onFinish, bus_data, bus_index, base_year}) => {
    form.resetFields()
    return (
        <Form
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 12 }}
        autoComplete="off"
        onFinish={onFinish}
        >
        <Form.Item
            label="Wind Generation"
            name="windGeneration"
        >
            <InputNumber defaultValue={bus_data.buses[bus_index][base_year.code].wind} addonAfter="MW"/>
        </Form.Item>
        <Form.Item
            label="Solar Generation"
            name="solarGeneration"
        >
            <InputNumber defaultValue={bus_data.buses[bus_index][base_year.code].solar} addonAfter="MW"/>
        </Form.Item>
        <Form.Item
            label="Hydro Generation"
            name="hydroGeneration"
        >
            <InputNumber defaultValue={bus_data.buses[bus_index][base_year.code].hydro_dam} addonAfter="MW"/>
        </Form.Item>
        <Form.Item
            label="RoR Generation"
            name="rorGeneration"
        >
            <InputNumber defaultValue={bus_data.buses[bus_index][base_year.code].hydro_ror} addonAfter="MW"/>
        </Form.Item>
        <Form.Item
            label="Activated"
            name="activated"
        >
            <Switch defaultChecked={bus_data.buses[bus_index][base_year.code].RESGenerator.active}></Switch>
        </Form.Item>
        </Form>
    );
};