
import React, { useState, useEffect } from 'react';

import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Divider } from 'primereact/divider';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
const EpiasData = () => {
    const [data_selected, SetData] = useState([]);
    const [date1, SetDate1] = useState();
    const [date2, SetDate2] = useState();
    const [results, SetResults] = useState()
    useEffect(() => {
        SetData(data_selected)
        SetDate1(date1)
        SetDate2(date2)
        SetResults(results)
    },[data_selected, date1, date2, results]);

    const which_data = [
        {name:'Day a head market table (MCP)', code:'MCP'},
        {name:'Day a head market volume response', code:'DAM_volume'},
        {name:'Intraday market hourly prices (TL)', code:'IDM'},
        {name:'Bilateral contract hourly buy list (MWh)', code:'bileteral_buy'},
        {name:'Hourly generations for all types of generators', code:'generation'},
        {name:'YEKDEM unlicenced generations', code:'yekdem_unlicenced'},
        {name:'RES generation and forecast (MW)', code:'res_forecast'},
        {name:'Installed generation capacity (YEKDEM & Others)', code:'installed_cap'},
        {name:'Generation type based installed RES capacity (MW)', code:'installed_res'},
        {name:'Hourly load estimation plan (MWh)', code:'load_estimation'},
        {name:'Hourly real consumption (MWh)', code:'real_consumption'},
    ]

    const changeData = data_selected => {
        SetData(data_selected)
    }
    const date1Change = date1 => {
        SetDate1(date1)
    }
    const date2Change = date2 => {
        SetDate2(date2)
    }

    const result_graphs = () => {
        return(
            <div></div>
        )
    }

    const execute = async () => {
        const timezone = date1.getTimezoneOffset() / -60
        var date1_a = new Date()
        date1_a.setTime(date1.getTime()+ (timezone*60*60*1000))
        const date1ISO = date1_a.toISOString().split('T')[0]
        var date2_a = new Date()
        date2_a.setTime(date2.getTime()+ (timezone*60*60*1000))
        const date2ISO = date2_a.toISOString().split('T')[0]
        const data = {
            which_data: data_selected.code,
            
            start_date: date1ISO,
            end_date: date2ISO
        }
        const url = 'http://192.168.1.89:3000/exportData'
        fetch(url,{
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }}).then(res => res.json()).then(data => {

            SetResults(JSON.parse(data.result))
            
            })

    }
    return (
    <div className="col-12">
    <div className="card">
        <h4>Export Data from EPİAŞ Transparency Platform</h4>
        <div className='grid'>
            <div className="col-4">
                <div className="p-fluid">
                    <div className="field" style={{paddingBottom:"5px"}}>
                        <label style={{fontSize:"20px"}}>Data <img src="./info_V1.png" title="Info if necessary"/></label>
                        <Dropdown value={data_selected} onChange={(e) => changeData(e.value)} options={which_data} optionLabel="name" placeholder="Select Data Type" style={{width:'410px'}}></Dropdown> 
                    </div>
                    <div>
                        <label style={{fontSize:"20px"}}>Start Date</label>
                        <Calendar onChange={date1Change} value={date1} />
                    </div>
                    <br></br>
                    <div>
                        <label style={{fontSize:"20px"}}>End Date</label>
                        <Calendar onChange={date2Change} value={date2} />
                    </div>                       
                </div>   
            </div>
        </div>
        <Divider align="right">
            <Button label="Execute" style={{color:"white"}}  icon="pi pi-search" className="p-button-outlined" onClick={execute} ></Button>
        </Divider>
    </div>
    </div>
    );
}


export default EpiasData;