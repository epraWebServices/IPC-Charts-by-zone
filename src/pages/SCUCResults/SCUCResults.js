import React, { useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button';
import { SCUCService } from '../../service/SCUCService';
import { FileDrop } from "react-file-drop";
import Upload from './Upload';
import styles from "./style.module.css";
import { Toast } from 'primereact/toast';

const SCUCResults = () => {
    const scucService = new SCUCService()
    const [loading, setLoading] = useState(false);
    const [analysesType, setAnalysesType] = useState({name: '', code: ''})
    const [scenarioName, setScenarioName] = useState("")
    const [marketFolder, setMarketFolder] = useState("")
    const [networkFolder, setNetworkFolder] = useState("")
    const [selectFile, setSelectFile] = useState(null);
    const toastBR = useRef(null);
    const fileInputRef = useRef(null);
    var XLSX = require('xlsx')
    const dropdownItems = [
        { name: 'Market Simulation', code: 'Market Simulation'},
        { name: 'Network Simulation', code: 'Network Simulation'},
    ];
    
    const changeAnalysesType = (data) =>{
        setAnalysesType(data)
        if(data.code === "Network Simulation"){
            setNetworkFolder("")
        }
        
    }

    function onDrop(files) {
        if (files.length > 1){
            toastBR.current.show({ severity: 'error', summary: 'Error', detail: "Only one file should be uploaded", life: 10000 });
        }
        else{
            if (files[0].name.split(".").pop() === "xls"){
                setSelectFile(files[0])
            }else{
                toastBR.current.show({ severity: 'error', summary: 'Error', detail: "Only .xls files are accepted!", life: 10000 });
            }
        }
        
    }
    const onTargetClick = () => {
        fileInputRef.current.click();
    };

    const onFileInputChange = async (event) => {
    const file = event.target.files[0];
    if (!file) {
        return;
    }
    setSelectFile(file);
    };

      const execute2 = async(e) => { 
        var excel_data = {}  
        var workbook = XLSX.read(e.result, {
            type: 'binary'
        });
        workbook.SheetNames.forEach(function(sheetName) {
        var XL_row_object = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { blankrows: true, defval: null })
        excel_data[sheetName] = XL_row_object
        })

        excel_data = JSON.stringify(excel_data);
        const data = {
            analysesType: analysesType.code, 
            scenarioName: scenarioName,
            marketFolder: marketFolder.endsWith("/") ? marketFolder : marketFolder + "/",
            networkFolder: networkFolder.endsWith("/")? networkFolder : networkFolder + "/",
            file: excel_data,
        }
        toastBR.current.show({ severity: 'success', summary: 'Success', detail: "Your file(s) will be downloaded when they are ready", life: 10000 });
        const res = await scucService.executee(data)
        setLoading(false)
        if (res.success){
            
            for (var i=0; i<Object.keys(res.object.object.body).length; i++){
                let csv = ''
                let header = []
                let values = ''
                const d = res.object.object.body[Object.keys(res.object.object.body)[i]]
                
                if(Object.keys(res.object.object.body)[i] === "Market_Generation" || Object.keys(res.object.object.body)[i] === "Network_Generation"){
                    header = ["Scenario", "Hour", "Total Generation (MW)"]
                    const headers = Object.keys(res.object.object.body[Object.keys(res.object.object.body)[i]][0])
                    for(let k=0; k<headers.length; k++){
                        if(!header.includes(headers[k])){
                            header.splice(header.length-1,0,headers[k]).join()
                        }
                    }
                    //header = ["Scenario","Hour","Gas (MW)","Coal (MW)","Import Coal (MW)","Lignite (MW)","Geothermal (MW)","Biomass (MW)","Hydro (MW)","RoR (MW)","Wind (MW)","PV (MW)","Offshore Wind (MW)","Nuclear (MW)","Other (MW)","ENTSOE (MW)","Georgia (MW)","PumpStorage (MW)","Battery (MW)","Iran (MW)","Iraq (MW)","Syria (MW)","Total Generation (MW)"]
                }
                else if (Object.keys(res.object.object.body)[i] === "CBA_Matrix"){
                    header = ["Scenario","Y2020 400 kV Line (km)","Y2020 154 kV Line (km)","Y2030 TEIAS 400 kV Line (km)","Y2030 TEIAS 154 kV Line (km)","Y2030 Additional 400 kV Line (km)","Y2030 Additional 154 kV Line (km)","Hour","MCP","MCP_Calc (EUR/MWh)","Redispatch (MW)","Curtailment (MW)","Load (MW)"]
                }
                else if (Object.keys(res.object.object.body)[i] === "Bus_Results"){
                    header = ["Scenario","ID","Name","Voltage (kV)","Latitude / Northing (deg)","Longitude / Easting  (deg)","Upward redispatch order (MWh)","Downward redispatch order (MWh)","Wind Curtailment - Market (MWh)","Solar Curtailment - Market (MWh)","Wind Curtailment - Network (MWh)","Solar Curtailment - Network (MWh)"]
                }
                else if (Object.keys(res.object.object.body)[i] === "Commitment_Result"){
                    header = ["Scenario","Type","Unit ID","Capacity (MW)","Market - Number of Committed Hours","Market - Annual Generation (MWh)","Market - Capacity Factor (%)","Network - Number of Committed Hours","Network - Annual Generation (MWh)","Network - Capacity Factor (%)"]
                }
                else if (Object.keys(res.object.object.body)[i] === "Transmission_Line_Results"){
                    header = ["Scenario","Voltage (kV)","From","To","CID","Rating (MW)","Congested Energy Base (MWh)","Number of violations Base","Congested Energy Ctgc (MWh)","Number of violations Ctgc","From Latitude / Northing (deg)","From Longitude / Easting  (deg)","To Latitude / Northing (deg)","To Longitude / Easting  (deg)","Transacted Energy (MWh)","Max Sent (MW)","Max Received (MW)"]
                }
                
                d.map(o => {
                    for(var j=0; j<header.length; j++){
                        values = values + o[header[j]] + ","
                    }
                    values = values + "\n"
                });
                csv += header + '\n' + values;
                const blob = new Blob([csv], { type: 'text/csv' });
                const a = document.createElement("a");
                a.download =  scenarioName + "_" + Object.keys(res.object.object.body)[i] + ".csv";
                a.href = window.URL.createObjectURL(blob);
                const clickEvt = new MouseEvent("click", {
                view: window,
                bubbles: true,
                cancelable: true,
                });
                a.dispatchEvent(clickEvt);
                a.remove();
            }
        }
        else{
            toastBR.current.show({ severity: 'error', summary: 'Error', detail: "An error occured in the engine. Please contact to admin.", life: 10000 });
        }
    }
    const execute = async () => {
        setLoading(true)
        var reader = new FileReader()
        
        reader.addEventListener('load', function(){
            execute2(this)
        });
        
        reader.readAsArrayBuffer(selectFile)
    }
    return (
        <div className="grid crud-demo">
            <Toast ref={toastBR} position="top-right" />
            <div className="col-12">
                <div className="card">
                    <div>
                        <h5>Analyses Type</h5>
                        <Dropdown value={analysesType} onChange={(e) => changeAnalysesType(e.value)} 
                        options={dropdownItems} optionLabel="name" placeholder="Select Analyses Type" style={{width:'30%'}}>
                        </Dropdown> 
                    </div>
                    <div style={{paddingTop:"20px"}}>
                        <h5>Scenario Name</h5>
                        <InputText id="Scenario Name" autoComplete='off' value = {scenarioName} style={{width:"30%"}} 
                        onChange={(e) => setScenarioName(e.target.value)} placeholder="Set Scenario Name">
                        </InputText>
                    </div>
                    {analysesType.code === "Market Simulation" && 
                    <div style={{paddingTop:"20px"}}>
                        <h5>Market Result Folder Path</h5>
                        <InputText autoComplete='off' value = {marketFolder} style={{width:"30%"}} 
                        onChange={(e) => setMarketFolder(e.target.value.replace(/\\/g, "/"))} placeholder="Set Market Result Folder Path">
                        </InputText>
                    </div>}
                    {analysesType.code === "Network Simulation" && 
                    <div style={{paddingTop:"20px"}}>
                        <h5>Market Result Folder Path</h5>
                        <InputText autoComplete='off' value = {marketFolder} style={{width:"30%"}} 
                        onChange={(e) => setMarketFolder(e.target.value.replace(/\\/g, "/"))} placeholder="Set Market Result Folder Path">
                        </InputText>
                        <h5>Network Result Folder Path</h5>
                        <InputText autoComplete='off' value = {networkFolder} style={{width:"30%"}} 
                        onChange={(e) => setNetworkFolder(e.target.value.replace(/\\/g, "/"))} placeholder="Set Network Result Folder Path">
                        </InputText>
                    </div>}
                    <div style={{paddingTop:"20px"}}>
                        <h5>Excel File</h5>
                    </div>
                    <input
                        onChange={onFileInputChange}
                        ref={fileInputRef}
                        type="file"
                        accept=".xls"
                        className={styles.hidden}
                    />
                    <div className={styles.text}>
                        <p>
                        {selectFile !== null ? (
                            <>
                            {selectFile.name}
                            <span
                                className={styles.x}
                                onClick={() => setSelectFile(null)}
                            >
                                ✕
                            </span>
                            </>
                        ) : (
                            "Choose a file..."
                        )}
                        </p>
                    </div>
                    <div style={{width:"30%"}}>
                    <FileDrop
                    
                        onDrop={files => onDrop(files)}
                        onTargetClick={onTargetClick}
                        targetClassName={styles.target}
                        className={styles.filedrop}
                        draggingOverFrameClassName={styles.filedropDrag}
                    >
                        <>
                        <Upload className={styles.icon} />
                        Click or drag and drop file
                        </>
                    </FileDrop>
                    </div>
                    
                    
                    <Divider align="right">
                        <Button 
                        loading={loading}
                        disabled = {!(analysesType && scenarioName && marketFolder && selectFile && 
                            (analysesType.code === "Market Simulation" || (analysesType.code === "Network Simulation" && networkFolder)))}
                        label="Execute" style={{color:"white"}}  icon="pi pi-search" className="p-button-outlined" onClick={execute} ></Button>
                    </Divider>
                </div>
            </div>
        </div>
    )
    }
    
export default SCUCResults;