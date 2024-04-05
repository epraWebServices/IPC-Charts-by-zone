import React from "react";
import { Form, Switch, InputNumber } from "antd";

export const ThermalGeneratorForm = ({ form, onFinish, bus_data, bus_index, base_year}) => {
    form.resetFields()
    return (
        <Form
        form={form}
        labelCol={{ span: 10 }}
        wrapperCol={{ span: 12 }}
        autoComplete="off"
        onFinish={onFinish}
        
        >
        <Form.Item
            label="Gas Generation"
            name="gasGeneration"
        >
            <InputNumber defaultValue={bus_data.buses[bus_index][base_year.code].natural_gas} addonAfter="MW"/>
        </Form.Item>
        <Form.Item
            label="Lignite Generation"
            name="ligniteGeneration"
        >
            <InputNumber defaultValue={bus_data.buses[bus_index][base_year.code].lignite} addonAfter="MW"/>
        </Form.Item>
        <Form.Item
            label="Import Coal Generation"
            name="importCoalGeneration"
        >
            <InputNumber defaultValue={bus_data.buses[bus_index][base_year.code].import_coal} addonAfter="MW"/>
        </Form.Item>
        <Form.Item
            label="Local Coal Generation"
            name="localCoalGeneration"
        >
            <InputNumber defaultValue={bus_data.buses[bus_index][base_year.code].hard_coal} addonAfter="MW"/>
        </Form.Item>
        <Form.Item
            label="Activated"
            name="activated"
        >
            <Switch defaultChecked={bus_data.buses[bus_index][base_year.code].ThermalGenerator.active}></Switch>
        </Form.Item>
        </Form>
    );
};