import React from "react";
import { Form, Switch, InputNumber, Divider } from "antd";

export const BusForm = ({ form, onFinish, bus_data, bus_index, base_year}) => {
    form.resetFields()
    return (
        <Form
        form={form}
        labelCol={{ span: 10 }}
        wrapperCol={{ span: 12 }}
        autoComplete="off"
        onFinish={onFinish}
        >
        
        <Divider orientation="center">Consumption</Divider>
        <Form.Item
            label="Consumption"
            name="consumption"
        >
            <InputNumber defaultValue={bus_data.buses[bus_index][base_year.code].load} addonAfter="MW"/>
        </Form.Item>
        <Divider orientation="center">Thermal Generation</Divider>

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

        <Divider orientation="center">Renewable Generation</Divider>

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

        <Divider orientation="center">Other Generation</Divider>

        <Form.Item
            label="Geothermal Generation"
            name="geothermalGeneration"
        >
            <InputNumber defaultValue={bus_data.buses[bus_index][base_year.code].geothermal} addonAfter="MW"/>
        </Form.Item>
        <Form.Item
            label="Biomass Generation"
            name="biomassGeneration"
        >
            <InputNumber defaultValue={bus_data.buses[bus_index][base_year.code].biomass} addonAfter="MW"/>
        </Form.Item>
        <Form.Item
            label="Other Generation"
            name="otherGeneration"
        >
            <InputNumber defaultValue={bus_data.buses[bus_index][base_year.code].other} addonAfter="MW"/>
        </Form.Item>
        {bus_data.buses[bus_index][base_year.code].nuclear && <Form.Item
            label="Nuclear Generation"
            name="nuclearGeneration"
        >
            <InputNumber defaultValue={bus_data.buses[bus_index][base_year.code].nuclear} addonAfter="MW"/>
        </Form.Item>}
        {bus_data.buses[bus_index][base_year.code].entsoe && <Form.Item
            label="ENTSO-E Generation"
            name="entsoeGeneration"
        >
            <InputNumber defaultValue={bus_data.buses[bus_index][base_year.code].entsoe} addonAfter="MW"/>
        </Form.Item>}
        {bus_data.buses[bus_index][base_year.code].georgia && <Form.Item
            label="Georgia Generation"
            name="georgiaGeneration"
        >
            <InputNumber defaultValue={bus_data.buses[bus_index][base_year.code].georgia} addonAfter="MW"/>
        </Form.Item>}
        </Form>
    );
};