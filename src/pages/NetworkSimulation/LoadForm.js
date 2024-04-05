import React from "react";
import { Form, Switch, InputNumber } from "antd";

export const LoadForm = ({ form, onFinish, bus_data, bus_index, base_year}) => {
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
            label="Consumption"
            name="consumption"
        >
            <InputNumber defaultValue={bus_data.buses[bus_index][base_year.code].load} addonAfter="MW"/>
        </Form.Item>
        <Form.Item
            label="Activated"
            name="activated"
        >
            <Switch defaultChecked={bus_data.buses[bus_index][base_year.code].Load.active}></Switch>
        </Form.Item>
        </Form>
    );
};